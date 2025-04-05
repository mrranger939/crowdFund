use anchor_lang::prelude::*;

use crate::{
    constants::ANCHOR_DISCRIMINATOR,
    states::{ Campaign, ProgramState, Transaction},
};

use crate::errors::ErrorCode::*;

pub fn donate(ctx: Context<Donatectx>, cid: u64, amount: u64) -> Result<()> {
    let campaign = &mut ctx.accounts.campaign;
    let donor = &mut ctx.accounts.donor;
    let transaction = &mut ctx.accounts.transaction;

    if campaign.cid != cid {
        return Err(CampaignNotFound.into());
    }

    if !campaign.active {
        return Err(InActiveCampaign.into());
    }

    if amount <= 1_000_000_000 {
        return Err(InvalidDonationAmount.into());
    }

    if campaign.amount_raised >= campaign.goal {
        return Err(CampaignGoalReached.into());
    }

    let tx_instruction = anchor_lang::solana_program::system_instruction::transfer(
        &donor.key(),
        &campaign.key(),
        amount,
    );
    let result = anchor_lang::solana_program::program::invoke(
        &tx_instruction,
        &[donor.to_account_info(), campaign.to_account_info()],
    );

    if let Err(e) = result {
        msg!("Donation transfer failer: {:?}", e);
        return Err(e.into());
    }

    campaign.amount_raised += amount;
    campaign.balance += amount;
    campaign.donors += 1;

    transaction.amount = amount;
    transaction.cid = cid;
    transaction.owner = donor.key();
    transaction.timestamp = Clock::get()?.unix_timestamp as u64;
    transaction.credited = true;

    Ok(())
}

#[derive(Accounts)]
#[instruction(cid: u64, amount: u64)]
pub struct Donatectx<'info> {
    #[account(mut)]
    pub donor: Signer<'info>,
    #[account(
        mut,
        seeds = [b"campaign", cid.to_le_bytes().as_ref()],
        bump
    )]
    pub campaign: Account<'info, Campaign>,

    #[account(
        init,
        space= ANCHOR_DISCRIMINATOR + Transaction::INIT_SPACE,
        payer=donor,
        seeds = [b"donor", donor.key().as_ref(),
                cid.to_le_bytes().as_ref(),
                (campaign.donors + 1).to_le_bytes().as_ref()
                ],
        bump
    )]
    pub transaction: Account<'info, Transaction>,
    pub system_program: Program<'info, System>,
}
