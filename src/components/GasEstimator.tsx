'use client';

import React from 'react';
import { Cpu, Zap, Database, ShieldCheck, Gauge } from 'lucide-react';

interface GasEstimatorProps {
  operation: 'create_quest' | 'submit_work' | 'review_submission' | 'refund_quest';
  estimatedXlmFee?: string;
  cpuInstructions?: number;
  memoryBytes?: number;
}

export function GasEstimator({
  operation,
  estimatedXlmFee = '0.00001 XLM',
  cpuInstructions,
  memoryBytes,
}: GasEstimatorProps) {
  const getOpDefaults = () => {
    switch (operation) {
      case 'create_quest':
        return {
          cpu: cpuInstructions || 1_250_000,
          ram: memoryBytes || 45_000,
          entries: '2 read / 2 write',
          desc: 'Escrow lock + instance increment + event emission',
        };
      case 'submit_work':
        return {
          cpu: cpuInstructions || 820_000,
          ram: memoryBytes || 28_000,
          entries: '1 read / 2 write',
          desc: 'PR verification + quest submission append',
        };
      case 'review_submission':
        return {
          cpu: cpuInstructions || 2_150_000,
          ram: memoryBytes || 72_000,
          entries: '3 read / 3 write',
          desc: 'Direct SAC payout + Inter-contract reputation call',
        };
      case 'refund_quest':
        return {
          cpu: cpuInstructions || 950_000,
          ram: memoryBytes || 32_000,
          entries: '1 read / 2 write',
          desc: 'Timelock validation + Escrow balance refund',
        };
    }
  };

  const info = getOpDefaults();

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
          <Gauge className="h-4 w-4 text-violet-400" />
          <span>Soroban Gas & Resource Footprint</span>
        </div>
        <span className="font-mono text-xs font-bold text-emerald-400">{estimatedXlmFee}</span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-slate-900/80 p-2 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">CPU Instructions</span>
          <p className="font-mono text-xs font-bold text-slate-200 mt-0.5">
            {(info.cpu / 1_000_000).toFixed(2)}M
          </p>
        </div>

        <div className="rounded-xl bg-slate-900/80 p-2 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">RAM Footprint</span>
          <p className="font-mono text-xs font-bold text-slate-200 mt-0.5">
            {(info.ram / 1024).toFixed(1)} KB
          </p>
        </div>

        <div className="rounded-xl bg-slate-900/80 p-2 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Storage IO</span>
          <p className="font-mono text-[11px] font-bold text-slate-200 mt-0.5">{info.entries}</p>
        </div>
      </div>

      <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
        <span>{info.desc}</span>
      </p>
    </div>
  );
}
