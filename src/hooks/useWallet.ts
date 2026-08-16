'use client';

import { useEffect } from 'react';
import { useWalletStore } from '@/store/useWalletStore';

export function useWallet() {
  const {
    address,
    walletName,
    isConnected,
    isConnecting,
    balance,
    network,
    connectModalOpen,
    initializeSession,
    connect,
    disconnect,
    refreshBalance,
    fundAccount,
    setNetwork,
    setConnectModalOpen,
  } = useWalletStore();

  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  const truncateAddress = (addr: string | null, start = 4, end = 4) => {
    if (!addr) return '';
    if (addr.length <= start + end) return addr;
    return `${addr.slice(0, start)}...${addr.slice(-end)}`;
  };

  return {
    address,
    walletName,
    isConnected,
    isConnecting,
    balance,
    network,
    connectModalOpen,
    connect,
    disconnect,
    refreshBalance,
    fundAccount,
    setNetwork,
    setConnectModalOpen,
    truncateAddress,
  };
}
