#![no_std]

mod types;
mod storage;
mod events;
mod reputation_client;
#[cfg(test)]
mod test;

use soroban_sdk::{
    contract, contractimpl, token, Address, BytesN, Env, String, Vec,
};
pub use types::{Quest, QuestStatus, Submission, SubmissionStatus};
use reputation_client::QuestReputationClient;

#[contract]
pub struct QuestCoreContract;

#[contractimpl]
impl QuestCoreContract {
    /// Initialize QuestCore with admin and linked reputation contract address
    pub fn initialize(env: Env, admin: Address, reputation_contract: Address) {
        if storage::get_admin(&env).is_some() {
            panic!("Already initialized");
        }
        admin.require_auth();
        storage::set_admin(&env, &admin);
        storage::set_reputation_contract(&env, &reputation_contract);
        storage::set_paused(&env, false);
    }

    /// Admin can update the linked reputation contract address
    pub fn set_reputation_contract(env: Env, admin: Address, new_reputation_contract: Address) {
        let current_admin = storage::get_admin(&env).expect("Not initialized");
        current_admin.require_auth();
        if admin != current_admin {
            panic!("Unauthorized admin");
        }
        storage::set_reputation_contract(&env, &new_reputation_contract);
    }

    /// Admin can grant or revoke reviewer role
    pub fn set_reviewer(env: Env, admin: Address, reviewer: Address, is_active: bool) {
        let current_admin = storage::get_admin(&env).expect("Not initialized");
        current_admin.require_auth();
        if admin != current_admin {
            panic!("Unauthorized admin");
        }
        storage::set_reviewer_role(&env, &reviewer, is_active);
    }

    /// Pause or unpause the contract in case of emergency
    pub fn set_paused(env: Env, admin: Address, paused: bool) {
        let current_admin = storage::get_admin(&env).expect("Not initialized");
        current_admin.require_auth();
        if admin != current_admin {
            panic!("Unauthorized admin");
        }
        storage::set_paused(&env, paused);
        events::emit_paused(&env, &admin, paused);
    }

    /// Create a new Quest and lock reward token amount into contract escrow
    pub fn create_quest(
        env: Env,
        sponsor: Address,
        reward_token: Address,
        reward_amount: i128,
        xp_reward: u32,
        badge_tier: u32,
        title: String,
        metadata_uri: String,
        deadline: u64,
        max_winners: u32,
        assigned_reviewer: Option<Address>,
    ) -> u64 {
        if storage::is_paused(&env) {
            panic!("Contract paused");
        }
        sponsor.require_auth();

        if reward_amount <= 0 {
            panic!("Reward amount must be greater than 0");
        }
        let now = env.ledger().timestamp();
        if deadline <= now {
            panic!("Deadline must be in the future");
        }
        if max_winners == 0 {
            panic!("Max winners must be at least 1");
        }

        // Lock total reward into contract escrow:
        // Total locked = reward_amount * max_winners
        let total_escrow = reward_amount.checked_mul(max_winners as i128).expect("Overflow calculation");
        let token_client = token::Client::new(&env, &reward_token);
        token_client.transfer(&sponsor, &env.current_contract_address(), &total_escrow);

        let quest_id = storage::increment_next_quest_id(&env);
        let quest = Quest {
            id: quest_id,
            sponsor: sponsor.clone(),
            reward_token: reward_token.clone(),
            reward_amount,
            xp_reward,
            badge_tier,
            title,
            metadata_uri,
            deadline,
            status: QuestStatus::Open,
            max_winners,
            winners_count: 0,
            created_at: now,
            reviewer: assigned_reviewer,
        };

        storage::set_quest(&env, &quest);
        events::emit_quest_created(&env, quest_id, &sponsor, &reward_token, reward_amount, deadline);

        // Inter-contract notification to reputation contract for sponsor profile tracking
        if let Some(rep_addr) = storage::get_reputation_contract(&env) {
            let rep_client = QuestReputationClient::new(&env, &rep_addr);
            rep_client.record_quest_created(&env.current_contract_address(), &sponsor);
        }

        quest_id
    }

    /// Contributor submits proof of work for an open quest
    pub fn submit_work(
        env: Env,
        contributor: Address,
        quest_id: u64,
        submission_uri: String,
    ) -> u64 {
        if storage::is_paused(&env) {
            panic!("Contract paused");
        }
        contributor.require_auth();

        let mut quest = storage::get_quest(&env, quest_id).expect("Quest not found");
        if quest.status != QuestStatus::Open {
            panic!("Quest is not open for submissions");
        }
        let now = env.ledger().timestamp();
        if now > quest.deadline {
            quest.status = QuestStatus::Expired;
            storage::set_quest(&env, &quest);
            events::emit_status_updated(&env, quest_id, QuestStatus::Open, QuestStatus::Expired);
            panic!("Quest deadline has passed");
        }

        let submission_id = storage::increment_next_submission_id(&env);
        let submission = Submission {
            id: submission_id,
            quest_id,
            contributor: contributor.clone(),
            submission_uri: submission_uri.clone(),
            submitted_at: now,
            status: SubmissionStatus::Pending,
            feedback: String::from_str(&env, ""),
            reviewed_at: 0,
        };

        storage::set_submission(&env, &submission);
        storage::add_quest_submission_id(&env, quest_id, submission_id);
        events::emit_work_submitted(&env, quest_id, submission_id, &contributor, &submission_uri);

        submission_id
    }

