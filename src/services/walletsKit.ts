'use client';

import {
  StellarWalletsKit,
  WalletNetwork,
  allowAllModules,
  FREIGHTER_ID,
  ALBEDO_ID,
  XBULL_ID,
  HANA_ID,
  LOBSTR_ID,
} from '@creit.tech/stellar-wallets-kit';
import { DEFAULT_NETWORK_CONFIG } from '@/config/network';

export interface WalletSession {
  address: string;
  walletId: string;
  walletName: string;
  connectedAt: number;
}

class WalletsKitService {
  private kit: StellarWalletsKit | null = null;
  private currentSession: WalletSession | null = null;
  private currentNetwork: WalletNetwork = WalletNetwork.TESTNET;

  public getKit(): StellarWalletsKit {
    if (typeof window === 'undefined') {
      throw new Error('WalletsKit must be used in browser environment');
    }
    if (!this.kit) {
      this.kit = new StellarWalletsKit({
        network: this.currentNetwork,
        selectedWalletId: FREIGHTER_ID,
        modules: allowAllModules(),
      });
    }
    return this.kit;
  }

  public setNetwork(network: 'testnet' | 'public' | 'futurenet') {
    this.currentNetwork =
      network === 'public'
        ? WalletNetwork.PUBLIC
        : network === 'futurenet'
        ? WalletNetwork.FUTURENET
        : WalletNetwork.TESTNET;
    if (this.kit) {
      this.kit = new StellarWalletsKit({
        network: this.currentNetwork,
        selectedWalletId: this.currentSession?.walletId || FREIGHTER_ID,
        modules: allowAllModules(),
      });
    }
  }

  public async connectWallet(customWalletId?: string): Promise<WalletSession> {
    const kit = this.getKit();
    return new Promise((resolve, reject) => {
      if (customWalletId) {
        kit.setWallet(customWalletId);
        kit
          .getAddress()
          .then((res) => {
            const session: WalletSession = {
              address: res.address,
              walletId: customWalletId,
              walletName: customWalletId,
              connectedAt: Date.now(),
            };
            this.saveSession(session);
            resolve(session);
          })
          .catch(reject);
        return;
      }

      kit.openModal({
        onWalletSelected: async (option) => {
          try {
            kit.setWallet(option.id);
            const { address } = await kit.getAddress();
            const session: WalletSession = {
              address,
              walletId: option.id,
              walletName: option.name,
              connectedAt: Date.now(),
            };
            this.saveSession(session);
            resolve(session);
          } catch (err) {
            reject(err);
          }
        },
        onClosed: () => {},
      });
    });
  }

  public async signTransaction(xdrString: string): Promise<string> {
    const kit = this.getKit();
    const result = await kit.signTransaction(xdrString, {
      networkPassphrase: DEFAULT_NETWORK_CONFIG.networkPassphrase,
    });
    return result.signedTxXdr;
  }

  public saveSession(session: WalletSession) {
    this.currentSession = session;
    if (typeof window !== 'undefined') {
      localStorage.setItem('quest_wallet_session', JSON.stringify(session));
    }
  }

  public getSavedSession(): WalletSession | null {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem('quest_wallet_session');
      if (stored) {
        this.currentSession = JSON.parse(stored);
        if (this.currentSession?.walletId && this.kit) {
          this.kit.setWallet(this.currentSession.walletId);
        }
        return this.currentSession;
      }
    } catch {
      return null;
    }
    return null;
  }

  public disconnect() {
    this.currentSession = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('quest_wallet_session');
    }
  }
}

export const walletsKit = new WalletsKitService();
export { FREIGHTER_ID, ALBEDO_ID, XBULL_ID, HANA_ID, LOBSTR_ID };
