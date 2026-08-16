'use client';

import React, { useState } from 'react';
import { useWalletStore } from '@/store/useWalletStore';
import { FREIGHTER_ID, ALBEDO_ID, XBULL_ID, HANA_ID, LOBSTR_ID } from '@/services/walletsKit';
import { X, Shield, ExternalLink, Sparkles, CheckCircle2, ArrowRight, Coins, RefreshCw } from 'lucide-react';

export function WalletConnectModal() {
  const {
    connectModalOpen,
    setConnectModalOpen,
    connect,
    isConnecting,
    address,
    isConnected,
    fundAccount,
    refreshBalance,
  } = useWalletStore();
  const [funding, setFunding] = useState(false);
  const [fundedSuccess, setFundedSuccess] = useState(false);

  if (!connectModalOpen) return null;

  const walletOptions = [
    {
      id: FREIGHTER_ID,
      name: 'Freighter Wallet',
      description: 'Official browser extension recommended by Stellar Development Foundation',
      icon: '🚀',
      popular: true,
    },
    {
      id: XBULL_ID,
      name: 'xBull Wallet',
      description: 'Feature-packed wallet supporting multi-account and hardware signers',
      icon: '🐂',
    },
    {
      id: ALBEDO_ID,
      name: 'Albedo',
      description: 'Web-based delegated signer, no installation required',
      icon: '🌐',
    },
    {
      id: HANA_ID,
      name: 'Hana Wallet',
      description: 'Multi-chain mobile & browser wallet with Soroban support',
      icon: '🌸',
    },
    {
      id: LOBSTR_ID,
      name: 'Lobstr Wallet',
      description: 'Mobile signer with seamless QR authentication',
      icon: '🦞',
    },
  ];

  const handleFund = async () => {
    if (!address) return;
    setFunding(true);
    setFundedSuccess(false);
    try {
      const ok = await fundAccount();
      if (ok) {
        setFundedSuccess(true);
        setTimeout(() => setFundedSuccess(false), 4000);
      }
    } finally {
      setFunding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl">
        {/* Close Button */}
        <button
          onClick={() => setConnectModalOpen(false)}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-400">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Connect Stellar Wallet</h3>
            <p className="text-xs text-slate-400">Choose your preferred signer to interact with Soroban</p>
          </div>
        </div>

        {/* Connected state faucet option */}
        {isConnected && address ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-4">
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold mb-1">
                <CheckCircle2 className="h-4 w-4" />
                <span>Wallet Connected</span>
              </div>
              <p className="font-mono text-xs text-slate-300 break-all">{address}</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coins className="h-4 w-4 text-amber-400" />
                  <span className="text-xs font-semibold text-slate-200">Testnet Friendbot Faucet</span>
                </div>
                <span className="text-[10px] text-slate-400">Free 10,000 XLM</span>
              </div>
              <p className="text-xs text-slate-400">Need test funds to post bounties or pay transaction fees?</p>
              <button
                onClick={handleFund}
                disabled={funding}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-amber-500/20 border border-amber-500/30 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/30 transition-colors"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${funding ? 'animate-spin' : ''}`} />
                <span>{funding ? 'Requesting Friendbot...' : 'Fund Account (+10,000 XLM)'}</span>
              </button>
              {fundedSuccess && (
                <p className="text-[11px] text-emerald-400 text-center font-medium">
                  🎉 Account funded successfully! Balance updated.
                </p>
              )}
            </div>

            <button
              onClick={() => setConnectModalOpen(false)}
              className="w-full rounded-xl bg-violet-600 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          /* Wallet list */
          <div className="space-y-2.5">
            {walletOptions.map((wallet) => (
              <button
                key={wallet.id}
                onClick={() => connect(wallet.id)}
                disabled={isConnecting}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-950/40 hover:border-violet-500/40 hover:bg-slate-800/40 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{wallet.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-200 group-hover:text-violet-300 transition-colors">
                        {wallet.name}
                      </span>
                      {wallet.popular && (
                        <span className="rounded-full bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 text-[10px] font-semibold text-violet-400">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">{wallet.description}</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500">
            Powered by <span className="text-slate-400 font-semibold">StellarWalletsKit</span> • Non-custodial & secure
          </p>
        </div>
      </div>
    </div>
  );
}
