'use client';

import React, { useEffect } from 'react';
import { useFeedStore } from '@/store/useFeedStore';
import { DEFAULT_NETWORK_CONFIG } from '@/config/network';
import { SorobanEventType } from '@/types';
import {
  Activity,
  Radio,
  Coins,
  Send,
  Award,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Clock,
  Layers,
} from 'lucide-react';
import { BadgeDisplay } from '@/components/BadgeDisplay';

export default function ActivityFeedPage() {
  const { events, filterType, isLiveStreaming, loadInitialEvents, setFilterType, setIsLiveStreaming } =
    useFeedStore();

  useEffect(() => {
    loadInitialEvents();
  }, [loadInitialEvents]);

  const filteredEvents = events.filter((e) => {
    if (filterType === 'all') return true;
    return e.type === filterType;
  });

  const getEventIcon = (type: SorobanEventType) => {
    switch (type) {
      case 'q_payout':
        return { icon: Award, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
      case 'q_submit':
        return { icon: Send, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' };
      case 'q_review':
        return { icon: ShieldCheck, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
      case 'q_create':
      default:
        return { icon: Coins, color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' };
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Activity className="h-7 w-7 text-cyan-400" />
            <span>Real-Time Soroban Activity Feed</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Live on-chain event stream emitted by QuestCore and QuestReputation smart contracts
          </p>
        </div>

        {/* Live Stream Indicator Toggle */}
        <button
          onClick={() => setIsLiveStreaming(!isLiveStreaming)}
          className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold transition-all ${
            isLiveStreaming
              ? 'border-emerald-500/30 bg-emerald-950/40 text-emerald-300'
              : 'border-slate-800 bg-slate-900 text-slate-400'
          }`}
        >
          <span className={`h-2 w-2 rounded-full bg-emerald-400 ${isLiveStreaming ? 'animate-live-pulse' : ''}`} />
          <span>{isLiveStreaming ? 'Live Subscriptions Active' : 'Stream Paused'}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 glass-panel rounded-2xl p-2">
        {[
          { label: 'All Events', type: 'all' },
          { label: 'Quest Created', type: 'q_create' },
          { label: 'Work Submitted', type: 'q_submit' },
          { label: 'Judging & Reviews', type: 'q_review' },
          { label: 'Payouts & Badges', type: 'q_payout' },
        ].map((tab) => (
          <button
            key={tab.type}
            onClick={() => setFilterType(tab.type as any)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
              filterType === tab.type
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Events Timeline */}
      <div className="space-y-4">
        {filteredEvents.map((evt) => {
          const config = getEventIcon(evt.type);
          const IconComponent = config.icon;

          return (
            <div
              key={evt.id}
              className="glass-panel glass-panel-hover rounded-2xl p-5 relative overflow-hidden flex items-start gap-4"
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${config.color}`}>
                <IconComponent className="h-5 w-5" />
              </div>

              <div className="flex-1 space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-100">{evt.title}</h3>
                    <span className="font-mono text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                      Ledger #{evt.ledger}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(evt.timestamp * 1000).toLocaleTimeString()}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed break-words">{evt.description}</p>

                {evt.badgeTier && (
                  <div className="pt-1">
                    <BadgeDisplay tier={evt.badgeTier} title="" size="sm" />
                  </div>
                )}

                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 border-t border-slate-800/60">
                  <span className="font-mono truncate max-w-[200px] sm:max-w-xs">Actor: {evt.actor}</span>
                  <a
                    href={`${DEFAULT_NETWORK_CONFIG.explorerUrl}/tx/${evt.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-cyan-400 hover:underline"
                  >
                    <span>View on Stellar Expert</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
