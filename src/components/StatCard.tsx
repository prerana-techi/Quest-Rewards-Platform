import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  glow?: 'purple' | 'cyan' | 'emerald' | 'amber';
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, glow = 'purple' }: StatCardProps) {
  const getGlowClass = () => {
    switch (glow) {
      case 'cyan':
        return 'glass-glow-cyan border-cyan-500/20 text-cyan-400 bg-cyan-500/10';
      case 'emerald':
        return 'glass-glow-emerald border-emerald-500/20 text-emerald-400 bg-emerald-500/10';
      case 'amber':
        return 'border-amber-500/20 text-amber-400 bg-amber-500/10';
      default:
        return 'glass-glow-purple border-violet-500/20 text-violet-400 bg-violet-500/10';
    }
  };

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">{value}</p>
          {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${getGlowClass()}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
}