    /// Reviewer or Sponsor judges submission. If approved, releases escrow payout and mints badge via inter-contract call.
    pub fn review_submission(
        env: Env,
        reviewer: Address,
        submission_id: u64,
        approve: bool,
        feedback: String,
    ) {
        if storage::is_paused(&env) {
            panic!("Contract paused");
        }
        reviewer.require_auth();

        let mut submission = storage::get_submission(&env, submission_id).expect("Submission not found");
        if submission.status != SubmissionStatus::Pending {
            panic!("Submission already reviewed");
        }

        let mut quest = storage::get_quest(&env, submission.quest_id).expect("Quest not found");
        if quest.status != QuestStatus::Open && quest.status != QuestStatus::InReview {
            panic!("Quest is not active");
        }

        // Authorization check: Must be the sponsor, designated reviewer, or a global verified reviewer
        let is_sponsor = reviewer == quest.sponsor;
        let is_designated_reviewer = quest.reviewer.as_ref() == Some(&reviewer);
        let is_global_reviewer = storage::is_reviewer(&env, &reviewer);

        if !is_sponsor && !is_designated_reviewer && !is_global_reviewer {
            panic!("Unauthorized reviewer");
        }

        let now = env.ledger().timestamp();
        submission.reviewed_at = now;
        submission.feedback = feedback.clone();

        if approve {
            submission.status = SubmissionStatus::Approved;
            quest.winners_count += 1;

            // Release escrow reward directly to contributor
            let token_client = token::Client::new(&env, &quest.reward_token);
            token_client.transfer(
                &env.current_contract_address(),
                &submission.contributor,
                &quest.reward_amount,
            );

            // Inter-contract call to QuestReputation contract: Award XP and Mint Badge
            if let Some(rep_addr) = storage::get_reputation_contract(&env) {
                let rep_client = QuestReputationClient::new(&env, &rep_addr);
                rep_client.record_completion(
                    &env.current_contract_address(),
                    &submission.contributor,
                    &quest.id,
                    &quest.reward_amount,
                    &quest.xp_reward,
                    &quest.badge_tier,
                    &quest.metadata_uri,
                );
            }

            events::emit_payout_released(
                &env,
                quest.id,
                &submission.contributor,
                &quest.reward_token,
                quest.reward_amount,
                quest.xp_reward,
                quest.badge_tier,
            );

            // If maximum winners reached, mark quest as Completed
            if quest.winners_count >= quest.max_winners {
                let old_status = quest.status;
                quest.status = QuestStatus::Completed;
                events::emit_status_updated(&env, quest.id, old_status, QuestStatus::Completed);
            }
        } else {
            submission.status = SubmissionStatus::Rejected;
        }

        storage::set_submission(&env, &submission);
        storage::set_quest(&env, &quest);
        events::emit_submission_reviewed(
            &env,
            quest.id,
            submission_id,
            &reviewer,
            submission.status,
            &feedback,
        );
    }

    /// Sponsor can reclaim remaining escrow funds if quest expired or winners weren't filled
    pub fn refund_expired_quest(env: Env, sponsor: Address, quest_id: u64) -> i128 {
        if storage::is_paused(&env) {
            panic!("Contract paused");
        }
        sponsor.require_auth();

        let mut quest = storage::get_quest(&env, quest_id).expect("Quest not found");
        if quest.sponsor != sponsor {
            panic!("Only sponsor can claim refund");
        }

        let now = env.ledger().timestamp();
        if now <= quest.deadline && quest.status != QuestStatus::Expired {
            panic!("Quest deadline has not passed yet");
        }

        if quest.status == QuestStatus::Completed || quest.status == QuestStatus::Cancelled {
            panic!("Quest already finalized");
        }

        let remaining_slots = quest.max_winners.saturating_sub(quest.winners_count);
        if remaining_slots == 0 {
            panic!("No remaining escrow to refund");
        }

        let refund_amount = quest.reward_amount.checked_mul(remaining_slots as i128).expect("Overflow");

        let token_client = token::Client::new(&env, &quest.reward_token);
        token_client.transfer(&env.current_contract_address(), &sponsor, &refund_amount);

        let old_status = quest.status;
        quest.status = QuestStatus::Expired;
        storage::set_quest(&env, &quest);

        events::emit_status_updated(&env, quest_id, old_status, QuestStatus::Expired);
        events::emit_quest_refunded(&env, quest_id, &sponsor, refund_amount);

        refund_amount
    }

    /// Read single quest by ID
    pub fn get_quest(env: Env, quest_id: u64) -> Option<Quest> {
        storage::get_quest(&env, quest_id)
    }

    /// Read single submission by ID
    pub fn get_submission(env: Env, submission_id: u64) -> Option<Submission> {
        storage::get_submission(&env, submission_id)
    }

    /// Read all submission IDs for a given quest
    pub fn get_quest_submissions(env: Env, quest_id: u64) -> Vec<Submission> {
        let ids = storage::get_quest_submission_ids(&env, quest_id);
        let mut list = Vec::new(&env);
        for id in ids.iter() {
            if let Some(sub) = storage::get_submission(&env, id) {
                list.push_back(sub);
            }
        }
        list
    }

    /// Read contract configuration
    pub fn get_admin(env: Env) -> Option<Address> {
        storage::get_admin(&env)
    }

    pub fn get_reputation_contract(env: Env) -> Option<Address> {
        storage::get_reputation_contract(&env)
    }

    pub fn is_reviewer(env: Env, account: Address) -> bool {
        storage::is_reviewer(&env, &account)
    }

    pub fn is_paused(env: Env) -> bool {
        storage::is_paused(&env)
    }

    /// Upgrade contract code
    pub fn upgrade(env: Env, admin: Address, new_wasm_hash: BytesN<32>) {
        let current_admin = storage::get_admin(&env).expect("Not initialized");
        current_admin.require_auth();
        if admin != current_admin {
            panic!("Unauthorized admin");
        }
        env.deployer().update_current_contract_wasm(new_wasm_hash);
    }
}
