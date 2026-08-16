#!/bin/bash
set -euo pipefail

# ==============================================================================
# Stellar / Soroban Testnet Deployment Automation
# Quest & Rewards Platform (Orange Belt Level 3)
# ==============================================================================

NETWORK="testnet"
RPC_URL="https://soroban-testnet.stellar.org"
NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
DEPLOYER_IDENTITY="${DEPLOYER_IDENTITY:-quest-deployer}"
DRY_RUN=false

if [[ "${1:-}" == "--dry-run" ]]; then
    DRY_RUN=true
    echo "=== Running in DRY-RUN mode ==="
fi

echo "========================================================"
echo "🚀 Deploying Quest & Rewards Contracts to Stellar Testnet"
echo "========================================================"

# Step 1: Ensure Deployer Identity exists & is funded
if ! stellar keys address "${DEPLOYER_IDENTITY}" &>/dev/null; then
    echo "🔑 Generating deployer key: ${DEPLOYER_IDENTITY}..."
    stellar keys generate "${DEPLOYER_IDENTITY}" --network "${NETWORK}"
    echo "💰 Funding deployer account on Friendbot..."
    stellar keys fund "${DEPLOYER_IDENTITY}" --network "${NETWORK}"
else
    echo "✅ Using existing deployer identity: ${DEPLOYER_IDENTITY}"
fi

DEPLOYER_ADDRESS=$(stellar keys address "${DEPLOYER_IDENTITY}")
echo "👤 Deployer Address: ${DEPLOYER_ADDRESS}"

if [[ "$DRY_RUN" == true ]]; then
    echo "Dry-run: Verifying contract build..."
    cargo build --manifest-path contracts/Cargo.toml --target wasm32-unknown-unknown --release
    echo "Dry-run completed successfully."
    exit 0
fi

# Step 2: Build release WASM binaries
echo "📦 Building optimized WASM contracts..."
cargo build --manifest-path contracts/Cargo.toml --target wasm32-unknown-unknown --release

REPUTATION_WASM="contracts/target/wasm32-unknown-unknown/release/quest_reputation.wasm"
CORE_WASM="contracts/target/wasm32-unknown-unknown/release/quest_core.wasm"

if [[ ! -f "$REPUTATION_WASM" ]] || [[ ! -f "$CORE_WASM" ]]; then
    echo "❌ Error: WASM binaries not found!"
    exit 1
fi

# Step 3: Deploy QuestReputation Contract
echo "📜 Deploying QuestReputation contract..."
REPUTATION_CONTRACT_ID=$(stellar contract deploy \
    --wasm "$REPUTATION_WASM" \
    --source "${DEPLOYER_IDENTITY}" \
    --network "${NETWORK}")
echo "✅ QuestReputation Contract ID: ${REPUTATION_CONTRACT_ID}"

# Step 4: Deploy QuestCore Contract
echo "📜 Deploying QuestCore contract..."
CORE_CONTRACT_ID=$(stellar contract deploy \
    --wasm "$CORE_WASM" \
    --source "${DEPLOYER_IDENTITY}" \
    --network "${NETWORK}")
echo "✅ QuestCore Contract ID: ${CORE_CONTRACT_ID}"

# Step 5: Initialize QuestReputation with Admin and QuestCore
echo "⚙️ Initializing QuestReputation contract..."
stellar contract invoke \
    --id "${REPUTATION_CONTRACT_ID}" \
    --source "${DEPLOYER_IDENTITY}" \
    --network "${NETWORK}" \
    -- \
    initialize \
    --admin "${DEPLOYER_ADDRESS}" \
    --quest_core "${CORE_CONTRACT_ID}"

# Step 6: Initialize QuestCore with Admin and QuestReputation
echo "⚙️ Initializing QuestCore contract..."
stellar contract invoke \
    --id "${CORE_CONTRACT_ID}" \
    --source "${DEPLOYER_IDENTITY}" \
    --network "${NETWORK}" \
    -- \
    initialize \
    --admin "${DEPLOYER_ADDRESS}" \
    --reputation_contract "${REPUTATION_CONTRACT_ID}"

# Step 7: Write deployment metadata JSON
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
cat <<EOF > deployments.json
{
  "network": "${NETWORK}",
  "rpcUrl": "${RPC_URL}",
  "networkPassphrase": "${NETWORK_PASSPHRASE}",
  "deployerAddress": "${DEPLOYER_ADDRESS}",
  "questCoreContractId": "${CORE_CONTRACT_ID}",
  "questReputationContractId": "${REPUTATION_CONTRACT_ID}",
  "nativeTokenAddress": "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
  "deployedAt": "${TIMESTAMP}"
}
EOF

echo "📝 Deployment metadata saved to deployments.json"

# Step 8: Update .env.local for Next.js frontend
cat <<EOF > .env.local
NEXT_PUBLIC_STELLAR_NETWORK="${NETWORK}"
NEXT_PUBLIC_STELLAR_RPC_URL="${RPC_URL}"
NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE="${NETWORK_PASSPHRASE}"
NEXT_PUBLIC_QUEST_CORE_CONTRACT_ID="${CORE_CONTRACT_ID}"
NEXT_PUBLIC_QUEST_REPUTATION_CONTRACT_ID="${REPUTATION_CONTRACT_ID}"
NEXT_PUBLIC_NATIVE_TOKEN_ADDRESS="CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC"
NEXT_PUBLIC_EXPLORER_URL="https://stellar.expert/explorer/testnet"
EOF

echo "🎉 Deployment complete! .env.local generated."
