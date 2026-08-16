'use client';

import React from 'react';
import { useTransactionStore } from '@/store/useTransactionStore';
import { DEFAULT_NETWORK_CONFIG } from '@/config/network';
import {
  Layers,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  RotateCcw,
  Trash2,
  ArrowUpRight,
  ShieldAlert,
  Coins,
} from 'lucide-react';

export default function TransactionCenterPage() {
  const { transactions, updateStatus, clearTransactions } = useTransactionStore();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Confirmed</span>
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 text-xs font-semibold text-rose-400">
            <XCircle className="h-3.5 w-3.5" />
            <span>Failed</span>
          </span>
        );
      case 'submitting':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 text-xs font-semibold text-cyan-300">
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            <span>Submitting to Ledger...</span>
          </span>
        );
      case 'signing':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 text-xs font-semibold text-violet-300">
            <Clock className="h-3.5 w-3.5 animate-pulse" />
            <span>Awaiting Wallet Signature</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Layers className="h-7 w-7 text-violet-400" />
            <span>Transaction Lifecycle Center</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time status monitoring, simulation analysis, and explorer verification for Soroban transactions
          </p>
        </div>

        {transactions.length > 0 && (
          <button
            onClick={clearTransactions}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Transaction List */}
      {transactions.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center space-y-3">
          <Layers className="h-12 w-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">No Transactions Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Interact with the platform by posting bounties, submitting proof of work, or judging submissions to view lifecycle logs here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="glass-panel rounded-2xl p-5 space-y-3 border border-slate-800/80"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-100">{tx.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{tx.description}</p>
                </div>
                <div>{getStatusBadge(tx.status)}</div>
              </div>

              {tx.hash && (
                <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Transaction Hash:</span>
                    <span className="font-mono text-slate-200 break-all">{tx.hash}</span>
                  </div>
                  <a
                    href={tx.explorerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-violet-400 hover:underline shrink-0"
                  >
                    <span>View on Stellar Expert</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}

              {tx.error && (
                <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-300 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 shrink-0 text-rose-400" />
                    <span>{tx.error}</span>
                  </div>
                  {tx.retryAction && (
                    <button
                      onClick={() => tx.retryAction?.()}
                      className="flex items-center gap-1 rounded-lg bg-rose-500/20 px-2.5 py-1 text-xs font-bold text-rose-300 hover:bg-rose-500/30"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>Retry</span>
                    </button>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/60">
                <span>Initiated: {new Date(tx.timestamp).toLocaleTimeString()}</span>
                {tx.gasFee && <span>Gas Fee: {tx.gasFee}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
