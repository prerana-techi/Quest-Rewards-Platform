use soroban_sdk::{symbol_short, Address, Env, String, Symbol};

pub fn emit_xp_awarded(env: &Env, recipient: &Address, xp_gained: u32, total_xp: u32, level: u32) {
    let topics = (symbol_short!("xp_award"), recipient.clone());
    env.events().publish(topics, (xp_gained, total_xp, level));
}

pub fn emit_badge_minted(env: &Env, recipient: &Address, quest_id: u64, tier: u32, uri: &String) {
    let topics = (symbol_short!("badge_mnt"), recipient.clone());
    env.events().publish(topics, (quest_id, tier, uri.clone()));
}

pub fn emit_quest_core_updated(env: &Env, old_core: Option<Address>, new_core: &Address) {
    let topics = (Symbol::new(env, "core_update"), new_core.clone());
    env.events().publish(topics, old_core);
}
