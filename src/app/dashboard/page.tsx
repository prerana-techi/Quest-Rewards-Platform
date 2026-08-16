'use client';

import React, { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useQuestStore } from '@/store/useQuestStore';
import { useWalletStore } from '@/store/useWalletStore';
import { useReputation } from '@/hooks/useReputation';
import { StatCard } from '@/components/StatCard';
import { BadgeDisplay } from '@/components/BadgeDisplay';
import {
  Compass,
  Plus,
  Search,
  Filter,
  Coins,
  Clock,
  Send,
  Sparkles,
  Award,
  GitPullRequest,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Flame,
} from 'lucide-react';

export default function DashboardPage() {
  const {
    quests,
    submissions,
    filters,
    loadInitialData,
    setSearchQuery,
    setStatusFilter,
    setTagFilter,
    setSortBy,
    setCreateModalOpen,
    setSubmitModalQuest,
    setReviewModalSubmission,
  } = useQuestStore();

  const { address, isConnected, setConnectModalOpen } = useWalletStore();
  const { profile } = useReputation();

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    quests.forEach((q) => q.tags?.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [quests]);

  // Filter and sort quests
  const filteredQuests = useMemo(() => {
    return quests
      .filter((q) => {
        if (filters.statusFilter !== 'all' && q.status.toLowerCase() !== filters.statusFilter.toLowerCase()) {
          return false;
        }
        if (filters.tagFilter !== 'all' && !q.tags?.includes(filters.tagFilter)) {
          return false;
        }
        if (filters.searchQuery) {
          const qText = `${q.title} ${q.description} ${q.tags?.join(' ')}`.toLowerCase();
          if (!qText.includes(filters.searchQuery.toLowerCase())) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'reward_high') return b.formattedAmount - a.formattedAmount;
        if (filters.sortBy === 'reward_low') return a.formattedAmount - b.formattedAmount;
        if (filters.sortBy === 'deadline') return a.deadline - b.deadline;
        return b.createdAt - a.createdAt;
      });
  }, [quests, filters]);

  const totalEscrowLocked = useMemo(() => {
    return quests
      .filter((q) => q.status === 'Open' || q.status === 'InReview')
      .reduce((acc, q) => acc + q.formattedAmount * (q.maxWinners - q.winnersCount), 0);
  }, [quests]);

  const mySubmissions = useMemo(() => {
    if (!address) return [];
    return submissions.filter((s) => s.contributor === address);
  }, [submissions, address]);

  const pendingReviews = useMemo(() => {
    return submissions.filter((s) => s.status === 'Pending');
  }, [submissions]);

  return (
    <div className="space-y-8">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Compass className="h-7 w-7 text-violet-400" />
            <span>Quest Discovery & Bounties</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Explore active developer challenges with trustless on-chain Soroban escrow rewards
          </p>
        </div>

        <button
          onClick={() => {
            if (isConnected) setCreateModalOpen(true);
            else setConnectModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 hover:from-violet-500 hover:to-indigo-500 transition-all hover:scale-105"
        >
          <Plus className="h-4 w-4" />
          <span>Post Bounty</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Bounties"
          value={quests.filter((q) => q.status === 'Open').length}
          subtitle="Open for submissions"
          icon={Flame}
          glow="purple"
        />
        <StatCard
          title="Escrow In Vault"
          value={`${totalEscrowLocked.toLocaleString()} XLM`}
          subtitle="Held non-custodially"
          icon={Coins}
          glow="cyan"
        />
        <StatCard
          title="My Reputation"
          value={`Level ${profile.level}`}
          subtitle={`${profile.xp} Total XP`}
          icon={Award}
          glow="emerald"
        />
        <StatCard
          title="My Completed Quests"
          value={profile.questsCompleted}
          subtitle={`${profile.formattedTotalEarned} XLM Earned`}
          icon={CheckCircle2}
          glow="amber"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by title, technology (e.g. Rust, Escrow, CLI)..."
              value={filters.searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-violet-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Status Filter */}
            <select
              value={filters.statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2.5 text-xs text-slate-200 focus:border-violet-500 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="inreview">In Review</option>
              <option value="completed">Completed</option>
              <option value="expired">Expired</option>
            </select>

            {/* Tag Filter */}
            <select
              value={filters.tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2.5 text-xs text-slate-200 focus:border-violet-500 focus:outline-none"
            >
              <option value="all">All Technologies</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>

            {/* Sort Filter */}
            <select
              value={filters.sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2.5 text-xs text-slate-200 focus:border-violet-500 focus:outline-none"
            >
              <option value="latest">Newest First</option>
              <option value="reward_high">Highest Reward</option>
              <option value="reward_low">Lowest Reward</option>
              <option value="deadline">Ending Soon</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuests.map((quest) => {
          const isExpired = Date.now() / 1000 > quest.deadline;
          const remainingDays = Math.max(0, Math.ceil((quest.deadline - Date.now() / 1000) / 86400));

          return (
            <div
              key={quest.id}
              className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header info */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-slate-400">Quest #{quest.id}</span>
                  <div className="flex items-center gap-2">
                    <BadgeDisplay tier={quest.badgeTier} title="" size="sm" />
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
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
                </div>

                {/* Title */}
                <Link href={`/quest/${quest.id}`} className="block group">
                  <h3 className="text-base font-bold text-slate-100 group-hover:text-violet-400 transition-colors line-clamp-2">
                    {quest.title}
                  </h3>
                </Link>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{quest.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {quest.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-slate-800/80 px-2 py-0.5 text-[10px] font-medium text-slate-300 border border-slate-700/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Reward & Footer Actions */}
              <div className="space-y-4 pt-4 border-t border-slate-800/80">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Reward Escrow</span>
                    <p className="font-mono text-base font-extrabold text-white">
                      {quest.formattedAmount} {quest.tokenSymbol}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">XP Award</span>
                    <p className="text-xs font-bold text-violet-400">+{quest.xpReward} XP</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-slate-500" />
                    <span>{isExpired ? 'Expired' : `${remainingDays}d remaining`}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GitPullRequest className="h-3.5 w-3.5 text-slate-500" />
                    <span>{quest.submissionsCount || 0} submissions</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <Link
                    href={`/quest/${quest.id}`}
                    className="flex-1 text-center rounded-xl bg-slate-800/80 hover:bg-slate-800 py-2 text-xs font-semibold text-slate-200 transition-colors"
                  >
                    Details
                  </Link>

                  {quest.status === 'Open' && (
                    <button
                      onClick={() => {
                        if (isConnected) setSubmitModalQuest(quest);
                        else setConnectModalOpen(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-2 text-xs font-semibold text-white shadow-md shadow-violet-600/20 hover:from-violet-500 hover:to-indigo-500 transition-all"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Submit PR</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredQuests.length === 0 && (
        <div className="text-center py-16 glass-panel rounded-3xl space-y-3">
          <Compass className="h-12 w-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">No quests found</h3>
          <p className="text-xs text-slate-500">Try adjusting your search query or filter criteria.</p>
        </div>
      )}

      {/* Review Queue Drawer for Sponsors / Reviewers */}
      {pendingReviews.length > 0 && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">Reviewer Submissions Queue</h3>
                <p className="text-xs text-slate-400">Submissions awaiting judging and automated escrow payout release</p>
              </div>
            </div>
            <span className="rounded-full bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 text-xs font-bold text-amber-400">
              {pendingReviews.length} Pending
            </span>
          </div>

          <div className="space-y-3">
            {pendingReviews.map((sub) => (
              <div
                key={sub.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-950/60"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-violet-400">Submission #{sub.id}</span>
                    <span className="text-xs text-slate-400">• Quest #{sub.questId}</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-200">{sub.questTitle || `Quest #${sub.questId}`}</p>
                  <p className="font-mono text-[11px] text-slate-400 break-all">Contributor: {sub.contributor}</p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <a
                    href={sub.submissionUri}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-cyan-400 hover:bg-slate-800"
                  >
                    <span>View PR</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <button
                    onClick={() => setReviewModalSubmission(sub)}
                    className="flex-1 sm:flex-initial rounded-lg bg-violet-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-violet-500 transition-colors"
                  >
                    Judge Submission
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
