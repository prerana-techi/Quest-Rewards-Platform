import React from 'react';
import { BadgeTierType } from '@/types';
import { Award, Shield, Sparkles, Diamond, Zap } from 'lucide-react';

interface BadgeDisplayProps {
  tier: BadgeTierType;
  title: string;
  earnedAt?: number;
  xp?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function BadgeDisplay({ tier, title, earnedAt, xp, size = 'md' }: BadgeDisplayProps) {
  const getTierStyles = () => {
    switch (tier) {
      case 'Diamond':
        return {
          border: 'border-cyan-400/60 bg-gradient-to-br from-cyan-950/80 via-slate-900 to-blue-950/80',
          glow: 'badge-glow-diamond',
          text: 'text-cyan-300',
          icon: Diamond,
          color: 'from-cyan-400 to-blue-500',
        };
      case 'Platinum':
        return {
          border: 'border-indigo-400/60 bg-gradient-to-br from-indigo-950/80 via-slate-900 to-purple-950/80',
          glow: 'badge-glow-platinum',
          text: 'text-indigo-300',
          icon: Sparkles,
          color: 'from-indigo-400 to-purple-500',
        };
      case 'Gold':
        return {
          border: 'border-amber-400/60 bg-gradient-to-br from-amber-950/80 via-slate-900 to-yellow-950/80',
          glow: 'badge-glow-gold',
          text: 'text-amber-300',
          icon: Award,
          color: 'from-amber-400 to-yellow-500',
        };
      case 'Silver':
        return {
          border: 'border-slate-400/50 bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-900',
          glow: 'badge-glow-silver',
          text: 'text-slate-300',
          icon: Shield,
          color: 'from-slate-300 to-slate-500',
        };
      default:
        return {
          border: 'border-amber-700/50 bg-gradient-to-br from-amber-950/60 via-slate-950 to-amber-950/40',
          glow: 'badge-glow-bronze',
          text: 'text-amber-500',
          icon: Zap,
          color: 'from-amber-600 to-orange-700',
        };
    }
  };

  const config = getTierStyles();
  const IconComponent = config.icon;

  if (size === 'sm') {
    return (
      <div className={`inline-flex items-center gap-1.5 rounded-lg border px-2 py-0.5 text-xs font-semibold ${config.border} ${config.text}`}>
        <IconComponent className="h-3 w-3" />
        <span>{tier}</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl border p-4 transition-all hover:scale-[1.03] ${config.border} ${config.glow}`}>
      <div className="flex items-start gap-3">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr ${config.color} shadow-lg text-slate-950`}>
          <IconComponent className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold uppercase tracking-wider ${config.text}`}>{tier} Badge</span>
            {xp && (
              <span className="rounded bg-violet-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-violet-400 border border-violet-500/20">
                +{xp} XP
              </span>
            )}
          </div>
          <h4 className="text-sm font-semibold text-slate-100 line-clamp-1">{title}</h4>
          {earnedAt && (
            <p className="text-[11px] text-slate-400">
              Minted: {new Date(earnedAt * 1000).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
