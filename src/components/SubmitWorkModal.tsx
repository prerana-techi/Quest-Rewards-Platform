'use client';

import React, { useState } from 'react';
import { useQuestStore } from '@/store/useQuestStore';
import { useWalletStore } from '@/store/useWalletStore';
import { useContract } from '@/hooks/useContract';
import { X, Send, GitPullRequest, AlertCircle, Link2, CheckCircle2 } from 'lucide-react';

export function SubmitWorkModal() {
  const { submitModalQuest, setSubmitModalQuest } = useQuestStore();
  const { isConnected, setConnectModalOpen } = useWalletStore();
  const { submitWork, isExecuting } = useContract();

  const [submissionUri, setSubmissionUri] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!submitModalQuest) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      setConnectModalOpen(true);
      return;
    }
    if (!submissionUri.trim()) {
      setError('Please provide a valid PR link or IPFS demonstration URL.');
      return;
    }

    setError(null);
    try {
      await submitWork(submitModalQuest.id, submitModalQuest.title, submissionUri.trim());
      setSubmissionUri('');
    } catch (err: any) {
      setError(err?.message || 'Submission failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <button
          onClick={() => setSubmitModalQuest(null)}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-600/20 border border-cyan-500/30 text-cyan-400">
            <GitPullRequest className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-100">Submit Work</h3>
            <p className="text-xs text-slate-400">Quest #{submitModalQuest.id}: {submitModalQuest.title}</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Locked Bounty Reward:</span>
              <span className="font-bold text-cyan-400">
                {submitModalQuest.formattedAmount} {submitModalQuest.tokenSymbol} + {submitModalQuest.xpReward} XP
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Badge Tier:</span>
              <span className="font-semibold text-amber-300">{submitModalQuest.badgeTier} Badge NFT</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Proof of Work Link (GitHub PR, Commit, or IPFS Demo)
            </label>
            <div className="relative">
              <Link2 className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="url"
                value={submissionUri}
                onChange={(e) => setSubmissionUri(e.target.value)}
                placeholder="https://github.com/stellar/.../pull/1"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                required
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setSubmitModalQuest(null)}
              className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isExecuting}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-600/30 hover:from-cyan-500 hover:to-teal-500 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              <span>{isExecuting ? 'Submitting...' : 'Submit Proof'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
