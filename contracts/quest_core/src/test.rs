#![cfg(test)]
use super::*;
use soroban_sdk::{
    testutils::{Address as _, Ledger},
    token::{StellarAssetClient, TokenClient},
    Env, String,
};
use quest_reputation::{QuestReputationContract, QuestReputationContractClient};

fn create_token_contract<'a>(env: &Env, admin: &Address) -> (TokenClient<'a>, StellarAssetClient<'a>) {
    let token_address = env.register_stellar_asset_contract_v2(admin.clone()).address();
    (
        TokenClient::new(env, &token_address),
        StellarAssetClient::new(env, &token_address),
    )
}

#[test]
fn test_full_quest_lifecycle_with_inter_contract_reputation() {
    let env = Env::default();
    env.mock_all_auths();
    env.ledger().with_mut(|li| {
        li.timestamp = 1_000_000;
    });

    let admin = Address::generate(&env);
    let sponsor = Address::generate(&env);
    let contributor = Address::generate(&env);
    let reviewer = Address::generate(&env);

    // Setup Token Contract
    let (token_client, token_admin) = create_token_contract(&env, &admin);
    token_admin.mint(&sponsor, &10_000_0000000i128);

    // Deploy QuestReputation Contract
    let reputation_id = env.register(QuestReputationContract, ());
    let reputation_client = QuestReputationContractClient::new(&env, &reputation_id);

    // Deploy QuestCore Contract
    let core_id = env.register(QuestCoreContract, ());
    let core_client = QuestCoreContractClient::new(&env, &core_id);

    // Initialize both contracts and link them
    reputation_client.initialize(&admin, &core_id);
    core_client.initialize(&admin, &reputation_id);

    // Assign reviewer
    core_client.set_reviewer(&admin, &reviewer, &true);
    assert!(core_client.is_reviewer(&reviewer));

    // Sponsor creates quest: 1000 tokens reward, 250 XP, Tier 2 (Silver), 1 max winner
    let deadline = 1_000_000 + 86400; // 24 hours later
    let quest_id = core_client.create_quest(
        &sponsor,
        &token_client.address,
        &1000_0000000i128,
        &250u32,
        &2u32,
        &String::from_str(&env, "Build Soroban Escrow SDK"),
        &String::from_str(&env, "ipfs://bafybeiquestdetails1"),
        &deadline,
        &1u32,
        &Some(reviewer.clone()),
    );

    assert_eq!(quest_id, 1);
    // Verify escrow balance in contract
    assert_eq!(token_client.balance(&core_id), 1000_0000000i128);
    assert_eq!(token_client.balance(&sponsor), 9000_0000000i128);

    // Contributor submits work
    let submission_id = core_client.submit_work(
        &contributor,
        &quest_id,
        &String::from_str(&env, "https://github.com/prerana-techi/soroban-escrow-pr/pull/1"),
    );
    assert_eq!(submission_id, 1);

    let quest = core_client.get_quest(&quest_id).unwrap();
    assert_eq!(quest.status, QuestStatus::Open);

    // Reviewer approves submission
    core_client.review_submission(
        &reviewer,
        &submission_id,
        &true,
        &String::from_str(&env, "Excellent implementation! Fully verified."),
    );

    // Verify token payout was released to contributor
    assert_eq!(token_client.balance(&contributor), 1000_0000000i128);
    assert_eq!(token_client.balance(&core_id), 0);

    // Verify Quest is completed
    let completed_quest = core_client.get_quest(&quest_id).unwrap();
    assert_eq!(completed_quest.status, QuestStatus::Completed);
    assert_eq!(completed_quest.winners_count, 1);

    // Verify Inter-contract call updated reputation & badge
    let profile = reputation_client.get_profile(&contributor);
    assert_eq!(profile.xp, 250);
    assert_eq!(profile.level, 3); // 250 XP = Level 3
    assert_eq!(profile.quests_completed, 1);
    assert_eq!(profile.badges_count, 1);
    assert_eq!(profile.total_earned, 1000_0000000i128);

    let badge = reputation_client.get_badge(&contributor, &0).unwrap();
    assert_eq!(badge.quest_id, 1);
    assert_eq!(badge.tier, 2);
}

