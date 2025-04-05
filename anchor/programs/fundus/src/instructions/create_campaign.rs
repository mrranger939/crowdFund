use anchor_lang::prelude::*;

use crate::{
    constants::ANCHOR_DISCRIMINATOR,
    states::{Campaign, ProgramState},
};
use crate::errors::ErrorCode::*;
pub fn create_campaign(
    ctx: Context<CreateCampaignCtx>,
    title: String,
    description: String,
    image_url: String,
    goal: u64,
) -> Result<()> {
    let campaign = &mut ctx.accounts.campaign;
    let state = &mut ctx.accounts.program_state;
    if title.len() > 100 {
        return Err(TitleTooLong.into());
    }
    if description.len() > 100 {
        return Err(DescriptionTooLong.into());
    }
    if image_url.len() > 100 {
        return Err(ImageUrlTooLong.into());
    }
    if goal <= 1_000_000_000 {
        return Err(InvalidGoalAmount.into());
    }
    state.campaign_count += 1;
    campaign.cid = state.campaign_count;
    campaign.creator = ctx.accounts.creator.key();
    campaign.title = title;
    campaign.description = description;
    campaign.image_url = image_url;
    campaign.goal = goal;
    campaign.amount_raised = 0;
    campaign.donors = 0;
    campaign.withdrawals = 0;
    campaign.timestamp = Clock::get()?.unix_timestamp as u64;
    campaign.active = true;
    Ok(())
}

#[derive(Accounts)]
pub struct CreateCampaignCtx<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,
    #[account(
        init,
        space= ANCHOR_DISCRIMINATOR + Campaign::INIT_SPACE,
        payer=creator,
        seeds = [b"campaign", 
                (program_state.campaign_count + 1).to_le_bytes().as_ref()
                ],
        bump
    )]
    pub campaign: Account<'info, Campaign>,
    #[account(mut)]
    pub program_state: Account<'info, ProgramState>,
    pub system_program: Program<'info, System>,
}
