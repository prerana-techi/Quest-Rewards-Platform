#![cfg(test)]
use super::*;
use soroban_sdk::{testutils::Address as _, Env, String};

#[test]
fn test_reputation_initialization_and_access_control() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let quest_core = Address::generate(&env);
    let recipient = Address::generate(&env);

    let contract_id = env.register(QuestReputationContract, ());
    let client = QuestReputationContractClient::new(&env, &contract_id);

    client.initialize(&admin, &quest_core);

    assert_eq!(client.get_admin(), Some(admin.clone()));
    assert_eq!(client.get_quest_core(), Some(quest_core.clone()));

    // Record completion via quest_core
    client.record_completion(
        &quest_core,
        &recipient,
        &101u64,
        &500_0000000i128,
        &150u32,
        &2u32, // Silver
        &String::from_str(&env, "ipfs://bafybeibadge101"),
    );

    let profile = client.get_profile(&recipient);
    assert_eq!(profile.xp, 150);
    assert_eq!(profile.level, 2);
    assert_eq!(profile.quests_completed, 1);
    assert_eq!(profile.badges_count, 1);
    assert_eq!(profile.total_earned, 500_0000000i128);

    // Verify badge
    let badge = client.get_badge(&recipient, &0).expect("Badge not found");
    assert_eq!(badge.quest_id, 101);
    assert_eq!(badge.tier, 2);

    let all_badges = client.get_all_badges(&recipient);
    assert_eq!(all_badges.len(), 1);

    // Record second quest completion
    client.record_completion(
        &quest_core,
        &recipient,
        &102u64,
        &1000_0000000i128,
        &400u32,
        &3u32, // Gold
        &String::from_str(&env, "ipfs://bafybeibadge102"),
    );

    let updated_profile = client.get_profile(&recipient);
    assert_eq!(updated_profile.xp, 550); // 150 + 400
    assert_eq!(updated_profile.level, 4); // >= 500 is level 4
    assert_eq!(updated_profile.quests_completed, 2);
    assert_eq!(updated_profile.badges_count, 2);

    // Test sponsor quest creation tracking
    let sponsor = Address::generate(&env);
    client.record_quest_created(&quest_core, &sponsor);
    let sponsor_profile = client.get_profile(&sponsor);
    assert_eq!(sponsor_profile.quests_created, 1);

    // Update quest core by admin
    let new_core = Address::generate(&env);
    client.set_quest_core(&admin, &new_core);
    assert_eq!(client.get_quest_core(), Some(new_core));
}

#[test]
#[should_panic(expected = "Unauthorized caller: only quest_core can record completions")]
fn test_unauthorized_completion_call() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let quest_core = Address::generate(&env);
    let attacker = Address::generate(&env);
    let recipient = Address::generate(&env);

    let contract_id = env.register(QuestReputationContract, ());
    let client = QuestReputationContractClient::new(&env, &contract_id);

    client.initialize(&admin, &quest_core);

    // Attacker tries to award themselves XP
    client.record_completion(
        &attacker,
        &recipient,
        &999u64,
        &1_000_0000000i128,
        &10000u32,
        &5u32,
        &String::from_str(&env, "ipfs://fake"),
    );
}
