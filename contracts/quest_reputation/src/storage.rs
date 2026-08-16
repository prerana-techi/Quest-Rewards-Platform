use soroban_sdk::{Address, Env};
use crate::types::{BadgeRecord, DataKey, ReputationProfile};

const INSTANCE_BUMP_AMOUNT: u32 = 518_400;
const INSTANCE_LIFETIME_THRESHOLD: u32 = 100_000;

const PERSISTENT_BUMP_AMOUNT: u32 = 518_400;
const PERSISTENT_LIFETIME_THRESHOLD: u32 = 100_000;

pub fn bump_instance(env: &Env) {
    env.storage()
        .instance()
        .extend_ttl(INSTANCE_LIFETIME_THRESHOLD, INSTANCE_BUMP_AMOUNT);
}

pub fn get_admin(env: &Env) -> Option<Address> {
    bump_instance(env);
    env.storage().instance().get(&DataKey::Admin)
}

pub fn set_admin(env: &Env, admin: &Address) {
    bump_instance(env);
    env.storage().instance().set(&DataKey::Admin, admin);
}

pub fn get_quest_core(env: &Env) -> Option<Address> {
    bump_instance(env);
    env.storage().instance().get(&DataKey::QuestCoreContract)
}

pub fn set_quest_core(env: &Env, quest_core: &Address) {
    bump_instance(env);
    env.storage().instance().set(&DataKey::QuestCoreContract, quest_core);
}

pub fn get_profile(env: &Env, account: &Address) -> ReputationProfile {
    let key = DataKey::Profile(account.clone());
    if let Some(profile) = env.storage().persistent().get::<DataKey, ReputationProfile>(&key) {
        env.storage().persistent().extend_ttl(&key, PERSISTENT_LIFETIME_THRESHOLD, PERSISTENT_BUMP_AMOUNT);
        profile
    } else {
        ReputationProfile::default_profile(account.clone(), env.ledger().timestamp())
    }
}

pub fn set_profile(env: &Env, account: &Address, profile: &ReputationProfile) {
    let key = DataKey::Profile(account.clone());
    env.storage().persistent().set(&key, profile);
    env.storage().persistent().extend_ttl(&key, PERSISTENT_LIFETIME_THRESHOLD, PERSISTENT_BUMP_AMOUNT);
}

pub fn get_badge_count(env: &Env, account: &Address) -> u32 {
    let key = DataKey::BadgeCount(account.clone());
    if let Some(count) = env.storage().persistent().get::<DataKey, u32>(&key) {
        env.storage().persistent().extend_ttl(&key, PERSISTENT_LIFETIME_THRESHOLD, PERSISTENT_BUMP_AMOUNT);
        count
    } else {
        0
    }
}

pub fn set_badge(env: &Env, account: &Address, index: u32, badge: &BadgeRecord) {
    let key = DataKey::Badge(account.clone(), index);
    env.storage().persistent().set(&key, badge);
    env.storage().persistent().extend_ttl(&key, PERSISTENT_LIFETIME_THRESHOLD, PERSISTENT_BUMP_AMOUNT);

    let count_key = DataKey::BadgeCount(account.clone());
    env.storage().persistent().set(&count_key, &(index + 1));
    env.storage().persistent().extend_ttl(&count_key, PERSISTENT_LIFETIME_THRESHOLD, PERSISTENT_BUMP_AMOUNT);
}

pub fn get_badge(env: &Env, account: &Address, index: u32) -> Option<BadgeRecord> {
    let key = DataKey::Badge(account.clone(), index);
    if let Some(badge) = env.storage().persistent().get::<DataKey, BadgeRecord>(&key) {
        env.storage().persistent().extend_ttl(&key, PERSISTENT_LIFETIME_THRESHOLD, PERSISTENT_BUMP_AMOUNT);
        Some(badge)
    } else {
        None
    }
}
