use anchor_lang::prelude::*;

use crate::{
    constants::ANCHOR_DISCRIMINATOR,
    states::{ Campaign, ProgramState, Transaction},
};

use crate::errors::ErrorCode::*;


pub fn update_platform_settings(ctx: Context<UpdateCampaignSettings>, new_platform_fee: u64,) -> Result<()> {
    let state = &mut ctx.accounts.program_state;
    let updater = &ctx.accounts.updater;
    if updater.key() != state.platform_address{
        return Err(UnauthorisedAccess.into());
    }
    if !(1..=15).contains(&new_platform_fee) {
        return Err(InvalidPlatformFee.into());
    }

    state.platform_fee = new_platform_fee;


    Ok(())
}

#[derive(Accounts)]
pub struct  UpdateCampaignSettings<'info> {
    #[account(mut)]
    pub updater: Signer<'info>,
    #[account(mut,
    seeds = [b"program_state"],
    bump,)]
    pub program_state: Account<'info, ProgramState>,
}