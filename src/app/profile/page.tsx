'use client';

import React from 'react';
import { useWalletStore } from '@/store/useWalletStore';
import { useReputation } from '@/hooks/useReputation';
import { useQuestStore } from '@/store/useQuestStore';
import { BadgeDisplay } from '@/components/BadgeDisplay';
import { StatCard } from '@/components/StatCard';
import {
  Award,
  ShieldCheck,
  Coins,
  CheckCircle2,
  ExternalLink,
  Copy,
  Sparkles,
  Layers,
  Flame,
  ArrowRight,
} from 'lucide-react';

export default function ProfilePage() {
  const { address, isConnected, setConnectModalOpen } = useWalletStore();
  const { profile, badges } = useReputation();
  const { submissions } = useQuestStore();

  const mySubmissions = submissions.filter((s) => s.contributor === address);
  const [copied, setCopied] = React.useState(false);

  const copyProfileLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isConnected || !address) {
    return (
      <div className="text-center py-24 glass-panel rounded-3xl space-y-4 max-w-lg mx-auto">
        <Award className="h-12 w-12 text-violet-400 mx-auto animate-pulse" />
        <h2 className="text-2xl font-bold text-slate-100">Connect Your Wallet</h2>
        <p className="text-xs text-slate-400">
          Connect your Stellar wallet to view your soulbound reputation score, level progression, and earned achievement badges.
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

  // Calculate XP progress to next level
  const getNextLevelXp = (level: number) => {
    if (level === 1) return 100;
    if (level === 2) return 250;
    if (level === 3) return 500;
    if (level === 4) return 1000;
    return 2000;
  };

  const nextLevelXp = getNextLevelXp(profile.level);
  const progressPercent = Math.min(100, Math.round((profile.xp / nextLevelXp) * 100));

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Profile Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-500 shadow-xl text-white font-black text-2xl">
              L{profile.level}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white">Contributor Profile</h1>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                  Verified On-Chain
                </span>
              </div>
              <p className="font-mono text-xs text-slate-400 mt-1 break-all">{address}</p>
            </div>
          </div>

          <button
            onClick={copyProfileLink}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
          >
            <Copy className="h-3.5 w-3.5" />
            <span>{copied ? 'Link Copied!' : 'Share Portfolio'}</span>
          </button>
        </div>

        {/* XP Progression Bar */}
        <div className="space-y-2 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-semibold">
              Level {profile.level} Progression
            </span>
            <span className="font-mono text-violet-400 font-bold">
              {profile.xp} / {nextLevelXp} XP ({progressPercent}%)
            </span>
          </div>
          <div className="h-3 w-full rounded-full bg-slate-950 overflow-hidden border border-slate-800 p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Bounties Won"
          value={profile.questsCompleted}
          subtitle="Verified Submissions"
          icon={CheckCircle2}
          glow="emerald"
        />
        <StatCard
          title="Total Tokens Earned"
          value={`${profile.formattedTotalEarned.toLocaleString()} XLM`}
          subtitle="Direct SAC Escrow Payouts"
          icon={Coins}
          glow="cyan"
        />
        <StatCard
          title="Soulbound Badges"
          value={badges.length}
          subtitle="Non-Transferable NFTs"
          icon={Award}
          glow="purple"
        />
      </div>

      {/* Badges Showcase */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Earned Achievement Badges</h3>
              <p className="text-xs text-slate-400">Soulbound NFT credentials minted by QuestReputation</p>
            </div>
          </div>
        </div>

        {badges.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl text-xs text-slate-500">
            No badges earned yet. Submit work for open bounties to mint your first credential!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((badge, i) => (
              <BadgeDisplay
                key={i}
                tier={badge.tier}
                title={badge.questTitle || `Quest #${badge.questId}`}
                earnedAt={badge.earnedAt}
              />
            ))}
          </div>
        )}
      </div>

      {/* Verified Work History */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Layers className="h-4 w-4 text-violet-400" />
          <span>Verified Submission History ({mySubmissions.length})</span>
        </h3>

        {mySubmissions.length === 0 ? (
          <p className="text-xs text-slate-500">No submissions recorded for this account.</p>
        ) : (
          <div className="space-y-3">
            {mySubmissions.map((sub) => (
              <div
                key={sub.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-800 bg-slate-950/50"
              >
                <div className="space-y-1">
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
                  <p className="text-xs text-slate-300 font-semibold">{sub.questTitle || `Quest #${sub.questId}`}</p>
                  {sub.feedback && (
                    <p className="text-[11px] text-slate-400 italic">&ldquo;{sub.feedback}&rdquo;</p>
                  )}
                </div>

                <a
                  href={sub.submissionUri}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs text-cyan-400 hover:underline"
                >
                  <span>View Proof</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
