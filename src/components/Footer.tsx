import React from 'react';
import { Flame, ShieldCheck, Github, ExternalLink, Cpu } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/60 backdrop-blur-md py-8 mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600/20 border border-violet-500/30 text-violet-400">
              <Flame className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">Quest & Rewards Platform</p>
              <p className="text-xs text-slate-500">Stellar Orange Belt (Level 3) • Soroban Smart Contracts</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5 rounded-full bg-slate-900 border border-slate-800 px-3 py-1 text-slate-300">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Inter-Contract Verified</span>
            </div>
            <a
              href="https://github.com/prerana-techi/Quest-Rewards-Platform"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-violet-400 transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </a>
            <a
              href="https://developers.stellar.org/docs/learn/smart-contract-internals"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
            >
              <Cpu className="h-4 w-4" />
              <span>Soroban Docs</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-900 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
          <p>© 2026 Quest & Rewards Network. Built on Stellar & Soroban.</p>
          <p className="mt-2 sm:mt-0 font-mono">Testnet Contracts: Core & Reputation Linked</p>
        </div>
      </div>
    </footer>
  );
}
