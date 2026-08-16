export type QuestStatus = 'Draft' | 'Open' | 'InReview' | 'Completed' | 'Expired' | 'Cancelled';

export type SubmissionStatus = 'Pending' | 'Approved' | 'Rejected';

export type BadgeTierType = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';

export interface Quest {
  id: number;
  title: string;
  description: string;
  sponsor: string;
  rewardToken: string;
  tokenSymbol: string;
  rewardAmount: string; // BigInt string
  formattedAmount: number;
  xpReward: number;
  badgeTier: BadgeTierType;
  badgeTierId: number;
  deadline: number; // unix timestamp in seconds
  status: QuestStatus;
  maxWinners: number;
  winnersCount: number;
  createdAt: number;
  reviewer?: string;
  tags: string[];
  repoUrl?: string;
  metadataUri: string;
  submissionsCount?: number;
}

export interface Submission {
  id: number;
  questId: number;
  questTitle?: string;
  contributor: string;
  submissionUri: string;
  submittedAt: number;
  status: SubmissionStatus;
  feedback: string;
  reviewedAt: number;
}

export interface BadgeRecord {
  questId: number;
  questTitle?: string;
  recipient: string;
  tier: BadgeTierType;
  tierId: number;
  earnedAt: number;
  uri: string;
}

export interface ReputationProfile {
  account: string;
  xp: number;
  questsCompleted: number;
  questsCreated: number;
  badgesCount: number;
  level: number;
  totalEarned: string;
  formattedTotalEarned: number;
  lastActive: number;
}

export type TxStatus = 'idle' | 'signing' | 'submitting' | 'confirmed' | 'failed';

export interface TransactionRecord {
  id: string;
  hash?: string;
  type: 'create_quest' | 'submit_work' | 'review_submission' | 'refund_quest' | 'claim_badge';
  title: string;
  description: string;
  status: TxStatus;
  timestamp: number;
  explorerUrl?: string;
  error?: string;
  gasFee?: string;
  retryAction?: () => Promise<void>;
}

export type SorobanEventType = 'q_create' | 'q_submit' | 'q_review' | 'q_payout' | 'q_refund' | 'xp_award' | 'badge_mnt' | 'q_status';

export interface LiveFeedEvent {
  id: string;
  type: SorobanEventType;
  contractId: string;
  ledger: number;
  timestamp: number;
  txHash: string;
  title: string;
  description: string;
  actor: string;
  amount?: string;
  tokenSymbol?: string;
  xp?: number;
  badgeTier?: BadgeTierType;
}

export interface NetworkConfig {
  network: string;
  rpcUrl: string;
  networkPassphrase: string;
  questCoreContractId: string;
  questReputationContractId: string;
  nativeTokenAddress: string;
  explorerUrl: string;
}
