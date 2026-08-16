'use client';

import React, { useState } from 'react';
import { useQuestStore } from '@/store/useQuestStore';
import { useWalletStore } from '@/store/useWalletStore';
import { useContract } from '@/hooks/useContract';
import { SUPPORTED_TOKENS } from '@/config/network';
import { BadgeTierType } from '@/types';
import { GasEstimator } from '@/components/GasEstimator';
import { X, Sparkles, Lock, AlertCircle, Check, Coins } from 'lucide-react';

export function CreateQuestModal() {
  const { createModalOpen, setCreateModalOpen } = useQuestStore();
  const { isConnected, setConnectModalOpen } = useWalletStore();
  const { createQuest, isExecuting } = useContract();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rewardToken, setRewardToken] = useState(SUPPORTED_TOKENS[0].address);
  const [tokenSymbol, setTokenSymbol] = useState(SUPPORTED_TOKENS[0].symbol);
  const [rewardAmount, setRewardAmount] = useState<number>(500);
  const [xpReward, setXpReward] = useState<number>(150);
  const [badgeTier, setBadgeTier] = useState<BadgeTierType>('Silver');
  const [deadlineDays, setDeadlineDays] = useState<number>(7);
  const [maxWinners, setMaxWinners] = useState<number>(1);
  const [tagsInput, setTagsInput] = useState('Rust, Soroban, Smart Contracts');
  const [repoUrl, setRepoUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!createModalOpen) return null;

  const totalEscrowRequired = rewardAmount * maxWinners;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      setConnectModalOpen(true);
      return;
    }
    if (!title.trim() || !description.trim()) {
      setError('Please fill in both title and description.');
      return;
    }
    if (rewardAmount <= 0) {
      setError('Reward amount must be greater than 0.');
      return;
    }

    setError(null);
    try {
      const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
      await createQuest({
        title,
        description,
        rewardToken,
        tokenSymbol,
        rewardAmount,
        xpReward,
        badgeTier,
        deadlineDays,
        maxWinners,
        tags,
        repoUrl: repoUrl.trim() || undefined,
      });
    } catch (err: any) {
      setError(err?.message || 'Failed to create quest.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-xl my-8 rounded-2xl border border-slate-800 bg-slate-900/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <button
          onClick={() => setCreateModalOpen(false)}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-100">Create Bounty Quest</h3>
            <p className="text-xs text-slate-400">Lock escrow funds & configure verifiable developer challenge</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Quest Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Implement Soroban Atomic Multi-Sig Escrow"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Challenge Specification</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe deliverables, technical constraints, PR submission requirements..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Reward Asset</label>
              <select
                value={rewardToken}
                onChange={(e) => {
                  setRewardToken(e.target.value);
                  const selected = SUPPORTED_TOKENS.find((t) => t.address === e.target.value);
                  if (selected) setTokenSymbol(selected.symbol);
                }}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 focus:border-violet-500 focus:outline-none"
              >
                {SUPPORTED_TOKENS.map((token) => (
                  <option key={token.address} value={token.address}>
                    {token.icon} {token.symbol} - {token.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Reward Amount (per winner)
              </label>
              <input
                type="number"
                value={rewardAmount}
                onChange={(e) => setRewardAmount(Number(e.target.value))}
                min={1}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 focus:border-violet-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Max Winners</label>
              <input
                type="number"
                value={maxWinners}
                onChange={(e) => setMaxWinners(Math.max(1, Number(e.target.value)))}
                min={1}
                max={10}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 focus:border-violet-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Deadline (Days)</label>
              <input
                type="number"
                value={deadlineDays}
                onChange={(e) => setDeadlineDays(Math.max(1, Number(e.target.value)))}
                min={1}
                max={90}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 focus:border-violet-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Badge Tier</label>
              <select
                value={badgeTier}
                onChange={(e) => {
                  const val = e.target.value as BadgeTierType;
                  setBadgeTier(val);
                  if (val === 'Diamond') setXpReward(500);
                  else if (val === 'Platinum') setXpReward(350);
                  else if (val === 'Gold') setXpReward(250);
                  else if (val === 'Silver') setXpReward(150);
                  else setXpReward(100);
                }}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 focus:border-violet-500 focus:outline-none"
              >
                <option value="Bronze">🥉 Bronze (100 XP)</option>
                <option value="Silver">🥈 Silver (150 XP)</option>
                <option value="Gold">🥇 Gold (250 XP)</option>
                <option value="Platinum">💠 Platinum (350 XP)</option>
                <option value="Diamond">💎 Diamond (500 XP)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tags (comma-separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Rust, Soroban, CLI"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 focus:border-violet-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">GitHub Repo / Issue Link (Optional)</label>
              <input
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 focus:border-violet-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Gas Resource Estimator */}
          <GasEstimator operation="create_quest" />

          {/* Escrow Lock Banner */}
          <div className="rounded-xl border border-violet-500/30 bg-violet-950/20 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-violet-400" />
                <span className="text-xs font-semibold text-slate-200">On-Chain Escrow Lock</span>
              </div>
              <span className="font-mono text-sm font-bold text-violet-300">
                {totalEscrowRequired} {tokenSymbol}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Upon confirmation, the Soroban <code className="text-violet-300">quest_core</code> contract will transfer and hold{' '}
              <strong className="text-slate-200">{totalEscrowRequired} {tokenSymbol}</strong> in trustless escrow until submissions are verified.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isExecuting}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 hover:from-violet-500 hover:to-indigo-500 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              <Coins className="h-4 w-4" />
              <span>{isExecuting ? 'Locking Escrow...' : `Post Quest (${totalEscrowRequired} ${tokenSymbol})`}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
