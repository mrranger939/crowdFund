import { AnchorProvider, BN, Program, Wallet } from "@coral-xyz/anchor";
import { Connection, PublicKey, SystemProgram, TransactionSignature } from "@solana/web3.js";
import { Fundus } from "../../anchor/target/types/fundus";
import idl from "../../anchor/target/idl/fundus.json";
const getClusterURL = (cluster: string): string => {
  const clusterUrl: any = {
    "mainnet-beta": "https://api.mainnet-beta.solana.com",
    testnet: "https://api.testnet.solana.com",
    devnet: "https://api.devnet.solana.com",
    localhost: "http://127.0.0.1:8899",
  };

  return clusterUrl[cluster];
};

let tx: any;
const CLUSTER: string = process.env.NEXT_PUBLIC_CLUSTER || "localhost";
const RPC_URL: string = getClusterURL(CLUSTER);

export const getProvider = (
  publicKey: PublicKey | null,
  sendTransaction: any,
  signTransaction: any
): Program<Fundus> | null => {
    if( !publicKey || !signTransaction){
        console.error("Wallet not connected or missing sign transaction")
        return null;
    };
    const connection = new Connection(RPC_URL);
    const provider = new AnchorProvider(
        connection,
        {publicKey, signTransaction, sendTransaction} as unknown as Wallet,
        {commitment: 'processed'}
    )
    return new Program(idl as any, provider)
}

export const getProviderReadOnly = (
    publicKey: PublicKey,
    sendTransaction: any,
    signTransaction: any
  ): Program<Fundus> => {
    const connection = new Connection(RPC_URL, 'confirmed')
     const wallet = {
        publicKey: PublicKey.default,
        signTransaction: async ()=>{
            throw new Error("Read only provider cannot sign transactions")
        },
        signAllTransaction: async ()=>{
            throw new Error("Read only provider cannot sign transactions")
        }
     }

     const provider = new AnchorProvider(connection, wallet as unknown as Wallet, {commitment: 'processed'})
     
     return new Program(idl as any, provider)
     
  }

export const createCampaign = async (
  program: Program<Fundus>,
  publicKey: PublicKey,
  title: string,
  description: string,
  image_url: string,
  goal: number
  ): Promise<TransactionSignature>=>{

    const [programStatePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("program_state")],
      program.programId
      )
      const state = await program.account.programState.fetch(programStatePda)
      const CID = state.campaignCount.add(new BN(1))
      const [campaignPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("campaign"), CID.toArrayLike(Buffer, 'le', 8)], 
        program.programId
      )

      const goalBN = new BN(goal*1_000_000_000);

      const tx = await program.methods
      .createCampaign(title, description, image_url, goalBN)
      .accountsPartial({
          programState: programStatePda,
          campaign: campaignPda,
          creator: publicKey,
          systemProgram: SystemProgram.programId,
      })
      .rpc()

      const connection = new Connection(
        program.provider.connection.rpcEndpoint,
        'confirmed'
      )

      await connection.confirmTransaction(tx, 'finalized')

      return tx
  }
