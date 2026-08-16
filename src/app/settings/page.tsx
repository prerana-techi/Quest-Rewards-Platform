'use client';

import React, { useState } from 'react';
import { useWalletStore } from '@/store/useWalletStore';
import { STELLAR_NETWORKS, DEFAULT_NETWORK_CONFIG } from '@/config/network';
import { Settings, Shield, Globe, Cpu, CheckCircle2, RefreshCw, Key, ExternalLink } from 'lucide-react';

export default function SettingsPage() {
  const { network, setNetwork, address, isConnected, disconnect } = useWalletStore();

  const [coreContractId, setCoreContractId] = useState(DEFAULT_NETWORK_CONFIG.questCoreContractId);
  const [reputationContractId, setReputationContractId] = useState(DEFAULT_NETWORK_CONFIG.questReputationContractId);
  const [rpcUrl, setRpcUrl] = useState(DEFAULT_NETWORK_CONFIG.rpcUrl);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Settings className="h-7 w-7 text-violet-400" />
          <span>Platform & Network Settings</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Configure Soroban RPC endpoints, contract addresses, and wallet network routing
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Network Selection */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Globe className="h-4 w-4 text-cyan-400" />
            <span>Target Stellar Network</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'testnet', name: 'Stellar Testnet', status: 'Active (Recommended)' },
              { id: 'local', name: 'Local Sandbox', status: 'Standalone RPC:8000' },
              { id: 'mainnet', name: 'Stellar Public', status: 'Production Ready' },
            ].map((net) => (
              <button
                key={net.id}
                type="button"
                onClick={() => setNetwork(net.id)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  network === net.id
                    ? 'border-violet-500 bg-violet-950/40 shadow-md shadow-violet-950/50'
                    : 'border-slate-800 bg-slate-950/40 hover:bg-slate-800/40'
                }`}
              >
                <p className="font-bold text-sm text-slate-100">{net.name}</p>
                <p className="text-[11px] text-slate-400 mt-1">{net.status}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Soroban Contract IDs */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Cpu className="h-4 w-4 text-violet-400" />
            <span>Active Contract Addresses</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                QuestCore Contract ID
              </label>
              <input
                type="text"
                value={coreContractId}
                onChange={(e) => setCoreContractId(e.target.value)}
                className="w-full font-mono rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-200 focus:border-violet-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                QuestReputation Contract ID
              </label>
              <input
                type="text"
                value={reputationContractId}
                onChange={(e) => setReputationContractId(e.target.value)}
                className="w-full font-mono rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-200 focus:border-violet-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Soroban RPC Server Endpoint
              </label>
              <input
                type="url"
                value={rpcUrl}
                onChange={(e) => setRpcUrl(e.target.value)}
                className="w-full font-mono rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-200 focus:border-violet-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Wallet Session */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-400" />
            <span>Wallet Session Management</span>
          </h3>

          {isConnected && address ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div>
                <p className="text-xs text-slate-400 font-medium">Currently Connected</p>
                <p className="font-mono text-xs text-slate-200 break-all">{address}</p>
              </div>
              <button
                type="button"
                onClick={disconnect}
                className="rounded-xl bg-rose-500/10 border border-rose-500/20 px-4 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition-colors"
              >
                Disconnect Session
              </button>
            </div>
          ) : (
            <p className="text-xs text-slate-400">No active wallet session connected.</p>
          )}
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-300">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Settings saved successfully!</span>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 hover:from-violet-500 hover:to-indigo-500 transition-all hover:scale-105"
          >
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
