import { Quest, Submission, ReputationProfile, BadgeRecord, LiveFeedEvent } from '@/types';

const INITIAL_MOCK_QUESTS: Quest[] = [
  {
    id: 1,
    title: 'Build Soroban Rust SDK Escrow Module',
    description: 'Implement a reusable multi-token escrow and timelock vault contract in Rust with full test coverage and automated refund scripts.',
    sponsor: 'GDV5...981A',
    rewardToken: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC',
    tokenSymbol: 'XLM',
    rewardAmount: '12000000000',
    formattedAmount: 1200,
    xpReward: 350,
    badgeTier: 'Gold',
    badgeTierId: 3,
    deadline: Math.floor(Date.now() / 1000) + 86400 * 5,
    status: 'Open',
    maxWinners: 2,
    winnersCount: 0,
    createdAt: Math.floor(Date.now() / 1000) - 86400 * 2,
    tags: ['Rust', 'Soroban', 'Escrow', 'Security'],
    repoUrl: 'https://github.com/stellar/soroban-examples',
    metadataUri: 'ipfs://bafybeiescrowmodule',
    submissionsCount: 4,
  },
  {
    id: 2,
    title: 'Design Dark-Mode Glassmorphism Design System',
    description: 'Create a production-grade Tailwind CSS design system with fluid typography, live ledger pulses, and accessible contrast for DeFi dashboards.',
    sponsor: 'GA7T...52BC',
    rewardToken: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC',
    tokenSymbol: 'XLM',
    rewardAmount: '7500000000',
    formattedAmount: 750,
    xpReward: 200,
    badgeTier: 'Silver',
    badgeTierId: 2,
    deadline: Math.floor(Date.now() / 1000) + 86400 * 3,
    status: 'Open',
    maxWinners: 1,
    winnersCount: 0,
    createdAt: Math.floor(Date.now() / 1000) - 86400 * 1,
    tags: ['Next.js', 'Tailwind', 'UI/UX', 'Figma'],
    repoUrl: 'https://github.com/stellar/stellar-design-system',
    metadataUri: 'ipfs://bafybeidesignsystem',
    submissionsCount: 2,
  },
  {
    id: 3,
    title: 'Stellar Expert Live Event Indexer Webhook',
    description: 'Write a lightweight event consumer daemon that monitors Soroban diagnostic and contract events, publishing structured alerts to Discord/Telegram.',
    sponsor: 'GCKQ...11DF',
    rewardToken: 'CBIELTK6YBZJU5UP2WWQEUCYJLPU6QXN3F5ZCSJHQK2GB7BOGFCP5L56',
    tokenSymbol: 'USDC',
    rewardAmount: '5000000000',
    formattedAmount: 500,
    xpReward: 150,
    badgeTier: 'Silver',
    badgeTierId: 2,
    deadline: Math.floor(Date.now() / 1000) + 86400 * 8,
    status: 'Open',
    maxWinners: 1,
    winnersCount: 0,
    createdAt: Math.floor(Date.now() / 1000) - 86400 * 3,
    tags: ['Node.js', 'Webhooks', 'Indexing', 'Bots'],
    metadataUri: 'ipfs://bafybeiindexer',
    submissionsCount: 1,
  },
  {
    id: 4,
    title: 'Automated CI/CD GitHub Action for Soroban Contracts',
    description: 'Build a turnkey reusable GitHub Action that compiles Soroban smart contracts, runs cargo tests, formats with rustfmt, and asserts gas limits.',
    sponsor: 'GB3M...77PQ',
    rewardToken: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC',
    tokenSymbol: 'XLM',
    rewardAmount: '20000000000',
    formattedAmount: 2000,
    xpReward: 600,
    badgeTier: 'Diamond',
    badgeTierId: 5,
    deadline: Math.floor(Date.now() / 1000) - 86400 * 1, // Expired
    status: 'Completed',
    maxWinners: 1,
    winnersCount: 1,
    createdAt: Math.floor(Date.now() / 1000) - 86400 * 10,
    tags: ['DevOps', 'GitHub Actions', 'CI/CD', 'Rust'],
    metadataUri: 'ipfs://bafybeiaction',
    submissionsCount: 3,
  },
];

