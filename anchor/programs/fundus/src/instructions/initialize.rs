use anchor_lang::prelude::*;

use crate::{constants::ANCHOR_DISCRIMINATOR, states::ProgramState};
use crate::errors::ErrorCode::AlreadyInitialized;

pub fn initialize(ctx: Context<InitializeCtx>) -> Result<()> {
    let state = &mut ctx.accounts.program_state;
    let deployer = &ctx.accounts.deployer;
    if state.initialized {
        return Err(AlreadyInitialized.into());
    }
    state.campaign_count = 0;
    state.platform_fee = 3;
    state.platform_address = deployer.key();
    state.initialized = true;

    Ok(())
}


#[derive(Accounts)]
pub struct InitializeCtx<'info>{
    #[account(mut)]
    pub deployer: Signer<'info>,
    #[account(
        init,
        payer = deployer,
        space = ANCHOR_DISCRIMINATOR + ProgramState::INIT_SPACE,
        seeds = [b"program_state"],
        bump,
    )]
    pub program_state: Account<'info, ProgramState>,

    pub system_program: Program<'info, System>,
}