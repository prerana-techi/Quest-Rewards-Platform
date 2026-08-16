'use client';

import React from 'react';
import Link from 'next/link';
import { useWalletStore } from '@/store/useWalletStore';
import { useQuestStore } from '@/store/useQuestStore';
import {
  Flame,
  ShieldCheck,
  Zap,
  Coins,
  ArrowRight,
  Sparkles,
  Lock,
  Layers,
  Award,
  CheckCircle2,
  Cpu,
  Users,
} from 'lucide-react';
import { BadgeDisplay } from '@/components/BadgeDisplay';

export default function LandingPage() {
  const { setConnectModalOpen, isConnected } = useWalletStore();
  const { setCreateModalOpen } = useQuestStore();

  return (
    <div className="space-y-24 py-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 text-center lg:py-24">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-violet-600/20 via-cyan-500/15 to-transparent blur-3xl -z-10 rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-950/40 px-4 py-1.5 text-xs font-semibold text-violet-300 backdrop-blur-md mb-8">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>Stellar Orange Belt (Level 3) • Dual Soroban Smart Contracts</span>
        </div>

        <h1 className="mx-auto max-w-4xl text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
          Trustless Bounties & Quests on{' '}
          <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
            Stellar Soroban
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed">
          Post quests, lock reward tokens into on-chain escrow, verify submissions transparently, and auto-release payouts with soulbound badge minting. No middlemen, no disputes.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-3.5 text-base font-bold text-white shadow-xl shadow-violet-600/30 hover:from-violet-500 hover:to-indigo-500 transition-all hover:scale-105"
          >
            <span>Explore Active Quests</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <button
            onClick={() => {
              if (isConnected) {
                setCreateModalOpen(true);
              } else {
                setConnectModalOpen(true);
              }
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/80 px-8 py-3.5 text-base font-semibold text-slate-200 hover:bg-slate-800 hover:border-violet-500/40 transition-all backdrop-blur-md"
          >
            <Coins className="h-4 w-4 text-amber-400" />
            <span>Post a Bounty</span>
          </button>
        </div>

        {/* Live Stats Ticker */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="glass-panel rounded-2xl p-4 text-left">
            <p className="text-xs text-slate-400 font-medium">Total Escrow Volume</p>
            <p className="text-2xl font-black text-white mt-1">42,500 XLM</p>
            <p className="text-[11px] text-emerald-400 mt-0.5">100% on-chain locked</p>
          </div>
          <div className="glass-panel rounded-2xl p-4 text-left">
            <p className="text-xs text-slate-400 font-medium">Settlement Speed</p>
            <p className="text-2xl font-black text-cyan-300 mt-1">&lt; 4.2s</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Instant Soroban finalize</p>
          </div>
          <div className="glass-panel rounded-2xl p-4 text-left">
            <p className="text-xs text-slate-400 font-medium">Badges Minted</p>
            <p className="text-2xl font-black text-violet-300 mt-1">128 NFTs</p>
            <p className="text-[11px] text-violet-400 mt-0.5">Inter-contract linked</p>
          </div>
          <div className="glass-panel rounded-2xl p-4 text-left">
            <p className="text-xs text-slate-400 font-medium">Protocol Security</p>
            <p className="text-2xl font-black text-emerald-300 mt-1">RBAC + TTL</p>
            <p className="text-[11px] text-emerald-400 mt-0.5">Automated refund timelocks</p>
          </div>
        </div>
      </section>

      {/* Orange Belt Architecture Pillars */}
      <section className="space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Production-Ready Soroban Architecture
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Engineered with dual smart contracts, inter-contract client communication, multi-wallet signing, and real-time event streaming.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="glass-panel glass-panel-hover rounded-3xl p-7 space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600/20 border border-violet-500/30 text-violet-400">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Trustless Escrow Vault</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              The <code className="text-violet-300">quest_core</code> contract holds SAC/token rewards non-custodially. If a deadline expires without completion, sponsors can reclaim remaining funds seamlessly.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-violet-400">
              <ShieldCheck className="h-4 w-4" />
              <span>Token Client Automated Transfers</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-panel glass-panel-hover rounded-3xl p-7 space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-600/20 border border-cyan-500/30 text-cyan-400">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Inter-Contract Reputation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upon approving work, <code className="text-cyan-300">quest_core</code> performs an authorized cross-contract call to <code className="text-cyan-300">quest_reputation</code>, awarding XP and minting soulbound badges.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-cyan-400">
              <Sparkles className="h-4 w-4" />
              <span>Non-Transferable On-Chain Badges</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-panel glass-panel-hover rounded-3xl p-7 space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Real-Time Event Stream</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Soroban events (<code className="text-emerald-300">q_create</code>, <code className="text-emerald-300">q_submit</code>, <code className="text-emerald-300">q_payout</code>) are published on-chain and streamed live to the activity feed with optimistic UI updates.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <Cpu className="h-4 w-4" />
              <span>Live Ledger Sync & Polling</span>
            </div>
          </div>
        </div>
      </section>

      {/* Soulbound Achievement Badge Preview */}
      <section className="glass-panel rounded-3xl p-8 sm:p-12 space-y-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-lg bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-xs font-semibold text-amber-400">
              <Award className="h-3.5 w-3.5" />
              <span>Soulbound Credentials</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-100">Earn On-Chain Developer Tiers</h3>
            <p className="text-xs text-slate-400 max-w-lg">
              Every solved challenge automatically updates your decentralized developer resume with verifiable achievements.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors"
          >
            <span>View All Bounties</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <BadgeDisplay tier="Bronze" title="First Soroban PR" xp={100} />
          <BadgeDisplay tier="Silver" title="Escrow Contract Module" xp={150} />
          <BadgeDisplay tier="Gold" title="Core Protocol Auditor" xp={250} />
          <BadgeDisplay tier="Diamond" title="Hackathon Grand Champion" xp={500} />
        </div>
      </section>

      {/* How it Works / Workflow */}
      <section className="space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            How The Trustless Bounty Flow Works
          </h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            From initial challenge creation to auto-payout in 4 transparent on-chain steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Sponsor Posts Bounty',
              desc: 'Sponsor selects token, specifies deliverables, and locks reward funds into the Soroban escrow contract.',
            },
            {
              step: '02',
              title: 'Contributors Build',
              desc: 'Developers submit pull requests, demo URLs, or verifiable artifacts before the deadline.',
            },
            {
              step: '03',
              title: 'Reviewer Judges',
              desc: 'Whitelisted reviewers or sponsors evaluate submissions on-chain via the evaluation console.',
            },
            {
              step: '04',
              title: 'Payout & Badge Mint',
              desc: 'Contract releases escrow funds directly to the winner while inter-contract logic mints reputation badges.',
            },
          ].map((item) => (
            <div key={item.step} className="glass-panel rounded-2xl p-6 relative">
              <span className="font-mono text-3xl font-black text-violet-500/30">{item.step}</span>
              <h4 className="text-base font-bold text-slate-100 mt-2 mb-1">{item.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
