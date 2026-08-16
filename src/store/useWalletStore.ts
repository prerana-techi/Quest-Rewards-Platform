'use client';

import { create } from 'zustand';
import { walletsKit, WalletSession } from '@/services/walletsKit';
import { stellarRpc } from '@/services/stellarRpc';
import { DEFAULT_NETWORK_CONFIG } from '@/config/network';

interface WalletState {
  address: string | null;
  walletName: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  balance: string;
  network: string;
  connectModalOpen: boolean;

  // Actions
  initializeSession: () => Promise<void>;
  connect: (walletId?: string) => Promise<void>;
  disconnect: () => void;
  refreshBalance: () => Promise<void>;
  fundAccount: () => Promise<boolean>;
  setNetwork: (network: string) => void;
  setConnectModalOpen: (open: boolean) => void;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  address: null,
  walletName: null,
  isConnected: false,
  isConnecting: false,
  balance: '0.00',
  network: DEFAULT_NETWORK_CONFIG.network,
  connectModalOpen: false,

  initializeSession: async () => {
    const saved = walletsKit.getSavedSession();
    if (saved) {
      set({
        address: saved.address,
        walletName: saved.walletName,
        isConnected: true,
      });
      await get().refreshBalance();
    }
  },

  connect: async (walletId?: string) => {
    set({ isConnecting: true });
    try {
      const session = await walletsKit.connectWallet(walletId);
      set({
        address: session.address,
        walletName: session.walletName,
        isConnected: true,
        isConnecting: false,
        connectModalOpen: false,
      });
      await get().refreshBalance();
    } catch (err) {
      console.error('Wallet connection failed', err);
      set({ isConnecting: false });
      throw err;
    }
  },

  disconnect: () => {
    walletsKit.disconnect();
    set({
      address: null,
      walletName: null,
      isConnected: false,
      balance: '0.00',
    });
  },

  refreshBalance: async () => {
    const { address } = get();
    if (!address) return;
    try {
      const bal = await stellarRpc.getAccountBalance(address);
      set({ balance: bal });
    } catch (err) {
      console.warn('Balance refresh failed', err);
    }
  },

  fundAccount: async () => {
    const { address } = get();
    if (!address) return false;
    const funded = await stellarRpc.requestFriendbot(address);
    if (funded) {
      setTimeout(() => get().refreshBalance(), 2000);
    }
    return funded;
  },

  setNetwork: (network: string) => {
    set({ network });
  },

  setConnectModalOpen: (open: boolean) => {
    set({ connectModalOpen: open });
  },
}));
