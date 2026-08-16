use soroban_sdk::{contractclient, Address, Env, String};

#[allow(dead_code)]
#[contractclient(name = "QuestReputationClient")]
pub trait QuestReputationInterface {
    fn record_completion(
        env: Env,
        caller: Address,
        recipient: Address,
        quest_id: u64,
        reward_amount: i128,
        xp_amount: u32,
        badge_tier: u32,
        badge_uri: String,
    );

    fn record_quest_created(env: Env, caller: Address, creator: Address);
}
