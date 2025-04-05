import {Fundus} from '../target/types/fundus'
import * as anchor from '@coral-xyz/anchor'
import fs from 'fs'
import idl from '../target/idl/fundus.json'

const {PublicKey, SystemProgram} = anchor.web3

// defines the cluster
const main = async (cluster: string) => {
    const clusterUrl: any = {
        'mainnet-beta': 'https://api.mainnet-beta.solana.com',
        testnet: 'https://api.testnet.solana.com',
        devnet: 'https://api.devnet.solana.com',
        localhost: 'http://localhost:8899',
    }

    //create a connection to the cluster
    const connection = new anchor.web3.Connection(
        clusterUrl[cluster], 'confirmed'
    )   

    // load the wallet from deployer
    const keypairPath = `${process.env.HOME}/.config/solana/id.json`
    const keypairData = JSON.parse(fs.readFileSync(keypairPath, 'utf-8'))

    const wallet = anchor.web3.Keypair.fromSecretKey(Uint8Array.from(keypairData))
    
    //creating a provider
    const provider = new anchor.AnchorProvider(
        connection,
        new anchor.Wallet(wallet),
        {
            commitment: 'confirmed',
        }
    )

    anchor.setProvider(provider)

    // loading the program
    const program = new anchor.Program<Fundus>(idl as any, provider)
    
    const [programStatePda] = PublicKey.findProgramAddressSync(
        [Buffer.from("program_state")],
        program.programId
    )

    try {

        const state = await program.account.programState.fetch(programStatePda)
        console.log(`Program initialised, status: ${state.initialized}`)

    } catch(e) {

        const tx = await program.methods
        .initialize()
        .accountsPartial({
            programState: programStatePda,
            deployer: provider.wallet.publicKey,
            systemProgram: SystemProgram.programId,
        })
        .rpc()

        await connection.confirmTransaction(tx, 'finalized')
        console.log(`Program initialised successfully.`, tx)
        
    }
}

const cluster: string = process.env.NEXT_PUBLIC_RPC_URL || 'localhost'
main(cluster).catch((error)=> console.log(error))