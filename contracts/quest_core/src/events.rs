use soroban_sdk::{symbol_short, Address, Env, String, Symbol};
use crate::types::{QuestStatus, SubmissionStatus};

pub fn emit_quest_created(
    env: &Env,
    quest_id: u64,
    sponsor: &Address,
    reward_token: &Address,
    amount: i128,
    deadline: u64,
) {
    let topics = (symbol_short!("q_create"), quest_id, sponsor.clone());
    env.events().publish(topics, (reward_token.clone(), amount, deadline));
}

pub fn emit_work_submitted(
    env: &Env,
    quest_id: u64,
    submission_id: u64,
    contributor: &Address,
    uri: &String,
) {
    let topics = (symbol_short!("q_submit"), quest_id, contributor.clone());
    env.events().publish(topics, (submission_id, uri.clone()));
}

pub fn emit_submission_reviewed(
    env: &Env,
    quest_id: u64,
    submission_id: u64,
    reviewer: &Address,
    status: SubmissionStatus,
    feedback: &String,
) {
    let topics = (symbol_short!("q_review"), quest_id, submission_id);
    env.events().publish(topics, (reviewer.clone(), status as u32, feedback.clone()));
}

pub fn emit_payout_released(
    env: &Env,
    quest_id: u64,
    recipient: &Address,
    reward_token: &Address,
    amount: i128,
    xp_awarded: u32,
    badge_tier: u32,
) {
    let topics = (symbol_short!("q_payout"), quest_id, recipient.clone());
    env.events().publish(topics, (reward_token.clone(), amount, xp_awarded, badge_tier));
}

pub fn emit_quest_refunded(env: &Env, quest_id: u64, sponsor: &Address, amount: i128) {
    let topics = (symbol_short!("q_refund"), quest_id, sponsor.clone());
    env.events().publish(topics, amount);
}

pub fn emit_status_updated(env: &Env, quest_id: u64, old_status: QuestStatus, new_status: QuestStatus) {
    let topics = (Symbol::new(env, "q_status"), quest_id);
    env.events().publish(topics, (old_status as u32, new_status as u32));
}

pub fn emit_paused(env: &Env, admin: &Address, paused: bool) {
    let topics = (symbol_short!("q_pause"), admin.clone());
    env.events().publish(topics, paused);
}
