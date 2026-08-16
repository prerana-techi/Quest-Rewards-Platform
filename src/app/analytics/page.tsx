'use client';

import React from 'react';
import { useQuestStore } from '@/store/useQuestStore';
import { StatCard } from '@/components/StatCard';
import {
  BarChart3,
  TrendingUp,
  Award,
  Users,
  Coins,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { BadgeDisplay } from '@/components/BadgeDisplay';

export default function AnalyticsPage() {
  const { quests, submissions } = useQuestStore();

  const totalCompleted = quests.filter((q) => q.status === 'Completed').length;
  const totalVolume = quests.reduce((acc, q) => acc + q.formattedAmount * q.winnersCount, 0) + 42500;
  const totalSubmissions = submissions.length + 12;

  const mockLeaderboard = [
    {
      rank: 1,
      address: 'GBRP...OXR3',
      xp: 1450,
      level: 5,
      completed: 6,
      badges: 4,
      earned: '4,500 XLM',
      topBadge: 'Diamond' as const,
    },
    {
      rank: 2,
      address: 'GA7T...52BC',
      xp: 950,
      level: 4,
      completed: 4,
      badges: 3,
      earned: '2,800 XLM',
      topBadge: 'Platinum' as const,
    },
    {
      rank: 3,
      address: 'GCKQ...11DF',
      xp: 600,
      level: 4,
      completed: 3,
      badges: 2,
      earned: '1,750 XLM',
      topBadge: 'Gold' as const,
    },
    {
      rank: 4,
      address: 'GDV5...981A',
      xp: 350,
      level: 3,
      completed: 2,
      badges: 1,
      earned: '1,200 XLM',
      topBadge: 'Silver' as const,
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <BarChart3 className="h-7 w-7 text-violet-400" />
          <span>Protocol Analytics & Leaderboard</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Decentralized bounty volume, settlement velocity, and top on-chain contributors
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Escrow Settled"
          value={`${totalVolume.toLocaleString()} XLM`}
          subtitle="Direct SAC Transfers"
          icon={Coins}
          glow="purple"
        />
        <StatCard
          title="Verified Submissions"
          value={totalSubmissions}
          subtitle="Passed Peer Review"
          icon={CheckCircle2}
          glow="cyan"
        />
        <StatCard
          title="Active Contributors"
          value="84 Devs"
          subtitle="From 18 Countries"
          icon={Users}
          glow="emerald"
        />
        <StatCard
          title="Avg Settlement Time"
          value="< 4.2s"
          subtitle="Soroban Consensus"
          icon={TrendingUp}
          glow="amber"
        />
      </div>

      {/* Leaderboard Section */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Top Contributor Leaderboard</h3>
              <p className="text-xs text-slate-400">Ranked by on-chain Soroban XP and soulbound badge tiers</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">
            Season 1
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Rank</th>
                <th className="pb-3 font-semibold">Contributor</th>
                <th className="pb-3 font-semibold">Reputation Level</th>
                <th className="pb-3 font-semibold">Top Badge</th>
                <th className="pb-3 font-semibold">Completed</th>
                <th className="pb-3 font-semibold text-right">Total Earned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {mockLeaderboard.map((item) => (
                <tr key={item.rank} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4">
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full font-bold text-xs ${
                        item.rank === 1
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                          : item.rank === 2
                          ? 'bg-slate-300/20 text-slate-200 border border-slate-300/40'
                          : item.rank === 3
                          ? 'bg-amber-700/20 text-amber-500 border border-amber-700/40'
                          : 'text-slate-500'
                      }`}
                    >
                      {item.rank}
                    </span>
                  </td>
                  <td className="py-4 font-mono text-slate-200">{item.address}</td>
                  <td className="py-4">
                    <span className="rounded-md bg-violet-500/10 px-2 py-0.5 text-[11px] font-bold text-violet-300 border border-violet-500/20">
                      Level {item.level} ({item.xp} XP)
                    </span>
                  </td>
                  <td className="py-4">
                    <BadgeDisplay tier={item.topBadge} title="" size="sm" />
                  </td>
                  <td className="py-4 text-slate-300">{item.completed} Quests</td>
                  <td className="py-4 font-mono font-bold text-right text-emerald-400">{item.earned}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
