import { describe, it, expect } from 'vitest';
import { questStorage } from '@/services/questStorage';
import { Quest, Submission } from '@/types';

describe('End-to-End Quest & Reputation Integration Flow', () => {
  it('should execute full bounty creation, submission, judging, and badge minting flow', () => {
    const sponsorAddr = 'GSPONSOR123456789';
    const contributorAddr = 'GCONTRIBUTOR987654321';

    // 1. Sponsor creates quest
    const newQuest: Quest = {
      id: 501,
      title: 'Soroban Gas Optimizer',
      description: 'Optimize WASM gas consumption',
      sponsor: sponsorAddr,
      rewardToken: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC',
      tokenSymbol: 'XLM',
      rewardAmount: '15000000000',
      formattedAmount: 1500,
      xpReward: 350,
      badgeTier: 'Platinum',
      badgeTierId: 4,
      deadline: Math.floor(Date.now() / 1000) + 86400 * 5,
      status: 'Open',
      maxWinners: 1,
      winnersCount: 0,
      createdAt: Math.floor(Date.now() / 1000),
      tags: ['WASM', 'Gas', 'Rust'],
      metadataUri: 'ipfs://optimizer',
      submissionsCount: 0,
    };

    questStorage.addQuest(newQuest);
    expect(questStorage.getQuestById(501)?.title).toBe('Soroban Gas Optimizer');

    // 2. Contributor submits proof of work
    const submission: Submission = {
      id: 801,
      questId: 501,
      questTitle: 'Soroban Gas Optimizer',
      contributor: contributorAddr,
      submissionUri: 'https://github.com/stellar/soroban-examples/pull/99',
      submittedAt: Math.floor(Date.now() / 1000),
      status: 'Pending',
      feedback: '',
      reviewedAt: 0,
    };

    questStorage.addSubmission(submission);
    const updatedQuest = questStorage.getQuestById(501);
    expect(updatedQuest?.submissionsCount).toBe(1);

    // 3. Reviewer approves submission and releases escrow
    questStorage.reviewSubmission(801, true, 'Reduced CPU instructions by 42%!');
    const finalizedQuest = questStorage.getQuestById(501);
    expect(finalizedQuest?.status).toBe('Completed');
    expect(finalizedQuest?.winnersCount).toBe(1);

    // 4. Verify contributor reputation profile and soulbound badge records
    const profile = questStorage.getReputationProfile(contributorAddr);
    expect(profile.xp).toBe(350);
    expect(profile.level).toBe(3); // 350 XP = Level 3
    expect(profile.questsCompleted).toBe(1);

    const badges = questStorage.getBadges(contributorAddr);
    expect(badges.length).toBe(1);
    expect(badges[0].questId).toBe(501);
  });
});
