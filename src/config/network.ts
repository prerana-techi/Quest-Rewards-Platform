import { NetworkConfig } from '@/types';

export const STELLAR_NETWORKS = {
  TESTNET: {
    network: 'testnet',
    rpcUrl: process.env.NEXT_PUBLIC_STELLAR_RPC_URL || 'https://soroban-testnet.stellar.org',
    networkPassphrase: process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE || 'Test SDF Network ; September 2015',
    questCoreContractId: process.env.NEXT_PUBLIC_QUEST_CORE_CONTRACT_ID || 'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMDR4',
    questReputationContractId: process.env.NEXT_PUBLIC_QUEST_REPUTATION_CONTRACT_ID || 'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAK3IM',
    nativeTokenAddress: process.env.NEXT_PUBLIC_NATIVE_TOKEN_ADDRESS || 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC',
    explorerUrl: process.env.NEXT_PUBLIC_EXPLORER_URL || 'https://stellar.expert/explorer/testnet',
  },
  LOCAL: {
    network: 'local',
    rpcUrl: 'http://localhost:8000/soroban/rpc',
    networkPassphrase: 'Standalone Network ; February 2022',
    questCoreContractId: 'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMDR4',
    questReputationContractId: 'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAK3IM',
    nativeTokenAddress: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC',
    explorerUrl: 'http://localhost:8000',
  },
  MAINNET: {
    network: 'mainnet',
    rpcUrl: 'https://mainnet.sorobanrpc.com',
    networkPassphrase: 'Public Global Stellar Network ; September 2015',
    questCoreContractId: '',
    questReputationContractId: '',
    nativeTokenAddress: 'CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA',
    explorerUrl: 'https://stellar.expert/explorer/public',
  },
};

export const DEFAULT_NETWORK_CONFIG: NetworkConfig = STELLAR_NETWORKS.TESTNET;

export const SUPPORTED_TOKENS = [
  {
    symbol: 'XLM',
    name: 'Stellar Lumens',
    address: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC',
    decimals: 7,
    icon: '✨',
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: 'CBIELTK6YBZJU5UP2WWQEUCYJLPU6QXN3F5ZCSJHQK2GB7BOGFCP5L56',
    decimals: 7,
    icon: '💵',
  },
  {
    symbol: 'SORO',
    name: 'Soroban Token',
    address: 'CC7V7J3NZ36XU2HQALWPMF73Z2Z3V63MQL2T6GBJHQKP5K6Z4Z23MNO4',
    decimals: 7,
    icon: '⚡',
  },
];
