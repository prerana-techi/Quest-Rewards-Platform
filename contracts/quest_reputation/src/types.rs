use soroban_sdk::{contracttype, Address, String};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Admin,
    QuestCoreContract,
    Profile(Address),
    Badge(Address, u32),
    BadgeCount(Address),
    TotalProfiles,
}

#[contracttype]
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum BadgeTier {
    Bronze = 1,
    Silver = 2,
    Gold = 3,
    Platinum = 4,
    Diamond = 5,
}

impl BadgeTier {
    pub fn from_u32(val: u32) -> Self {
        match val {
            1 => BadgeTier::Bronze,
            2 => BadgeTier::Silver,
            3 => BadgeTier::Gold,
            4 => BadgeTier::Platinum,
            5 => BadgeTier::Diamond,
            _ => BadgeTier::Bronze,
        }
    }
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct BadgeRecord {
    pub quest_id: u64,
    pub recipient: Address,
    pub tier: u32,
    pub earned_at: u64,
    pub uri: String,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ReputationProfile {
    pub account: Address,
    pub xp: u32,
    pub quests_completed: u32,
    pub quests_created: u32,
    pub badges_count: u32,
    pub level: u32,
    pub total_earned: i128,
    pub last_active: u64,
}

impl ReputationProfile {
    pub fn default_profile(account: Address, timestamp: u64) -> Self {
        Self {
            account,
            xp: 0,
            quests_completed: 0,
            quests_created: 0,
            badges_count: 0,
            level: 1,
            total_earned: 0,
            last_active: timestamp,
        }
    }

    pub fn calculate_level(xp: u32) -> u32 {
        if xp >= 5000 {
            10
        } else if xp >= 3000 {
            8
        } else if xp >= 2000 {
            6
        } else if xp >= 1000 {
            5
        } else if xp >= 500 {
            4
        } else if xp >= 250 {
            3
        } else if xp >= 100 {
            2
        } else {
            1
        }
    }
}
