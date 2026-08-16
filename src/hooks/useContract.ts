'use client';

import { useState } from 'react';
import { useWalletStore } from '@/store/useWalletStore';
import { useTransactionStore } from '@/store/useTransactionStore';
import { useQuestStore } from '@/store/useQuestStore';
import { useFeedStore } from '@/store/useFeedStore';
import { Quest, Submission, BadgeTierType } from '@/types';
import { DEFAULT_NETWORK_CONFIG } from '@/config/network';
import confetti from 'canvas-confetti';

export function useContract() {
  const { address, isConnected } = useWalletStore();
  const { addTransaction, updateStatus, setRetryAction } = useTransactionStore();
  const { createQuestOptimistic, submitWorkOptimistic, reviewWorkOptimistic } = useQuestStore();
  const { addEvent } = useFeedStore();
  const [isExecuting, setIsExecuting] = useState(false);

  /**
   * Sponsor Creates Quest with Escrow Locked
   */
  const createQuest = async (params: {
    title: string;
    description: string;
    rewardToken: string;
    tokenSymbol: string;
    rewardAmount: number;
    xpReward: number;
    badgeTier: BadgeTierType;
    deadlineDays: number;
    maxWinners: number;
    tags: string[];
    repoUrl?: string;
  }) => {
    if (!address || !isConnected) throw new Error('Please connect your Stellar wallet first.');

    setIsExecuting(true);
    const txId = addTransaction({
      type: 'create_quest',
      title: 'Create Quest & Lock Escrow',
      description: `Posting "${params.title}" with ${params.rewardAmount} ${params.tokenSymbol} reward escrow`,
    });

    const execute = async () => {
      try {
        // Step 1: Signing
        updateStatus(txId, 'signing');
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Step 2: Submitting to Stellar/Soroban Testnet
        updateStatus(txId, 'submitting');
        await new Promise((resolve) => setTimeout(resolve, 1400));

        // Mock/Simulated Tx Hash (or real testnet hash)
        const mockHash = `${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
        const newQuestId = Math.floor(Math.random() * 9000) + 1000;
        const now = Math.floor(Date.now() / 1000);

        const newQuest: Quest = {
          id: newQuestId,
          title: params.title,
          description: params.description,
          sponsor: address,
          rewardToken: params.rewardToken,
          tokenSymbol: params.tokenSymbol,
          rewardAmount: `${params.rewardAmount * 10_000_000}`,
          formattedAmount: params.rewardAmount,
          xpReward: params.xpReward,
          badgeTier: params.badgeTier,
          badgeTierId: params.badgeTier === 'Diamond' ? 5 : params.badgeTier === 'Platinum' ? 4 : params.badgeTier === 'Gold' ? 3 : params.badgeTier === 'Silver' ? 2 : 1,
          deadline: now + params.deadlineDays * 86400,
          status: 'Open',
          maxWinners: params.maxWinners,
          winnersCount: 0,
          createdAt: now,
          tags: params.tags,
          repoUrl: params.repoUrl,
          metadataUri: `ipfs://bafybei${Math.random().toString(36).substr(2, 8)}`,
          submissionsCount: 0,
        };

        // Update local & optimistic store
        createQuestOptimistic(newQuest);

        // Add live stream event
        addEvent({
          id: `evt-${Date.now()}`,
          type: 'q_create',
          contractId: DEFAULT_NETWORK_CONFIG.questCoreContractId,
          ledger: 5422000 + Math.floor(Math.random() * 100),
          timestamp: now,
          txHash: mockHash,
          title: 'New Quest Created',
          description: `Sponsor ${address.slice(0, 4)}...${address.slice(-4)} created Quest #${newQuestId} with ${params.rewardAmount} ${params.tokenSymbol}`,
          actor: address,
          amount: `${params.rewardAmount} ${params.tokenSymbol}`,
          tokenSymbol: params.tokenSymbol,
        });

        // Step 3: Confirmed
        updateStatus(txId, 'confirmed', mockHash, undefined, '0.00001 XLM');
      } catch (err: any) {
        updateStatus(txId, 'failed', undefined, err?.message || 'Transaction submission failed.');
        setRetryAction(txId, execute);
        throw err;
      } finally {
        setIsExecuting(false);
      }
    };

    return execute();
  };

  /**
   * Contributor Submits Work
   */
  const submitWork = async (questId: number, questTitle: string, submissionUri: string) => {
    if (!address || !isConnected) throw new Error('Please connect your Stellar wallet first.');

    setIsExecuting(true);
    const txId = addTransaction({
      type: 'submit_work',
      title: 'Submit Proof of Work',
      description: `Submitting proof for Quest #${questId}`,
    });

    const execute = async () => {
      try {
        updateStatus(txId, 'signing');
        await new Promise((resolve) => setTimeout(resolve, 800));

        updateStatus(txId, 'submitting');
        await new Promise((resolve) => setTimeout(resolve, 1400));

        const mockHash = `${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
        const newSubId = Math.floor(Math.random() * 9000) + 1000;
        const now = Math.floor(Date.now() / 1000);

        const newSub: Submission = {
          id: newSubId,
          questId,
          questTitle,
          contributor: address,
          submissionUri,
          submittedAt: now,
          status: 'Pending',
          feedback: '',
          reviewedAt: 0,
        };

        submitWorkOptimistic(newSub);

        addEvent({
          id: `evt-${Date.now()}`,
          type: 'q_submit',
          contractId: DEFAULT_NETWORK_CONFIG.questCoreContractId,
          ledger: 5422100 + Math.floor(Math.random() * 100),
          timestamp: now,
          txHash: mockHash,
          title: 'Work Submitted',
          description: `Contributor ${address.slice(0, 4)}...${address.slice(-4)} submitted PR for Quest #${questId}`,
          actor: address,
        });

        updateStatus(txId, 'confirmed', mockHash, undefined, '0.00001 XLM');
      } catch (err: any) {
        updateStatus(txId, 'failed', undefined, err?.message || 'Submission failed.');
        setRetryAction(txId, execute);
        throw err;
      } finally {
        setIsExecuting(false);
      }
    };

    return execute();
  };

  /**
   * Sponsor or Reviewer Approves/Rejects Submission
   */
  const reviewSubmission = async (
    submissionId: number,
    questId: number,
    questTitle: string,
    contributor: string,
    approve: boolean,
    feedback: string,
    rewardAmount: number,
    tokenSymbol: string,
    badgeTier: BadgeTierType,
    xpReward: number
  ) => {
    if (!address || !isConnected) throw new Error('Please connect your Stellar wallet first.');

    setIsExecuting(true);
    const txId = addTransaction({
      type: 'review_submission',
      title: approve ? 'Approve & Release Payout' : 'Reject Submission',
      description: approve
        ? `Releasing ${rewardAmount} ${tokenSymbol} to ${contributor.slice(0, 4)}... and minting ${badgeTier} Badge`
        : `Marking submission #${submissionId} as rejected`,
    });

    const execute = async () => {
      try {
        updateStatus(txId, 'signing');
        await new Promise((resolve) => setTimeout(resolve, 800));

        updateStatus(txId, 'submitting');
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const mockHash = `${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
        const now = Math.floor(Date.now() / 1000);

        reviewWorkOptimistic(submissionId, approve, feedback);

        if (approve) {
          // Trigger confetti animation for milestone achievement!
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
            });
          } catch {}

          addEvent({
            id: `evt-${Date.now()}`,
            type: 'q_payout',
            contractId: DEFAULT_NETWORK_CONFIG.questCoreContractId,
            ledger: 5422200 + Math.floor(Math.random() * 100),
            timestamp: now,
            txHash: mockHash,
            title: 'Reward Released & Badge Minted',
            description: `${rewardAmount} ${tokenSymbol} paid out to ${contributor.slice(0, 4)}... and awarded ${badgeTier} Badge (${xpReward} XP)`,
            actor: contributor,
            amount: `${rewardAmount} ${tokenSymbol}`,
            tokenSymbol,
            xp: xpReward,
            badgeTier,
          });
        } else {
          addEvent({
            id: `evt-${Date.now()}`,
            type: 'q_review',
            contractId: DEFAULT_NETWORK_CONFIG.questCoreContractId,
            ledger: 5422200 + Math.floor(Math.random() * 100),
            timestamp: now,
            txHash: mockHash,
            title: 'Submission Reviewed',
            description: `Reviewer evaluated submission #${submissionId}: Rejected`,
            actor: address,
          });
        }

        updateStatus(txId, 'confirmed', mockHash, undefined, '0.00002 XLM');
      } catch (err: any) {
        updateStatus(txId, 'failed', undefined, err?.message || 'Review transaction failed.');
        setRetryAction(txId, execute);
        throw err;
      } finally {
        setIsExecuting(false);
      }
    };

    return execute();
  };

  return {
    createQuest,
    submitWork,
    reviewSubmission,
    isExecuting,
  };
}
