import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock localStorage
const localStorageMock = (function () {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

// Mock @creit.tech/stellar-wallets-kit for node/jsdom test runner
vi.mock('@creit.tech/stellar-wallets-kit', () => {
  return {
    StellarWalletsKit: class {
      setNetwork = vi.fn();
      setWallet = vi.fn();
      getAddress = vi.fn().mockResolvedValue({ address: 'GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFTGXDUTHXPIWNX6VOXR3' });
      signTransaction = vi.fn().mockResolvedValue({ signedTxXdr: 'AAAA...' });
      openModal = vi.fn();
    },
    WalletNetwork: {
      TESTNET: 'testnet',
      PUBLIC: 'public',
      FUTURENET: 'futurenet',
    },
    allowAllModules: () => [],
    FREIGHTER_ID: 'freighter',
    ALBEDO_ID: 'albedo',
    XBULL_ID: 'xbull',
    HANA_ID: 'hana',
    LOBSTR_ID: 'lobstr',
  };
});
