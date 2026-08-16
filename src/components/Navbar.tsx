'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWallet } from '@/hooks/useWallet';
import { useTransactionStore } from '@/store/useTransactionStore';
import { useFeedStore } from '@/store/useFeedStore';
import {
  Compass,
  Activity,
  Flame,
  BarChart3,
  Settings,
  Wallet,
  Coins,
  ChevronDown,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { address, isConnected, balance, network, setConnectModalOpen, disconnect, truncateAddress } = useWallet();
  const { activeTxId } = useTransactionStore();
  const { pulseCount } = useFeedStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: Compass },
    { name: 'Activity', href: '/activity', icon: Activity, badge: pulseCount > 0 ? pulseCount : undefined },
    { name: 'Transactions', href: '/transactions', icon: Layers, isPulse: !!activeTxId },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform">
              <Flame className="h-5 w-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  QuestRewards
                </span>
                <span className="rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-400 border border-amber-500/20">
                  SOROBAN
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Trustless Escrow Bounties</p>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? 'text-white bg-slate-800/80 shadow-sm border border-slate-700/50'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-violet-400' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="ml-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-cyan-500 px-1 text-[10px] font-bold text-slate-950 animate-pulse">
                      {item.badge}
                    </span>
                  )}
                  {item.isPulse && (
                    <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-3">
          {/* Network Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-950/30 px-3 py-1 text-xs font-medium text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-live-pulse" />
            <span className="capitalize">{network}</span>
          </div>

          {/* Wallet Button */}
          {isConnected && address ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 rounded-xl border border-slate-700/80 bg-slate-900/90 px-3.5 py-1.5 text-sm font-medium text-slate-200 hover:border-violet-500/40 hover:bg-slate-800/80 transition-all shadow-sm"
              >
                <div className="flex items-center gap-1.5">
                  <Coins className="h-3.5 w-3.5 text-amber-400" />
                  <span className="text-xs font-semibold text-slate-300">
                    {parseFloat(balance).toFixed(2)} XLM
                  </span>
                </div>
                <div className="h-3 w-px bg-slate-700" />
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-violet-400" />
                  <span>{truncateAddress(address)}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </div>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-800 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-xl z-50">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="text-[11px] text-slate-400">Connected Account</p>
                    <p className="font-mono text-xs text-slate-200 break-all">{truncateAddress(address, 8, 8)}</p>
                  </div>
                  <div className="py-1">
                    <a
                      href={`https://stellar.expert/explorer/testnet/account/${address}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between px-3 py-2 text-xs text-slate-300 hover:bg-slate-800/60 rounded-lg"
                    >
                      <span>Stellar Expert</span>
                      <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                    </a>
                  </div>
                  <div className="border-t border-slate-800 pt-1">
                    <button
                      onClick={() => {
                        disconnect();
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    >
                      Disconnect Wallet
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setConnectModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 hover:from-violet-500 hover:to-indigo-500 transition-all hover:scale-[1.02]"
            >
              <Wallet className="h-4 w-4" />
              <span>Connect Wallet</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