#[test]
fn test_quest_expiration_and_refund_flow() {
    let env = Env::default();
    env.mock_all_auths();
    env.ledger().with_mut(|li| {
        li.timestamp = 1_000_000;
    });

    let admin = Address::generate(&env);
    let sponsor = Address::generate(&env);

    let (token_client, token_admin) = create_token_contract(&env, &admin);
    token_admin.mint(&sponsor, &5000_0000000i128);

    let reputation_id = env.register(QuestReputationContract, ());
    let reputation_client = QuestReputationContractClient::new(&env, &reputation_id);

    let core_id = env.register(QuestCoreContract, ());
    let core_client = QuestCoreContractClient::new(&env, &core_id);

    reputation_client.initialize(&admin, &core_id);
    core_client.initialize(&admin, &reputation_id);

    let deadline = 1_000_000 + 1000;
    let quest_id = core_client.create_quest(
        &sponsor,
        &token_client.address,
        &2000_0000000i128,
        &100u32,
        &1u32,
        &String::from_str(&env, "Bug Bounty"),
        &String::from_str(&env, "ipfs://bounty"),
        &deadline,
        &1u32,
        &None,
    );

    assert_eq!(token_client.balance(&core_id), 2000_0000000i128);

    // Fast-forward past deadline
    env.ledger().with_mut(|li| {
        li.timestamp = 1_000_000 + 2000;
    });

    // Sponsor claims refund
    let refund = core_client.refund_expired_quest(&sponsor, &quest_id);
    assert_eq!(refund, 2000_0000000i128);
    assert_eq!(token_client.balance(&sponsor), 5000_0000000i128);
    assert_eq!(token_client.balance(&core_id), 0);

    let quest = core_client.get_quest(&quest_id).unwrap();
    assert_eq!(quest.status, QuestStatus::Expired);
}

#[test]
fn test_rejection_and_emergency_pause() {
    let env = Env::default();
    env.mock_all_auths();
    env.ledger().with_mut(|li| {
        li.timestamp = 1_000_000;
    });

    let admin = Address::generate(&env);
    let sponsor = Address::generate(&env);
    let contributor = Address::generate(&env);

    let (token_client, token_admin) = create_token_contract(&env, &admin);
    token_admin.mint(&sponsor, &5000_0000000i128);

    let reputation_id = env.register(QuestReputationContract, ());
    let reputation_client = QuestReputationContractClient::new(&env, &reputation_id);

    let core_id = env.register(QuestCoreContract, ());
    let core_client = QuestCoreContractClient::new(&env, &core_id);

    reputation_client.initialize(&admin, &core_id);
    core_client.initialize(&admin, &reputation_id);

    let deadline = 1_000_000 + 5000;
    let quest_id = core_client.create_quest(
        &sponsor,
        &token_client.address,
        &500_0000000i128,
        &50u32,
        &1u32,
        &String::from_str(&env, "UI Review"),
        &String::from_str(&env, "ipfs://ui"),
        &deadline,
        &1u32,
        &None,
    );

    let sub_id = core_client.submit_work(
        &contributor,
        &quest_id,
        &String::from_str(&env, "https://invalid-link.com"),
    );

    // Sponsor rejects submission
    core_client.review_submission(
        &sponsor,
        &sub_id,
        &false,
        &String::from_str(&env, "Missing required documentation."),
    );

    let sub = core_client.get_submission(&sub_id).unwrap();
    assert_eq!(sub.status, SubmissionStatus::Rejected);
    assert_eq!(token_client.balance(&contributor), 0); // No payout

    // Admin pauses contract
    core_client.set_paused(&admin, &true);
    assert!(core_client.is_paused());
}