const INITIAL_MOCK_SUBMISSIONS: Submission[] = [
  {
    id: 1,
    questId: 4,
    questTitle: 'Automated CI/CD GitHub Action for Soroban Contracts',
    contributor: 'GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFTGXDUTHXPIWNX6VOXR3',
    submissionUri: 'https://github.com/prerana-techi/soroban-action-pr/pull/1',
    submittedAt: Math.floor(Date.now() / 1000) - 86400 * 2,
    status: 'Approved',
    feedback: 'Flawless action setup! Passed all matrix checks and caching works great.',
    reviewedAt: Math.floor(Date.now() / 1000) - 86400 * 1,
  },
  {
    id: 2,
    questId: 1,
    questTitle: 'Build Soroban Rust SDK Escrow Module',
    contributor: 'GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFTGXDUTHXPIWNX6VOXR3',
    submissionUri: 'https://github.com/stellar/soroban-examples/pull/42',
    submittedAt: Math.floor(Date.now() / 1000) - 3600 * 6,
    status: 'Pending',
    feedback: '',
    reviewedAt: 0,
  },
];

const INITIAL_MOCK_EVENTS: LiveFeedEvent[] = [
  {
    id: 'evt-1',
    type: 'q_payout',
    contractId: 'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMDR4',
    ledger: 5421908,
    timestamp: Math.floor(Date.now() / 1000) - 1800,
    txHash: 'e481c9a781b...29ef',
    title: 'Reward Released & Badge Minted',
    description: '2,000 XLM paid out to contributor GBRP...OXR3 for Quest #4',
    actor: 'GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFTGXDUTHXPIWNX6VOXR3',
    amount: '2,000 XLM',
    tokenSymbol: 'XLM',
    xp: 600,
    badgeTier: 'Diamond',
  },
  {
    id: 'evt-2',
    type: 'q_submit',
    contractId: 'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMDR4',
    ledger: 5421850,
    timestamp: Math.floor(Date.now() / 1000) - 3600 * 6,
    txHash: '39bb4c12...890a',
    title: 'Work Submitted',
    description: 'Contributor submitted PR for Quest #1: Build Soroban Rust SDK Escrow Module',
    actor: 'GBRP...OXR3',
  },
  {
    id: 'evt-3',
    type: 'q_create',
    contractId: 'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMDR4',
    ledger: 5421710,
    timestamp: Math.floor(Date.now() / 1000) - 86400,
    txHash: '7a12bc98...33ee',
    title: 'New Quest Created & Escrow Locked',
    description: 'Sponsor locked 750 XLM reward into Quest #2',
    actor: 'GA7T...52BC',
    amount: '750 XLM',
    tokenSymbol: 'XLM',
  },
];

class QuestStorageService {
  private questsKey = 'soroban_quests_data';
  private submissionsKey = 'soroban_submissions_data';
  private eventsKey = 'soroban_live_events';

  public getQuests(): Quest[] {
    if (typeof window === 'undefined') return INITIAL_MOCK_QUESTS;
    try {
      const stored = localStorage.getItem(this.questsKey);
      if (stored) return JSON.parse(stored);
    } catch {}
    this.saveQuests(INITIAL_MOCK_QUESTS);
    return INITIAL_MOCK_QUESTS;
  }

  public saveQuests(quests: Quest[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.questsKey, JSON.stringify(quests));
  }

  public getQuestById(id: number): Quest | undefined {
    const list = this.getQuests();
    return list.find((q) => q.id === id);
  }

  public addQuest(quest: Quest) {
    const list = this.getQuests();
    const updated = [quest, ...list];
    this.saveQuests(updated);
    return quest;
  }

