# Security Model & Audit Guidelines

## 🛡️ Threat Model & Defense Mechanisms

### 1. Escrow Non-Custody & Timelock Protections
- **Threat**: Sponsor locks reward funds, but a malicious contributor prevents refund or griefs the contract.
- **Mitigation**: The `refund_expired_quest` function verifies that `env.ledger().timestamp() > quest.deadline`. If unfilled slots remain, the contract deterministically returns the exact balance to `quest.sponsor`.

### 2. Unauthorized Payouts & Sybil Badge Minting
- **Threat**: Attackers attempt to call `record_completion` on `quest_reputation` to give themselves artificial XP and Diamond badges.
- **Mitigation**: `quest_reputation::record_completion` strictly verifies `caller == storage::get_quest_core(&env)` and requires `caller.require_auth()`. Invocations outside of `quest_core` panic immediately.

### 3. Reentrancy & Double-Claims
- **Threat**: Contributor attempts to execute nested calls or submit duplicate claims for the same bounty.
- **Mitigation**: Submissions transition state atomically (`Pending` $\to$ `Approved` / `Rejected`). When `quest.winners_count >= quest.max_winners`, the quest is irrevocably marked `Completed`.

### 4. Arithmetic Underflow / Overflow
- **Threat**: Integer overflow during escrow multiplier calculation (`reward_amount * max_winners`).
- **Mitigation**: All calculations use checked arithmetic:
  ```rust
  let total_escrow = reward_amount
      .checked_mul(max_winners as i128)
      .expect("Overflow calculation");
  ```

### 5. Emergency Circuit Breaker (Pausing)
- **Threat**: Unforeseen bug or security vulnerability in active deployment.
- **Mitigation**: Contract administrator can invoke `set_paused(admin, true)` to halt `create_quest`, `submit_work`, `review_submission`, and `refund_expired_quest`.

---

## 🔒 Security Audit Checklist
- [x] All entrypoints verify proper authorizations (`require_auth`).
- [x] No `unsafe` Rust blocks used anywhere in smart contract code.
- [x] State mutations precede external token transfers where applicable.
- [x] Dynamic storage keys use structured enums (`DataKey`).
- [x] Event topics are properly indexed for off-chain monitoring.
