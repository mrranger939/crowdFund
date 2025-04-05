use anchor_lang::prelude::*;

use crate::{
    constants::ANCHOR_DISCRIMINATOR,
    states::{self, campaign, Campaign, ProgramState, Transaction},
};

use crate::errors::ErrorCode::*;


pub fn withdraw(ctx: Context<Withdrawctx>, cid: u64, amount: u64) -> Result<()> {
    let campaign = &mut ctx.accounts.campaign;
    let withdrawer = &ctx.accounts.withdrawer;
    let transaction = &mut ctx.accounts.transaction;
    let state = &mut ctx.accounts.program_state;
    let platform_account_info = &ctx.accounts.platform_address;

    if campaign.cid != cid {
        return Err(CampaignNotFound.into());
    }

    if campaign.creator != withdrawer.key() {
        return Err(UnauthorisedAccess.into());
    }


    if amount <= 1_000_000_000 {
        return Err(InvalidWithdrawAmount.into());
    }

    if amount >= campaign.balance {
        return Err(InsufficientFund.into());
    }

    if platform_account_info.key() != state.platform_address{
        return Err(InvalidPlatformAddress.into());
    }

    let rent_balance = Rent::get()?.minimum_balance(campaign.to_account_info().data_len());
    if amount > **campaign.to_account_info().lamports.borrow() - rent_balance{
        msg!("Withdrawal exceed campaign usable balance");
        return Err(InsufficientFund.into());
    } 

    let platform_fee = amount * state.platform_fee/100;
    let create_amount = amount - platform_fee;

    // Transferring 97% to creator

    **campaign.to_account_info().try_borrow_mut_lamports()? -= create_amount;
    **withdrawer.to_account_info().try_borrow_mut_lamports()? += create_amount;

    **campaign.to_account_info().try_borrow_mut_lamports()? -= platform_fee;
    **platform_account_info.to_account_info().try_borrow_mut_lamports()? += platform_fee;

    campaign.withdrawals += 1;
    campaign.balance -= amount;

    transaction.amount = amount;
    transaction.cid = cid;
    transaction.owner = withdrawer.key();
    transaction.timestamp = Clock::get()?.unix_timestamp as u64;
    transaction.credited = false;

    Ok(())
}


#[derive(Accounts)]
#[instruction(cid: u64, amount: u64)]
pub struct Withdrawctx<'info> {
    #[account(mut)]
    pub withdrawer: Signer<'info>,
    #[account(
        mut,
        seeds = [b"campaign", cid.to_le_bytes().as_ref()],
        bump
    )]
    pub campaign: Account<'info, Campaign>,

    #[account(
        init,
        space= ANCHOR_DISCRIMINATOR + Transaction::INIT_SPACE,
        payer=withdrawer,
        seeds = [b"withdraw", withdrawer.key().as_ref(),
                cid.to_le_bytes().as_ref(),
                (campaign.withdrawals + 1).to_le_bytes().as_ref()
                ],
        bump
    )]
    pub transaction: Account<'info, Transaction>,
    #[account(mut)]
    pub program_state: Account<'info, ProgramState>,
    /// CHECK: we are passing the account to be used for receiving platform charges
    #[account(mut)]
    pub platform_address: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}
