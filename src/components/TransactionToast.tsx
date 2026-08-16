'use client';

import React from 'react';
import { useTransactionStore } from '@/store/useTransactionStore';
import { RefreshCw, CheckCircle2, AlertCircle, ExternalLink, X, ArrowUpRight } from 'lucide-react';

export function TransactionToast() {
  const { transactions, activeTxId, updateStatus } = useTransactionStore();

  const activeTx = transactions.find((t) => t.id === activeTxId) || transactions[0];
  if (!activeTx || activeTx.status === 'confirmed' || activeTx.status === 'failed') {
    // Only show active or latest toast if recently updated
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5 duration-300">
      <div className="rounded-2xl border border-violet-500/40 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-xl space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600/20 border border-violet-500/30 text-violet-400">
              <RefreshCw className="h-4 w-4 animate-spin text-violet-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100">{activeTx.title}</h4>
              <p className="text-[11px] text-slate-400 capitalize">{activeTx.status} on Stellar Testnet...</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-300 line-clamp-2">{activeTx.description}</p>

        {activeTx.hash && (
          <div className="flex items-center justify-between pt-1 text-xs">
            <span className="text-slate-400">Tx Hash:</span>
            <a
              href={activeTx.explorerUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 font-mono text-violet-400 hover:underline"
            >
              <span>{activeTx.hash.slice(0, 8)}...{activeTx.hash.slice(-6)}</span>
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
