'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useQuestStore } from '@/store/useQuestStore';
import { useWalletStore } from '@/store/useWalletStore';
import { BadgeDisplay } from '@/components/BadgeDisplay';
import { DEFAULT_NETWORK_CONFIG } from '@/config/network';
import {
  ArrowLeft,
  Coins,
  Clock,
  Send,
  GitPullRequest,
  ShieldCheck,
  ExternalLink,
  Award,
  Lock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileCode,
  Github,
} from 'lucide-react';

export default function QuestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const questId = Number(resolvedParams.id);

  const { quests, submissions, setSubmitModalQuest, setReviewModalSubmission } = useQuestStore();
  const { address, isConnected, setConnectModalOpen } = useWalletStore();

  const quest = quests.find((q) => q.id === questId);
  const questSubmissions = submissions.filter((s) => s.questId === questId);

  if (!quest) {
    return (
      <div className="text-center py-24 glass-panel rounded-3xl space-y-4">
        <AlertCircle className="h-12 w-12 text-amber-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-200">Quest Not Found</h2>
        <p className="text-xs text-slate-400">The quest you are looking for does not exist or has been removed.</p>
        <Link href="/dashboard" className="inline-block rounded-xl bg-violet-600 px-6 py-2.5 text-xs font-semibold text-white">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const isExpired = Date.now() / 1000 > quest.deadline;
  const remainingDays = Math.max(0, Math.ceil((quest.deadline - Date.now() / 1000) / 86400));
  const isSponsor = address && quest.sponsor.toLowerCase() === address.toLowerCase();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Back button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Quest Explorer</span>
      </Link>

      {/* Hero Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-mono font-bold text-violet-400">Quest #{quest.id}</span>
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
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              {quest.title}
            </h1>
            <p className="text-xs text-slate-400 font-mono">Sponsor: {quest.sponsor}</p>
          </div>

          <div className="flex items-center gap-3">
            {quest.status === 'Open' && (
              <button
                onClick={() => {
                  if (isConnected) setSubmitModalQuest(quest);
                  else setConnectModalOpen(true);
                }}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 hover:from-violet-500 hover:to-indigo-500 transition-all hover:scale-105"
              >
                <Send className="h-4 w-4" />
                <span>Submit Proof of Work</span>
              </button>
            )}
          </div>
        </div>

        {/* Highlight Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-500">Reward Payout</span>
            <p className="font-mono text-xl font-extrabold text-white">
              {quest.formattedAmount} {quest.tokenSymbol}
            </p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-500">Reputation XP</span>
            <p className="text-xl font-extrabold text-violet-400">+{quest.xpReward} XP</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-500">Badge Tier</span>
            <p className="text-sm font-bold text-amber-300 mt-1">{quest.badgeTier} NFT</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-500">Time Remaining</span>
            <p className="text-sm font-semibold text-slate-200 mt-1">
              {isExpired ? 'Expired' : `${remainingDays} Days`}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Specification Body */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <FileCode className="h-4 w-4 text-violet-400" />
              <span>Challenge Specification</span>
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{quest.description}</p>

            {quest.repoUrl && (
              <div className="pt-2">
                <a
                  href={quest.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 px-4 py-2 text-xs font-semibold text-cyan-400 hover:bg-slate-800 transition-colors"
                >
                  <Github className="h-4 w-4" />
                  <span>View GitHub Repository / Issue</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}

            <div className="pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Technologies & Topics</h4>
              <div className="flex flex-wrap gap-2">
                {quest.tags?.map((t) => (
                  <span
                    key={t}
                    className="rounded-lg bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-200 border border-slate-700/50"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Submissions Section */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <GitPullRequest className="h-4 w-4 text-cyan-400" />
                <span>Submissions ({questSubmissions.length})</span>
              </h3>
            </div>

            {questSubmissions.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                No submissions yet. Be the first contributor to claim this bounty!
              </div>
            ) : (
              <div className="space-y-3">
                {questSubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="rounded-2xl border border-slate-800/80 bg-slate-950/50 p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-300">
                          Submission #{sub.id}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                            sub.status === 'Approved'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : sub.status === 'Pending'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {sub.status}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {new Date(sub.submittedAt * 1000).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="text-xs space-y-1">
                      <p className="text-slate-400 font-mono break-all">Contributor: {sub.contributor}</p>
                      <a
                        href={sub.submissionUri}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-cyan-400 hover:underline break-all"
                      >
                        <span>{sub.submissionUri}</span>
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>
                    </div>

                    {sub.feedback && (
                      <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-3 text-xs text-slate-300">
                        <span className="font-semibold text-violet-400">Reviewer Note:</span> {sub.feedback}
                      </div>
                    )}

                    {sub.status === 'Pending' && (
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => setReviewModalSubmission(sub)}
                          className="rounded-lg bg-violet-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-violet-500"
                        >
                          Judge Submission
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar info */}
        <div className="space-y-6">
          {/* Badge NFT Preview */}
          <div className="glass-panel rounded-3xl p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-400" />
              <span>Soulbound Credential</span>
            </h3>
            <BadgeDisplay tier={quest.badgeTier} title={quest.title} xp={quest.xpReward} />
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Upon approval, the <code className="text-violet-300">quest_reputation</code> contract will mint this badge non-transferably to your account.
            </p>
          </div>

          {/* On-Chain Escrow Security Inspector */}
          <div className="glass-panel rounded-3xl p-6 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Lock className="h-4 w-4 text-emerald-400" />
              <span>Escrow Security Details</span>
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Core Contract:</span>
                <span className="font-mono text-slate-200 text-[10px]">
                  {DEFAULT_NETWORK_CONFIG.questCoreContractId.slice(0, 8)}...
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Locked Vault:</span>
                <span className="font-semibold text-emerald-400">
                  {quest.formattedAmount * (quest.maxWinners - quest.winnersCount)} {quest.tokenSymbol}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Settlement Type:</span>
                <span className="text-slate-200">Trustless Direct SAC</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
