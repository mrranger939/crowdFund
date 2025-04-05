import * as anchor from '@coral-xyz/anchor'
const {PublicKey, SystemProgram} = anchor.web3
import {Fundus} from '../target/types/fundus'
import idl from '../target/idl/fundus.json'


describe('fundus', ()=> {
      const provider = anchor.AnchorProvider.local()
      anchor.setProvider(provider)
      const program = new anchor.Program<Fundus>(idl as any, provider)

      let CID: any, DONORS_COUNT: any, WITHDRAW_COUNT: any;

      it("creates a campaign", async ()=>{
        const creator = provider.wallet
        const [programStatePda] = PublicKey.findProgramAddressSync(
          [Buffer.from("program_state")],
          program.programId
          )
        const state = await program.account.programState.fetch(programStatePda)
        CID = state.campaignCount.add(new anchor.BN(1))
        const [campaignPda] = PublicKey.findProgramAddressSync(
          [Buffer.from("campaign"), CID.toArrayLike(Buffer, 'le', 8)], 
          program.programId
        )
        const title = `Test Campaign #${CID.toString()}`
        const description = `Test Description #${CID.toString()}`
        const image_url = `https://dummy_image_${CID.toString()}.png`
        const goal = new anchor.BN(20*1_000_000_000)

        const tx = await program.methods
        .createCampaign(title, description, image_url, goal)
        .accountsPartial({
            programState: programStatePda,
            campaign: campaignPda,
            creator: creator.publicKey,
            systemProgram: SystemProgram.programId,
        })
        .rpc()

        console.log("transaction signature", tx);

        const campaign = await program.account.campaign.fetch(campaignPda)
        console.log("campaign: ", campaign)
        DONORS_COUNT = campaign.donors;
        WITHDRAW_COUNT = campaign.withdrawals;
      })
      


      it("Update a campaign", async ()=>{
        const creator = provider.wallet

        const [campaignPda] = PublicKey.findProgramAddressSync(
          [Buffer.from("campaign"), CID.toArrayLike(Buffer, 'le', 8)], 
          program.programId
        )
        const newtitle = `Update Test Campaign #${CID.toString()}`
        const newdescription = `Update Test Description #${CID.toString()}`
        const newimage_url = `https://dummy_image_${CID.toString()}.png`
        const newgoal = new anchor.BN(21*1_000_000_000)

        const tx = await program.methods
        .updateCampaign(CID, newtitle, newdescription, newimage_url, newgoal)
        .accountsPartial({
            campaign: campaignPda,
            creator: creator.publicKey,
            systemProgram: SystemProgram.programId,
        })
        .rpc()

        console.log("update transaction signature", tx);

        const campaign = await program.account.campaign.fetch(campaignPda)
        console.log("campaign: ", campaign)

      })


      it("update campaign fee", async ()=>{
        const deployer = provider.wallet

        const [programStatePda] = PublicKey.findProgramAddressSync(
          [Buffer.from("program_state")],
          program.programId
          )

        const stateBefore = await program.account.programState.fetch(programStatePda)
        console.log("stateBefore: ", stateBefore);
        const tx = await program.methods
        .updatePlatformSettings(new anchor.BN(4))
        .accountsPartial({
            programState: programStatePda,
            updater: deployer.publicKey
        })
        .rpc()

        console.log("update fee transaction signature", tx);
        const stateAfter = await program.account.programState.fetch(programStatePda)
        console.log("stateAfter: ", stateAfter);
      })

      it("donate to campaign", async ()=>{
        const donor = provider.wallet

        const [campaignPda] = PublicKey.findProgramAddressSync(
          [Buffer.from("campaign"), CID.toArrayLike(Buffer, 'le', 8)], 
          program.programId
        )

        const donorBefore = await provider.connection.getBalance(donor.publicKey)


        const [transactionPda] = PublicKey.findProgramAddressSync(
          [Buffer.from("donor"),
            donor.publicKey.toBuffer(), 
            CID.toArrayLike(Buffer, 'le', 8),
            DONORS_COUNT.add(new anchor.BN(1)).toArrayLike(Buffer, 'le', 8),
          ], 
          program.programId
        )

        const campaignBalanceBefore = await provider.connection.getBalance(campaignPda);

        const tx = await program.methods
        .donate(CID, new anchor.BN(Math.round(12.5*1_000_000_000)))
        .accountsPartial({
          campaign: campaignPda,
          transaction: transactionPda,
          donor: donor.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc()

        console.log("Donation transaction signature", tx);
        const transaction = await program.account.transaction.fetch(transactionPda)
        console.log("transaction pda donation: ", transaction);

        const donorAfter = await provider.connection.getBalance(donor.publicKey)
        console.log("Donor balance before: ", donorBefore)
        console.log("Donor balance After: ", donorAfter)
        const campaignBalanceAfter = await provider.connection.getBalance(campaignPda);
        console.log("Campaign Balance Before: ", campaignBalanceBefore)
        console.log("Campaign Balance After,: ", campaignBalanceAfter,)
      })

      it("withdraw from campaign", async ()=>{
        const withdrawer = provider.wallet

        const [campaignPda] = PublicKey.findProgramAddressSync(
          [Buffer.from("campaign"), CID.toArrayLike(Buffer, 'le', 8)], 
          program.programId
        )
        const [programStatePda] = PublicKey.findProgramAddressSync(
          [Buffer.from("program_state")],
          program.programId
          )
        const withdrawerBefore = await provider.connection.getBalance(withdrawer.publicKey)


        const [transactionPda] = PublicKey.findProgramAddressSync(
          [Buffer.from("withdraw"),
            withdrawer.publicKey.toBuffer(), 
            CID.toArrayLike(Buffer, 'le', 8),
            WITHDRAW_COUNT.add(new anchor.BN(1)).toArrayLike(Buffer, 'le', 8),
          ], 
          program.programId
        )

        const campaignBalanceBefore = await provider.connection.getBalance(campaignPda);

        const programState = await program.account.programState.fetch(programStatePda);

        const platformBalanceBefore = await provider.connection.getBalance(programState.platformAddress);
        const tx = await program.methods
        .withdraw(CID, new anchor.BN(Math.round(4*1_000_000_000)))
        .accountsPartial({
          campaign: campaignPda,
          transaction: transactionPda,
          withdrawer: withdrawer.publicKey,
          systemProgram: SystemProgram.programId,
          programState: programStatePda,
          platformAddress: programState.platformAddress
          
        })
        .rpc()
        const platformBalanceAfter = await provider.connection.getBalance(programState.platformAddress);
        console.log("Withdraw transaction signature", tx);
        const transaction = await program.account.transaction.fetch(transactionPda)
        console.log("transaction pda withdraw: ", transaction);

        const withdrawerAfter = await provider.connection.getBalance(withdrawer.publicKey)
        console.log("Withdrawer balance before: ", withdrawerBefore)
        console.log("Withdrawer balance After: ", withdrawerAfter)
        const campaignBalanceAfter = await provider.connection.getBalance(campaignPda);
        console.log("Campaign Balance Before: ", campaignBalanceBefore)
        console.log("Campaign Balance After,: ", campaignBalanceAfter)
        console.log("Platform balance after: ",platformBalanceBefore)
        console.log("Platform balance after: ",platformBalanceAfter)
      })

            
      it("delete a campaign", async ()=>{
        const creator = provider.wallet

        const [campaignPda] = PublicKey.findProgramAddressSync(
          [Buffer.from("campaign"), CID.toArrayLike(Buffer, 'le', 8)], 
          program.programId
        )

        const tx = await program.methods
        .deleteCampaign(CID)
        .accountsPartial({
            campaign: campaignPda,
            creator: creator.publicKey,
            systemProgram: SystemProgram.programId,
        })
        .rpc()

        console.log("delete transaction signature", tx);

        const campaign = await program.account.campaign.fetch(campaignPda)
        console.log("campaign: ", campaign)

      })

})