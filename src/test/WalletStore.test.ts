import { describe, it, expect, beforeEach } from 'vitest';
import { useWalletStore } from '@/store/useWalletStore';

describe('useWalletStore', () => {
  beforeEach(() => {
    useWalletStore.getState().disconnect();
  });

  it('should initialize with disconnected default state', () => {
    const state = useWalletStore.getState();
    expect(state.isConnected).toBe(false);
    expect(state.address).toBeNull();
    expect(state.balance).toBe('0.00');
  });

  it('should toggle network', () => {
    const store = useWalletStore.getState();
    store.setNetwork('mainnet');
    expect(useWalletStore.getState().network).toBe('mainnet');
  });

  it('should toggle connect modal open/close', () => {
    const store = useWalletStore.getState();
    store.setConnectModalOpen(true);
    expect(useWalletStore.getState().connectModalOpen).toBe(true);

    store.setConnectModalOpen(false);
    expect(useWalletStore.getState().connectModalOpen).toBe(false);
  });
});
