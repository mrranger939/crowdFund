import { AnchorProvider, BN, Program, Wallet } from "@coral-xyz/anchor";
import { Connection, PublicKey, SystemProgram, TransactionSignature } from "@solana/web3.js";
import { Fundus } from "../../anchor/target/types/fundus";
import idl from "../../anchor/target/idl/fundus.json";
import { Campaign, ProgramState, Transaction } from "@/utils/interfaces";
import { campaigns } from "@/data";
import { publicKey } from "@coral-xyz/anchor/dist/cjs/utils";
import { store } from "@/store";
import { globalActions } from "@/store/globalSlices";
import { getClusterURL } from "@/utils/helper";



const CLUSTER: string = process.env.NEXT_PUBLIC_CLUSTER || "localhost";
const RPC_URL: string = getClusterURL(CLUSTER);



const {setCampaign, setDonations, setWithdrawals, setStates} = globalActions


export const getProvider = (
  publicKey: PublicKey | null,
  signTransaction: any,
  sendTransaction: any
): Program<Fundus> | null => {
    if (!publicKey || !signTransaction) {
        console.error("Wallet not connected or missing sign transaction");
        return null;
    }
    console.log(`Wallet Connected ${publicKey}`)
    
    const connection = new Connection(RPC_URL);
    const provider = new AnchorProvider(
        connection,
        {publicKey, signTransaction, sendTransaction} as unknown as Wallet,
        {commitment: 'processed'}
    );
    
    return new Program(idl as any, provider);
};

export const getProviderReadOnly = (): Program<Fundus> => {
  const connection = new Connection(RPC_URL, 'confirmed')

  const walllet = {
    publicKey: PublicKey.default,
    signTransaction: async () => {
      throw new Error('Read-only provider cannot sign transactions.')
    },
    signAllTransaction: async () => {
      throw new Error('Read-only provider cannot sign transactions.')
    },
  }

  const provider = new AnchorProvider(
    connection,
    walllet as unknown as Wallet,
    { commitment: 'processed' }
  )

  return new Program<Fundus>(idl as any, provider)
}


export const createCampaign = async (
  program: Program<Fundus>,
  publicKey: PublicKey,
  title: string,
  description: string,
  image_url: string,
  goal: number
): Promise<TransactionSignature> => {
    // Store the connection for reuse
    const connection = new Connection(RPC_URL, 'confirmed');

    const [programStatePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("program_state")],
      program.programId
    );
    
    const state = await program.account.programState.fetch(programStatePda);
    const CID = state.campaignCount.add(new BN(1));
    
    const [campaignPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("campaign"), CID.toArrayLike(Buffer, 'le', 8)], 
        program.programId
    );

    const goalBN = new BN(goal * 1_000_000_000);

    const tx = await program.methods
      .createCampaign(title, description, image_url, goalBN)
      .accountsPartial({
          programState: programStatePda,
          campaign: campaignPda,
          creator: publicKey,
          systemProgram: SystemProgram.programId,
      })
      .rpc();

    // Use the defined connection instead of trying to access it through program.provider
    await connection.confirmTransaction(tx, 'finalized');

    return tx;
};

export const fetchActiveCampaign = async (
  program: Program<Fundus>,
): Promise<Campaign[]> => {
  const campaigns = await program.account.campaign.all()
  const activeCampaigns = campaigns.filter((c)=> c.account.active)
  return serializedCampaigns(activeCampaigns)
}

const serializedCampaigns = (campaigns: any[]): Campaign[] => {
  return  campaigns.map((c:any)=>({
    ...c.account,
    publicKey: c.publicKey.toBase58(),
    cid: c.account.cid.toNumber(),
    creator: c.account.creator.toBase58(),
    goal: c.account.goal.toNumber()/ 1e9,
    amountRaised: c.account.amountRaised.toNumber()/ 1e9,
    timestamp: c.account.timestamp.toNumber()*1000,
    donors: c.account.donors.toNumber(),
    withdrawals: c.account.withdrawals.toNumber(),
    balance: c.account.balance.toNumber()/ 1e9,

  }))
  
}

export const fetchCampaignDetails = async (
  program: Program<Fundus>,
  pda: string
): Promise<Campaign> => {
  const campaign = await program.account.campaign.fetch(pda);
  const serialize: Campaign = {
    ...campaign,
    publicKey: pda,
    cid: campaign.cid.toNumber(),
    creator: campaign.creator.toBase58(),
    goal: campaign.goal.toNumber() / 1e9,
    amountRaised: campaign.amountRaised.toNumber()/ 1e9,
    timestamp: campaign.timestamp.toNumber() * 1000 ,
    donors: campaign.donors.toNumber(),
    withdrawals: campaign.withdrawals.toNumber(),
    balance: campaign.balance.toNumber()/ 1e9,
  } 

  store.dispatch(setCampaign(serialize))

  return serialize
}


//donate
export const donateToCampaign = async (
  program: Program<Fundus>,
  publicKey: PublicKey,
  pda: string,
  amount: number
): Promise<TransactionSignature> => {
    
    const connection = new Connection(RPC_URL, 'confirmed');

    const campaign = await program.account.campaign.fetch(pda);

    const [transactionPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("donor"),
        publicKey.toBuffer(), 
        campaign.cid.toArrayLike(Buffer, 'le', 8),
        campaign.donors.add(new BN(1)).toArrayLike(Buffer, 'le', 8),
      ], 
      program.programId
    )
    

    const tx = await program.methods
    .donate(campaign.cid, new BN(Math.round(amount*1_000_000_000)))
    .accountsPartial({
      campaign: pda,
      transaction: transactionPda,
      donor: publicKey,
      systemProgram: SystemProgram.programId,
    })
    .rpc()

    await connection.confirmTransaction(tx, 'finalized');

    return tx;
};

