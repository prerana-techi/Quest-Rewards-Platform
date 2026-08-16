use soroban_sdk::{contracttype, Address, String};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Admin,
    Paused,
    ReputationContract,
    NextQuestId,
    NextSubmissionId,
    Quest(u64),
    Submission(u64),
    QuestSubmissions(u64),
    UserSubmissions(Address),
    ReviewerRole(Address),
    TotalQuestsCount,
}

#[contracttype]
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum QuestStatus {
    Draft = 0,
    Open = 1,
    InReview = 2,
    Completed = 3,
    Expired = 4,
    Cancelled = 5,
}

#[contracttype]
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum SubmissionStatus {
    Pending = 0,
    Approved = 1,
    Rejected = 2,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Quest {
    pub id: u64,
    pub sponsor: Address,
    pub reward_token: Address,
    pub reward_amount: i128,
    pub xp_reward: u32,
    pub badge_tier: u32,
    pub title: String,
    pub metadata_uri: String,
    pub deadline: u64,
    pub status: QuestStatus,
    pub max_winners: u32,
    pub winners_count: u32,
    pub created_at: u64,
    pub reviewer: Option<Address>,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Submission {
    pub id: u64,
    pub quest_id: u64,
    pub contributor: Address,
    pub submission_uri: String,
    pub submitted_at: u64,
    pub status: SubmissionStatus,
    pub feedback: String,
    pub reviewed_at: u64,
}
