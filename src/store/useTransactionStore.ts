'use client';

import { create } from 'zustand';
import { TransactionRecord, TxStatus } from '@/types';
import { DEFAULT_NETWORK_CONFIG } from '@/config/network';

interface TransactionState {
  transactions: TransactionRecord[];
  activeTxId: string | null;

  // Actions
  addTransaction: (tx: Omit<TransactionRecord, 'id' | 'timestamp' | 'status'>) => string;
  updateStatus: (id: string, status: TxStatus, hash?: string, error?: string, gasFee?: string) => void;
  setRetryAction: (id: string, action: () => Promise<void>) => void;
  clearTransactions: () => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  activeTxId: null,

  addTransaction: (txData) => {
    const id = `tx-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newTx: TransactionRecord = {
      ...txData,
      id,
      timestamp: Date.now(),
      status: 'signing',
    };

    set((state) => ({
      transactions: [newTx, ...state.transactions],
      activeTxId: id,
    }));

    return id;
  },

  updateStatus: (id, status, hash, error, gasFee) => {
    set((state) => ({
      transactions: state.transactions.map((tx) => {
        if (tx.id === id) {
          const explorerUrl = hash ? `${DEFAULT_NETWORK_CONFIG.explorerUrl}/tx/${hash}` : tx.explorerUrl;
          return {
            ...tx,
            status,
            hash: hash || tx.hash,
            error: error || tx.error,
            gasFee: gasFee || tx.gasFee,
            explorerUrl,
          };
        }
        return tx;
      }),
      activeTxId: status === 'confirmed' || status === 'failed' ? null : state.activeTxId,
    }));
  },

  setRetryAction: (id, action) => {
    set((state) => ({
      transactions: state.transactions.map((tx) => (tx.id === id ? { ...tx, retryAction: action } : tx)),
    }));
  },

  clearTransactions: () => {
    set({ transactions: [], activeTxId: null });
  },
}));
