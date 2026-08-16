#![no_std]

mod types;
mod storage;
mod events;
#[cfg(test)]
mod test;

use soroban_sdk::{contract, contractimpl, Address, BytesN, Env, String, Vec};
pub use types::{BadgeRecord, BadgeTier, ReputationProfile};

#[contract]
pub struct QuestReputationContract;

#[contractimpl]
impl QuestReputationContract {
    /// Initialize the reputation and badge contract with admin and linked quest core address
    pub fn initialize(env: Env, admin: Address, quest_core: Address) {
        if storage::get_admin(&env).is_some() {
            panic!("Already initialized");
        }
        admin.require_auth();
        storage::set_admin(&env, &admin);
        storage::set_quest_core(&env, &quest_core);
        events::emit_quest_core_updated(&env, None, &quest_core);
    }

    /// Admin can update the linked quest core contract address
    pub fn set_quest_core(env: Env, admin: Address, new_quest_core: Address) {
        let current_admin = storage::get_admin(&env).expect("Not initialized");
        current_admin.require_auth();
        if admin != current_admin {
            panic!("Unauthorized admin");
        }
        let old_core = storage::get_quest_core(&env);
        storage::set_quest_core(&env, &new_quest_core);
        events::emit_quest_core_updated(&env, old_core, &new_quest_core);
    }

    /// Inter-contract entrypoint: only callable by the linked QuestCore contract.
    /// Awards XP, recalculates level, records earnings, and mints soulbound badge.
    pub fn record_completion(
        env: Env,
        caller: Address,
        recipient: Address,
        quest_id: u64,
        reward_amount: i128,
        xp_amount: u32,
        badge_tier: u32,
        badge_uri: String,
    ) {
        caller.require_auth();
        
        let authorized_core = storage::get_quest_core(&env).expect("Quest core not set");
        if caller != authorized_core {
            panic!("Unauthorized caller: only quest_core can record completions");
        }

        let mut profile = storage::get_profile(&env, &recipient);
        let now = env.ledger().timestamp();

        profile.xp = profile.xp.saturating_add(xp_amount);
        profile.quests_completed = profile.quests_completed.saturating_add(1);
        profile.total_earned = profile.total_earned.saturating_add(reward_amount);
        profile.level = ReputationProfile::calculate_level(profile.xp);
        profile.last_active = now;

        // Record Badge
        let current_badge_count = storage::get_badge_count(&env, &recipient);
        let badge = BadgeRecord {
            quest_id,
            recipient: recipient.clone(),
            tier: badge_tier,
            earned_at: now,
            uri: badge_uri.clone(),
        };

        storage::set_badge(&env, &recipient, current_badge_count, &badge);
        profile.badges_count = current_badge_count + 1;
        storage::set_profile(&env, &recipient, &profile);

        // Emit Events
        events::emit_xp_awarded(&env, &recipient, xp_amount, profile.xp, profile.level);
        events::emit_badge_minted(&env, &recipient, quest_id, badge_tier, &badge_uri);
    }

    /// Record quest creation activity for sponsor profiles
    pub fn record_quest_created(env: Env, caller: Address, creator: Address) {
        caller.require_auth();
        let authorized_core = storage::get_quest_core(&env).expect("Quest core not set");
        if caller != authorized_core {
            panic!("Unauthorized caller");
        }

        let mut profile = storage::get_profile(&env, &creator);
        profile.quests_created = profile.quests_created.saturating_add(1);
        profile.last_active = env.ledger().timestamp();
        storage::set_profile(&env, &creator, &profile);
    }

    /// Read reputation profile for an account
    pub fn get_profile(env: Env, account: Address) -> ReputationProfile {
        storage::get_profile(&env, &account)
    }

    /// Read single badge earned by account at specific index
    pub fn get_badge(env: Env, account: Address, index: u32) -> Option<BadgeRecord> {
        storage::get_badge(&env, &account, index)
    }

    /// Read total badge count for an account
    pub fn get_badge_count(env: Env, account: Address) -> u32 {
        storage::get_badge_count(&env, &account)
    }

    /// Read all badges for an account
    pub fn get_all_badges(env: Env, account: Address) -> Vec<BadgeRecord> {
        let count = storage::get_badge_count(&env, &account);
        let mut list = Vec::new(&env);
        for i in 0..count {
            if let Some(b) = storage::get_badge(&env, &account, i) {
                list.push_back(b);
            }
        }
        list
    }

    /// Read admin address
    pub fn get_admin(env: Env) -> Option<Address> {
        storage::get_admin(&env)
    }

    /// Read linked quest core contract address
    pub fn get_quest_core(env: Env) -> Option<Address> {
        storage::get_quest_core(&env)
    }

    /// Upgrade contract executable code
    pub fn upgrade(env: Env, admin: Address, new_wasm_hash: BytesN<32>) {
        let current_admin = storage::get_admin(&env).expect("Not initialized");
        current_admin.require_auth();
        if admin != current_admin {
            panic!("Unauthorized admin");
        }
        env.deployer().update_current_contract_wasm(new_wasm_hash);
    }
}
