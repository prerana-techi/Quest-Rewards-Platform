#!/bin/bash
set -euo pipefail

# ==============================================================================
# Soroban Contract Upgrade Utility
# Installs new WASM bytecode and invokes the `upgrade` function on the target contract
# ==============================================================================

if [[ $# -lt 3 ]]; then
    echo "Usage: $0 <contract-type: core|reputation> <target-contract-id> <path-to-new-wasm> [network] [source-identity]"
    echo "Example: $0 core C... contracts/target/wasm32-unknown-unknown/release/quest_core.wasm testnet quest-deployer"
    exit 1
fi

CONTRACT_TYPE="$1"
TARGET_CONTRACT_ID="$2"
NEW_WASM_PATH="$3"
NETWORK="${4:-testnet}"
SOURCE_IDENTITY="${5:-quest-deployer}"

echo "========================================================"
echo "🔄 Upgrading ${CONTRACT_TYPE} Contract: ${TARGET_CONTRACT_ID}"
echo "========================================================"

if [[ ! -f "$NEW_WASM_PATH" ]]; then
    echo "❌ Error: WASM file $NEW_WASM_PATH does not exist"
    exit 1
fi

echo "1️⃣ Installing new WASM bytecode onto network: ${NETWORK}..."
NEW_WASM_HASH=$(stellar contract install \
    --wasm "$NEW_WASM_PATH" \
    --source "${SOURCE_IDENTITY}" \
    --network "${NETWORK}")

echo "✅ Installed WASM Hash: ${NEW_WASM_HASH}"

SOURCE_ADDRESS=$(stellar keys address "${SOURCE_IDENTITY}")

echo "2️⃣ Invoking upgrade function on contract..."
stellar contract invoke \
    --id "${TARGET_CONTRACT_ID}" \
    --source "${SOURCE_IDENTITY}" \
    --network "${NETWORK}" \
    -- \
    upgrade \
    --admin "${SOURCE_ADDRESS}" \
    --new_wasm_hash "${NEW_WASM_HASH}"

echo "🎉 Contract successfully upgraded to new WASM hash: ${NEW_WASM_HASH}!"
