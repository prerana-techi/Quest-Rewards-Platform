# Soroban Contract Interface Specification (API)

## 1. `quest_core` Specification

### Data Structures
```rust
pub struct Quest {
    pub id: u64,
    pub sponsor: Address,
    pub reward_token: Address,
    pub reward_amount: i128,
    pub xp_reward: u32,
    pub badge_tier: u32,
    pub title: String,
    pub metadata_uri: String,
    pub deadline: u64,
    pub status: QuestStatus,
    pub max_winners: u32,
    pub winners_count: u32,
    pub created_at: u64,
    pub reviewer: Option<Address>,
}

pub struct Submission {
    pub id: u64,
    pub quest_id: u64,
    pub contributor: Address,
    pub submission_uri: String,
    pub submitted_at: u64,
    pub status: SubmissionStatus,
    pub feedback: String,
    pub reviewed_at: u64,
}
```

### Entrypoints
| Function | Parameters | Description |
| :--- | :--- | :--- |
| `initialize` | `admin: Address, reputation: Address` | Initializes contract with admin and linked reputation address |
| `create_quest` | `sponsor: Address, ...` | Locks reward escrow and creates new bounty |
| `submit_work` | `contributor: Address, quest_id: u64, uri: String` | Submits pull request / demo link |
| `review_submission` | `reviewer: Address, submission_id: u64, approve: bool, feedback: String` | Evaluates submission; auto-releases token escrow & calls reputation |
| `refund_expired_quest` | `sponsor: Address, quest_id: u64` | Refunds remaining escrow after deadline |
| `set_reviewer` | `admin: Address, reviewer: Address, is_active: bool` | Grants or revokes reviewer role |
| `set_paused` | `admin: Address, paused: bool` | Circuit breaker to pause operations |
| `upgrade` | `admin: Address, new_wasm_hash: BytesN<32>` | Updates contract WASM bytecode |

---

## 2. `quest_reputation` Specification

### Data Structures
```rust
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

pub struct BadgeRecord {
    pub quest_id: u64,
    pub recipient: Address,
    pub tier: u32,
    pub earned_at: u64,
    pub uri: String,
}
```

### Entrypoints
| Function | Parameters | Description |
| :--- | :--- | :--- |
| `initialize` | `admin: Address, quest_core: Address` | Initializes reputation contract |
| `record_completion` | `caller: Address, recipient: Address, ...` | Authorized cross-contract call from `quest_core` |
| `get_profile` | `account: Address` | Returns reputation XP, level, and completed counts |
| `get_badge` | `account: Address, index: u32` | Returns specific badge record |
| `get_all_badges` | `account: Address` | Returns full vector of badges |
