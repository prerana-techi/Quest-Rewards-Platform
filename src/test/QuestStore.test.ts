import { describe, it, expect, beforeEach } from 'vitest';
import { useQuestStore } from '@/store/useQuestStore';
import { Quest, Submission } from '@/types';

describe('useQuestStore', () => {
  beforeEach(() => {
    useQuestStore.setState({
      quests: [],
      submissions: [],
      filters: {
        searchQuery: '',
        statusFilter: 'all',
        tagFilter: 'all',
        sortBy: 'latest',
      },
    });
  });

  it('should add optimistic quest correctly', () => {
    const mockQuest: Quest = {
      id: 99,
      title: 'Test Soroban Bounty',
      description: 'Test description',
      sponsor: 'GABC...123',
      rewardToken: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC',
      tokenSymbol: 'XLM',
      rewardAmount: '1000000000',
      formattedAmount: 100,
      xpReward: 50,
      badgeTier: 'Bronze',
      badgeTierId: 1,
      deadline: 1800000,
      status: 'Open',
      maxWinners: 1,
      winnersCount: 0,
      createdAt: 1700000,
      tags: ['Rust', 'Soroban'],
      metadataUri: 'ipfs://test',
      submissionsCount: 0,
    };

    useQuestStore.getState().createQuestOptimistic(mockQuest);

    const quests = useQuestStore.getState().quests;
    expect(quests.length).toBe(1);
    expect(quests[0].title).toBe('Test Soroban Bounty');
  });

  it('should update filters', () => {
    useQuestStore.getState().setSearchQuery('Atomic Multi-Sig');
    expect(useQuestStore.getState().filters.searchQuery).toBe('Atomic Multi-Sig');

    useQuestStore.getState().setStatusFilter('completed');
    expect(useQuestStore.getState().filters.statusFilter).toBe('completed');
  });

  it('should handle optimistic submissions', () => {
    const mockSub: Submission = {
      id: 909,
      questId: 99,
      contributor: 'GBRP...123',
      submissionUri: 'https://github.com/prerana-techi/test/pull/1',
      submittedAt: 1700000,
      status: 'Pending',
      feedback: '',
      reviewedAt: 0,
    };

    useQuestStore.getState().submitWorkOptimistic(mockSub);
    const subs = useQuestStore.getState().submissions;
    expect(subs.some((s) => s.contributor === 'GBRP...123')).toBe(true);
  });
});
