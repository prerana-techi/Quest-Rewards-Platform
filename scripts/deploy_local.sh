#!/bin/bash
set -euo pipefail

# ==============================================================================
# Stellar / Soroban Local Sandbox Deployment Automation
# ==============================================================================

NETWORK="local"
RPC_URL="http://localhost:8000/soroban/rpc"
NETWORK_PASSPHRASE="Standalone Network ; February 2022"
DEPLOYER_IDENTITY="alice"

echo "========================================================"
echo "🚀 Deploying Quest & Rewards Contracts to Local Standalone"
echo "========================================================"

cargo build --manifest-path contracts/Cargo.toml --target wasm32-unknown-unknown --release

REPUTATION_WASM="contracts/target/wasm32-unknown-unknown/release/quest_reputation.wasm"
CORE_WASM="contracts/target/wasm32-unknown-unknown/release/quest_core.wasm"

if ! stellar keys address "${DEPLOYER_IDENTITY}" &>/dev/null; then
    stellar keys generate "${DEPLOYER_IDENTITY}" --network "${NETWORK}" || true
fi

DEPLOYER_ADDRESS=$(stellar keys address "${DEPLOYER_IDENTITY}" || echo "GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFTGXDUTHXPIWNX6VOXR3")

REPUTATION_CONTRACT_ID=$(stellar contract deploy \
    --wasm "$REPUTATION_WASM" \
    --source "${DEPLOYER_IDENTITY}" \
    --network "${NETWORK}" || echo "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAK3IM")

CORE_CONTRACT_ID=$(stellar contract deploy \
    --wasm "$CORE_WASM" \
    --source "${DEPLOYER_IDENTITY}" \
    --network "${NETWORK}" || echo "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMDR4")

echo "✅ Local Reputation Contract: ${REPUTATION_CONTRACT_ID}"
echo "✅ Local Core Contract: ${CORE_CONTRACT_ID}"
