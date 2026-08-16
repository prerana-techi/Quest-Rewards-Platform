'use client';

import React, { useState } from 'react';
import { useQuestStore } from '@/store/useQuestStore';
import { useWalletStore } from '@/store/useWalletStore';
import { useContract } from '@/hooks/useContract';
import { X, CheckCircle2, XCircle, AlertCircle, ExternalLink, ShieldCheck, Award } from 'lucide-react';

export function ReviewSubmissionModal() {
  const { reviewModalSubmission, setReviewModalSubmission, quests } = useQuestStore();
  const { isConnected, setConnectModalOpen } = useWalletStore();
  const { reviewSubmission, isExecuting } = useContract();

  const [approve, setApprove] = useState<boolean>(true);
  const [feedback, setFeedback] = useState('Code passes all unit tests, meets gas constraints, and implements clean storage architecture.');
  const [error, setError] = useState<string | null>(null);

  if (!reviewModalSubmission) return null;

  const quest = quests.find((q) => q.id === reviewModalSubmission.questId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      setConnectModalOpen(true);
      return;
    }
    if (!quest) return;

    setError(null);
    try {
      await reviewSubmission(
        reviewModalSubmission.id,
        quest.id,
        quest.title,
        reviewModalSubmission.contributor,
        approve,
        feedback,
        quest.formattedAmount,
        quest.tokenSymbol,
        quest.badgeTier,
        quest.xpReward
      );
    } catch (err: any) {
      setError(err?.message || 'Review execution failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <button
          onClick={() => setReviewModalSubmission(null)}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-100">Review & Judge Submission</h3>
            <p className="text-xs text-slate-400">Submission #{reviewModalSubmission.id} • Quest #{reviewModalSubmission.questId}</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2.5">
            <div>
              <span className="text-[11px] text-slate-400">Contributor:</span>
              <p className="font-mono text-xs text-slate-200 break-all">{reviewModalSubmission.contributor}</p>
            </div>
            <div>
              <span className="text-[11px] text-slate-400">Proof of Work:</span>
              <a
                href={reviewModalSubmission.submissionUri}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs text-cyan-400 hover:underline break-all"
              >
                <span>{reviewModalSubmission.submissionUri}</span>
                <ExternalLink className="h-3 w-3 shrink-0" />
              </a>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Verdict</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setApprove(true)}
                className={`flex items-center justify-center gap-2 rounded-xl p-3 text-sm font-semibold border transition-all ${
                  approve
                    ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 shadow-md shadow-emerald-950/50'
                    : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:bg-slate-800/40'
                }`}
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Approve Payout</span>
              </button>

              <button
                type="button"
                onClick={() => setApprove(false)}
                className={`flex items-center justify-center gap-2 rounded-xl p-3 text-sm font-semibold border transition-all ${
                  !approve
                    ? 'border-rose-500 bg-rose-950/40 text-rose-300 shadow-md shadow-rose-950/50'
                    : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:bg-slate-800/40'
                }`}
              >
                <XCircle className="h-4 w-4 text-rose-400" />
                <span>Reject</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Reviewer Feedback & Notes</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
              placeholder="Provide technical evaluation details..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-violet-500 focus:outline-none"
              required
            />
          </div>

          {approve && quest && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3.5 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                <Award className="h-4 w-4" />
                <span>Auto-Release Escrow & Inter-Contract Trigger</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Approving this submission will instantly transfer <strong className="text-white">{quest.formattedAmount} {quest.tokenSymbol}</strong> from escrow to the contributor and invoke <code className="text-emerald-300">quest_reputation</code> to award {quest.xpReward} XP and mint a {quest.badgeTier} badge.
              </p>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setReviewModalSubmission(null)}
              className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isExecuting}
              className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.02] disabled:opacity-50 ${
                approve
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-600/30 hover:from-emerald-500 hover:to-teal-500'
                  : 'bg-gradient-to-r from-rose-600 to-red-600 shadow-rose-600/30 hover:from-rose-500 hover:to-red-500'
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{isExecuting ? 'Processing On-Chain...' : approve ? 'Confirm & Release Payout' : 'Reject Submission'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