export const fetchAllDonations = async (
  program: Program<Fundus>,
  pda:string
): Promise<Transaction[]> => {
  const campaign = await program.account.campaign.fetch(pda)
  const transcations = await program.account.transaction.all()
  const donationTransactions = transcations.filter((tx)=> {return tx.account.cid.eq(campaign.cid) && tx.account.credited})
  store.dispatch(setDonations(serializedTx(donationTransactions)))
  return serializedTx(donationTransactions)
}

export const fetchAllWithdrawals = async (
  program: Program<Fundus>,
  pda:string
): Promise<Transaction[]> => {
  const campaign = await program.account.campaign.fetch(pda)
  const transcations = await program.account.transaction.all()
  const withdrawTransactions = transcations.filter((tx)=> {return tx.account.cid.eq(campaign.cid) && !tx.account.credited})
  store.dispatch(setWithdrawals(serializedTx(withdrawTransactions)))
  return serializedTx(withdrawTransactions)
}

const serializedTx = (transactions: any[]): Transaction[] => {
  return  transactions.map((c:any)=>({
    ...c.account,
    publicKey: c.publicKey.toBase58(),
    cid: c.account.cid.toNumber(),
    owner: c.account.owner.toBase58(),
    timestamp: c.account.timestamp.toNumber()*1000,
    amount: c.account.amount.toNumber()/ 1e9,

  }))
  
}

export const fetchUserCampaign = async (
  program: Program<Fundus>,
  publicKey: PublicKey
): Promise<Campaign[]> => {
  const campaigns = await program.account.campaign.all()
  const userCampaigns = campaigns.filter((c)=> {
    return c.account.creator.toBase58() == publicKey.toBase58()
  })
  return serializedCampaigns(userCampaigns)
}

export const fetchProgramState = async (
  program: Program<Fundus>,
): Promise<ProgramState> => {
  const [programStatePda] = PublicKey.findProgramAddressSync(
    [Buffer.from("program_state")],
    program.programId
  );
  const programState = await program.account.programState.fetch(programStatePda);
  const serialize: ProgramState = {
    ...programState,
    campaignCount: programState.campaignCount.toNumber(),
    platformFee : programState.platformFee.toNumber(),
    platformAddress: programState.platformAddress.toBase58()
  }
  store.dispatch(setStates(serialize))
  return serialize
}

//withdraw
export const withdrawFromCampaign = async (
  program: Program<Fundus>,
  publicKey: PublicKey,
  pda: string,
  withdrawAmount: number
): Promise<TransactionSignature> => {
    
    const connection = new Connection(RPC_URL, 'confirmed');

    const campaign = await program.account.campaign.fetch(pda);

        const [transactionPda] = PublicKey.findProgramAddressSync(
          [Buffer.from("withdraw"),
            publicKey.toBuffer(), 
            campaign.cid.toArrayLike(Buffer, 'le', 8),
            campaign.withdrawals.add(new BN(1)).toArrayLike(Buffer, 'le', 8),
          ], 
          program.programId
        )
    
    const [programStatePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("program_state")],
      program.programId
      )

      const programState = await program.account.programState.fetch(programStatePda);

        const tx = await program.methods
        .withdraw(campaign.cid, new BN(Math.round(withdrawAmount*1_000_000_000)))
        .accountsPartial({
        
          campaign: pda,
          transaction: transactionPda,
          withdrawer: publicKey,
          systemProgram: SystemProgram.programId,
          programState: programStatePda,
          platformAddress: programState.platformAddress
          
        })
        .rpc()

    await connection.confirmTransaction(tx, 'finalized');

    return tx;
};

//updating a campaign
export const updateCampaign = async (
  program: Program<Fundus>,
  publicKey: PublicKey,
  title: string,
  description: string,
  image_url: string,
  goal: number,
  pda: string
): Promise<TransactionSignature> => {

    const connection = new Connection(RPC_URL, 'confirmed');
    const campaign = await program.account.campaign.fetch(pda);

    
    const goalBN = new BN(goal * 1_000_000_000);
    const tx = await program.methods
    .updateCampaign(campaign.cid, title, description, image_url, goalBN)
    .accountsPartial({
        campaign: pda,
        creator: publicKey,
        systemProgram: SystemProgram.programId,
    })
    .rpc()


    await connection.confirmTransaction(tx, 'finalized');

    return tx;
};

// delete

export const deleteCampaign = async (
  program: Program<Fundus>,
  publicKey: PublicKey,
  pda: string
): Promise<TransactionSignature> => {
    const connection = new Connection(RPC_URL, 'confirmed');
    const campaign = await program.account.campaign.fetch(pda);
    const tx = await program.methods
    .deleteCampaign(campaign.cid)
    .accountsPartial({
        campaign: pda,
        creator: publicKey,
        systemProgram: SystemProgram.programId,
    })
    .rpc()
    await connection.confirmTransaction(tx, 'finalized');
    return tx;
};

// update platform fee
export const UpdatePlatformFee = async (
  program: Program<Fundus>,
  publicKey: PublicKey,
  percent: number,
): Promise<TransactionSignature> => {
    const connection = new Connection(RPC_URL, 'confirmed');
        
    const [programStatePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("program_state")],
      program.programId
      )
   
    const tx = await program.methods
    .updatePlatformSettings(new BN(percent))
    .accountsPartial({
        programState: programStatePda,
        updater: publicKey
    })
    .rpc()
    await connection.confirmTransaction(tx, 'finalized');
    return tx;
};