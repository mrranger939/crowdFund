use anchor_lang::prelude::*;


#[error_code]
pub enum ErrorCode {
    #[msg("The program has already being initialized")]
    AlreadyInitialized,
    #[msg("The Title is of more than 100 characters")]
    TitleTooLong,
    #[msg("Description is more than 600 characters")]
    DescriptionTooLong,
    #[msg("Image Url is more than 300 characters")]
    ImageUrlTooLong,
    #[msg("Invalid goal amount, Goal must be greater than zero")]
    InvalidGoalAmount,
    #[msg("Unauthorised Access")]
    UnauthorisedAccess,
    #[msg("Campaign doesnot exist")]
    CampaignNotFound,
    #[msg("This Campaign is Inactive")]
    InActiveCampaign,
    #[msg("Donation must be atleast 1 SOL Token")]
    InvalidDonationAmount,
    #[msg("Campaign goal reached")]
    CampaignGoalReached,
    #[msg("Withdraw amount must be atleast 1 SOL Token")]
    InvalidWithdrawAmount,
    #[msg("Insufficient Funds")]
    InsufficientFund,
    #[msg("Invalid Platform Address")]
    InvalidPlatformAddress,
    #[msg("The platform fee must be in between 1 to 15")]
    InvalidPlatformFee,

}