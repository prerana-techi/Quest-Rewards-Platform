# Deployment & Operational Runbook

This guide covers complete operational procedures for deploying and maintaining the Quest & Rewards Platform contracts on Stellar Testnet and Mainnet.

---

## 🛠️ Step-by-Step Deployment

### 1. Configure Stellar CLI Identity
```bash
stellar keys generate quest-admin --network testnet
stellar keys fund quest-admin --network testnet
```

### 2. Build Release WASM
```bash
cargo build --manifest-path contracts/Cargo.toml --target wasm32-unknown-unknown --release
```

### 3. Deploy `quest_reputation`
```bash
stellar contract deploy \
  --wasm contracts/target/wasm32-unknown-unknown/release/quest_reputation.wasm \
  --source quest-admin \
  --network testnet
```

### 4. Deploy `quest_core`
```bash
stellar contract deploy \
  --wasm contracts/target/wasm32-unknown-unknown/release/quest_core.wasm \
  --source quest-admin \
  --network testnet
```

### 5. Link & Initialize Contracts
```bash
# Initialize quest_reputation
stellar contract invoke \
  --id <REPUTATION_CONTRACT_ID> \
  --source quest-admin \
  --network testnet \
  -- initialize \
  --admin <ADMIN_ADDRESS> \
  --quest_core <CORE_CONTRACT_ID>

# Initialize quest_core
stellar contract invoke \
  --id <CORE_CONTRACT_ID> \
  --source quest-admin \
  --network testnet \
  -- initialize \
  --admin <ADMIN_ADDRESS> \
  --reputation_contract <REPUTATION_CONTRACT_ID>
```

---

## 🔄 Upgrading Contract WASM Bytecode In-Place

Soroban supports non-destructive contract code upgrades using the `update_current_contract_wasm` syscall:

```bash
./scripts/upgrade_contract.sh core <CORE_CONTRACT_ID> path/to/new_quest_core.wasm testnet quest-admin
```
