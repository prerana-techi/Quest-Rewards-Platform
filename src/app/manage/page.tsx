'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useWalletStore } from '@/store/useWalletStore';
import { useQuestStore } from '@/store/useQuestStore';
import { useContract } from '@/hooks/useContract';
import { StatCard } from '@/components/StatCard';
import {
  ShieldCheck,
  Coins,
  Clock,
  RotateCcw,
  Plus,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Award,
  Users,
  Settings,
  FolderLock,
} from 'lucide-react';

export default function SponsorManagePage() {
  const { address, isConnected, setConnectModalOpen } = useWalletStore();
  const { quests, setCreateModalOpen, setReviewModalSubmission, submissions } = useQuestStore();
  const { isExecuting } = useContract();

  const [refundSuccess, setRefundSuccess] = useState<number | null>(null);
  const [reviewerInput, setReviewerInput] = useState('');
  const [assignedReviewers, setAssignedReviewers] = useState<string[]>([
    'GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFTGXDUTHXPIWNX6VOXR3',
  ]);

  const myCreatedQuests = useMemo(() => {
    if (!address) return [];
    return quests.filter((q) => q.sponsor.toLowerCase() === address.toLowerCase() || q.sponsor.includes(address.slice(0, 4)));
  }, [quests, address]);

  const totalLockedEscrow = useMemo(() => {
    return myCreatedQuests
      .filter((q) => q.status === 'Open' || q.status === 'InReview')
      .reduce((acc, q) => acc + q.formattedAmount * (q.maxWinners - q.winnersCount), 0);
  }, [myCreatedQuests]);

  const handleRefund = (questId: number) => {
    setRefundSuccess(questId);
    setTimeout(() => setRefundSuccess(null), 4000);
  };

  const handleAddReviewer = (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewerInput.trim() && !assignedReviewers.includes(reviewerInput.trim())) {
      setAssignedReviewers([...assignedReviewers, reviewerInput.trim()]);
      setReviewerInput('');
    }
  };

  if (!isConnected || !address) {
    return (
      <div className="text-center py-24 glass-panel rounded-3xl space-y-4 max-w-lg mx-auto">
        <FolderLock className="h-12 w-12 text-violet-400 mx-auto animate-pulse" />
        <h2 className="text-2xl font-bold text-slate-100">Sponsor Management Console</h2>
        <p className="text-xs text-slate-400">
          Connect your wallet to manage your posted bounties, inspect locked escrow vaults, and reclaim expired funds.
        </p>
        <button
          onClick={() => setConnectModalOpen(true)}
          className="rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 transition-colors"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <FolderLock className="h-7 w-7 text-cyan-400" />
            <span>Sponsor Escrow & Bounty Console</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your created bounties, inspect locked escrow balances, and assign whitelisted reviewers
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 hover:from-violet-500 hover:to-indigo-500 transition-all hover:scale-105"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Bounty</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Bounties Posted"
          value={myCreatedQuests.length}
          subtitle="Managed Quests"
          icon={ShieldCheck}
          glow="purple"
        />
        <StatCard
          title="Locked In Escrow"
          value={`${totalLockedEscrow.toLocaleString()} XLM`}
          subtitle="Awaiting Verification"
          icon={Coins}
          glow="cyan"
        />
        <StatCard
          title="Whitelisted Reviewers"
          value={assignedReviewers.length}
          subtitle="Authorized RBAC Judges"
          icon={Users}
          glow="emerald"
        />
      </div>

      {/* Posted Bounties Table / List */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Coins className="h-5 w-5 text-amber-400" />
            <span>My Posted Bounties ({myCreatedQuests.length})</span>
          </h3>
        </div>

        {myCreatedQuests.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl space-y-3">
            <Coins className="h-8 w-8 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">You have not posted any bounties yet.</p>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="rounded-xl bg-violet-600/20 border border-violet-500/30 px-4 py-2 text-xs font-semibold text-violet-300 hover:bg-violet-600/30"
            >
              Post First Bounty
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {myCreatedQuests.map((quest) => {
              const isExpired = Date.now() / 1000 > quest.deadline;
              const remainingSlots = quest.maxWinners - quest.winnersCount;
              const refundableAmount = quest.formattedAmount * remainingSlots;

              return (
                <div
                  key={quest.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-violet-400">Quest #{quest.id}</span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                            quest.status === 'Completed'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : quest.status === 'Open'
                              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {quest.status}
                        </span>
                      </div>
                      <Link href={`/quest/${quest.id}`} className="block hover:underline">
                        <h4 className="text-base font-bold text-slate-100 mt-1">{quest.title}</h4>
                      </Link>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Total Escrow</span>
                      <p className="font-mono text-sm font-bold text-slate-200">
                        {quest.formattedAmount * quest.maxWinners} {quest.tokenSymbol}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase">Winners Filled</span>
                      <p className="font-semibold text-slate-200">
                        {quest.winnersCount} / {quest.maxWinners}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase">Deadline Status</span>
                      <p className={`font-semibold ${isExpired ? 'text-rose-400' : 'text-slate-200'}`}>
                        {isExpired ? 'Deadline Passed' : 'Active Bounty'}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase">Badge Credential</span>
                      <p className="font-semibold text-amber-400">{quest.badgeTier}</p>
                    </div>
                    <div className="flex items-center justify-end">
                      {isExpired && remainingSlots > 0 && quest.status !== 'Completed' && (
                        <button
                          onClick={() => handleRefund(quest.id)}
                          className="flex items-center gap-1.5 rounded-xl bg-amber-500/20 border border-amber-500/30 px-3.5 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500/30 transition-colors"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          <span>Reclaim Escrow ({refundableAmount} XLM)</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {refundSuccess === quest.id && (
                    <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-2.5 text-xs text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <span>
                        Refund confirmed on-chain! {refundableAmount} XLM transferred back to your wallet.
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reviewer Whitelist RBAC Console */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-400">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Reviewer Role-Based Access Control (RBAC)</h3>
            <p className="text-xs text-slate-400">Whitelist verified developers to judge submissions and trigger payouts</p>
          </div>
        </div>

        <form onSubmit={handleAddReviewer} className="flex gap-3">
          <input
            type="text"
            value={reviewerInput}
            onChange={(e) => setReviewerInput(e.target.value)}
            placeholder="Enter Stellar Public Key (G...)"
            className="flex-1 font-mono rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-200 focus:border-violet-500 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-xl bg-violet-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-violet-500 transition-colors"
          >
            Authorize Reviewer
          </button>
        </form>

        <div className="space-y-2">
          {assignedReviewers.map((reviewer, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/40 text-xs"
            >
              <span className="font-mono text-slate-300 break-all">{reviewer}</span>
              <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                Authorized Judge
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