  public updateQuest(quest: Quest) {
    const list = this.getQuests();
    const index = list.findIndex((q) => q.id === quest.id);
    if (index !== -1) {
      list[index] = quest;
      this.saveQuests(list);
    }
  }

  public getSubmissions(): Submission[] {
    if (typeof window === 'undefined') return INITIAL_MOCK_SUBMISSIONS;
    try {
      const stored = localStorage.getItem(this.submissionsKey);
      if (stored) return JSON.parse(stored);
    } catch {}
    this.saveSubmissions(INITIAL_MOCK_SUBMISSIONS);
    return INITIAL_MOCK_SUBMISSIONS;
  }

  public saveSubmissions(subs: Submission[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.submissionsKey, JSON.stringify(subs));
  }

  public addSubmission(sub: Submission) {
    const subs = this.getSubmissions();
    const updated = [sub, ...subs];
    this.saveSubmissions(updated);

    // Increment submissionsCount on Quest
    const quest = this.getQuestById(sub.questId);
    if (quest) {
      quest.submissionsCount = (quest.submissionsCount || 0) + 1;
      this.updateQuest(quest);
    }
  }

  public reviewSubmission(submissionId: number, approve: boolean, feedback: string) {
    const subs = this.getSubmissions();
    const sub = subs.find((s) => s.id === submissionId);
    if (!sub) return;

    sub.status = approve ? 'Approved' : 'Rejected';
    sub.feedback = feedback;
    sub.reviewedAt = Math.floor(Date.now() / 1000);
    this.saveSubmissions(subs);

    if (approve) {
      const quest = this.getQuestById(sub.questId);
      if (quest) {
        quest.winnersCount += 1;
        if (quest.winnersCount >= quest.maxWinners) {
          quest.status = 'Completed';
        }
        this.updateQuest(quest);
      }
    }
  }

  public getLiveEvents(): LiveFeedEvent[] {
    if (typeof window === 'undefined') return INITIAL_MOCK_EVENTS;
    try {
      const stored = localStorage.getItem(this.eventsKey);
      if (stored) return JSON.parse(stored);
    } catch {}
    this.saveLiveEvents(INITIAL_MOCK_EVENTS);
    return INITIAL_MOCK_EVENTS;
  }

  public saveLiveEvents(events: LiveFeedEvent[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.eventsKey, JSON.stringify(events));
  }

  public addLiveEvent(event: LiveFeedEvent) {
    const events = this.getLiveEvents();
    const updated = [event, ...events.slice(0, 49)];
    this.saveLiveEvents(updated);
  }

  public getReputationProfile(address: string): ReputationProfile {
    const subs = this.getSubmissions().filter((s) => s.contributor === address && s.status === 'Approved');
    const created = this.getQuests().filter((q) => q.sponsor === address);
    const xp = subs.length * 350;
    const totalEarned = subs.length * 1000;

    let level = 1;
    if (xp >= 1000) level = 5;
    else if (xp >= 500) level = 4;
    else if (xp >= 250) level = 3;
    else if (xp >= 100) level = 2;

    return {
      account: address,
      xp,
      questsCompleted: subs.length,
      questsCreated: created.length,
      badgesCount: subs.length,
      level,
      totalEarned: `${totalEarned * 10_000_000}`,
      formattedTotalEarned: totalEarned,
      lastActive: Math.floor(Date.now() / 1000),
    };
  }

  public getBadges(address: string): BadgeRecord[] {
    const approvedSubs = this.getSubmissions().filter((s) => s.contributor === address && s.status === 'Approved');
    return approvedSubs.map((sub, i) => ({
      questId: sub.questId,
      questTitle: sub.questTitle || `Quest #${sub.questId}`,
      recipient: address,
      tier: (['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'][i % 5] as any) || 'Gold',
      tierId: (i % 5) + 1,
      earnedAt: sub.reviewedAt || sub.submittedAt,
      uri: `ipfs://badge-${sub.questId}`,
    }));
  }
}

export const questStorage = new QuestStorageService();
