use soroban_sdk::{Address, Env, Vec};
use crate::types::{DataKey, Quest, Submission};

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

pub fn is_paused(env: &Env) -> bool {
    bump_instance(env);
    env.storage().instance().get(&DataKey::Paused).unwrap_or(false)
}

pub fn set_paused(env: &Env, paused: bool) {
    bump_instance(env);
    env.storage().instance().set(&DataKey::Paused, &paused);
}

pub fn get_reputation_contract(env: &Env) -> Option<Address> {
    bump_instance(env);
    env.storage().instance().get(&DataKey::ReputationContract)
}

pub fn set_reputation_contract(env: &Env, contract: &Address) {
    bump_instance(env);
    env.storage().instance().set(&DataKey::ReputationContract, contract);
}

pub fn get_next_quest_id(env: &Env) -> u64 {
    bump_instance(env);
    env.storage().instance().get(&DataKey::NextQuestId).unwrap_or(1)
}

pub fn increment_next_quest_id(env: &Env) -> u64 {
    let current = get_next_quest_id(env);
    let next = current + 1;
    bump_instance(env);
    env.storage().instance().set(&DataKey::NextQuestId, &next);
    current
}

pub fn get_next_submission_id(env: &Env) -> u64 {
    bump_instance(env);
    env.storage().instance().get(&DataKey::NextSubmissionId).unwrap_or(1)
}

pub fn increment_next_submission_id(env: &Env) -> u64 {
    let current = get_next_submission_id(env);
    let next = current + 1;
    bump_instance(env);
    env.storage().instance().set(&DataKey::NextSubmissionId, &next);
    current
}

pub fn get_quest(env: &Env, quest_id: u64) -> Option<Quest> {
    let key = DataKey::Quest(quest_id);
    if let Some(quest) = env.storage().persistent().get::<DataKey, Quest>(&key) {
        env.storage().persistent().extend_ttl(&key, PERSISTENT_LIFETIME_THRESHOLD, PERSISTENT_BUMP_AMOUNT);
        Some(quest)
    } else {
        None
    }
}

pub fn set_quest(env: &Env, quest: &Quest) {
    let key = DataKey::Quest(quest.id);
    env.storage().persistent().set(&key, quest);
    env.storage().persistent().extend_ttl(&key, PERSISTENT_LIFETIME_THRESHOLD, PERSISTENT_BUMP_AMOUNT);
}

pub fn get_submission(env: &Env, submission_id: u64) -> Option<Submission> {
    let key = DataKey::Submission(submission_id);
    if let Some(sub) = env.storage().persistent().get::<DataKey, Submission>(&key) {
        env.storage().persistent().extend_ttl(&key, PERSISTENT_LIFETIME_THRESHOLD, PERSISTENT_BUMP_AMOUNT);
        Some(sub)
    } else {
        None
    }
}

pub fn set_submission(env: &Env, sub: &Submission) {
    let key = DataKey::Submission(sub.id);
    env.storage().persistent().set(&key, sub);
    env.storage().persistent().extend_ttl(&key, PERSISTENT_LIFETIME_THRESHOLD, PERSISTENT_BUMP_AMOUNT);
}

pub fn get_quest_submission_ids(env: &Env, quest_id: u64) -> Vec<u64> {
    let key = DataKey::QuestSubmissions(quest_id);
    if let Some(ids) = env.storage().persistent().get::<DataKey, Vec<u64>>(&key) {
        env.storage().persistent().extend_ttl(&key, PERSISTENT_LIFETIME_THRESHOLD, PERSISTENT_BUMP_AMOUNT);
        ids
    } else {
        Vec::new(env)
    }
}

pub fn add_quest_submission_id(env: &Env, quest_id: u64, submission_id: u64) {
    let key = DataKey::QuestSubmissions(quest_id);
    let mut ids = get_quest_submission_ids(env, quest_id);
    ids.push_back(submission_id);
    env.storage().persistent().set(&key, &ids);
    env.storage().persistent().extend_ttl(&key, PERSISTENT_LIFETIME_THRESHOLD, PERSISTENT_BUMP_AMOUNT);
}

pub fn is_reviewer(env: &Env, account: &Address) -> bool {
    let key = DataKey::ReviewerRole(account.clone());
    bump_instance(env);
    env.storage().instance().get(&key).unwrap_or(false)
}

pub fn set_reviewer_role(env: &Env, account: &Address, is_active: bool) {
    let key = DataKey::ReviewerRole(account.clone());
    bump_instance(env);
    env.storage().instance().set(&key, &is_active);
}
