'use client';

import { useMemo } from 'react';
import { useWalletStore } from '@/store/useWalletStore';
import { questStorage } from '@/services/questStorage';
import { ReputationProfile, BadgeRecord } from '@/types';

export function useReputation() {
  const { address } = useWalletStore();

  const profile: ReputationProfile = useMemo(() => {
    if (!address) {
      return {
        account: '',
        xp: 0,
        questsCompleted: 0,
        questsCreated: 0,
        badgesCount: 0,
        level: 1,
        totalEarned: '0',
        formattedTotalEarned: 0,
        lastActive: 0,
      };
    }
    return questStorage.getReputationProfile(address);
  }, [address]);

  const badges: BadgeRecord[] = useMemo(() => {
    if (!address) return [];
    return questStorage.getBadges(address);
  }, [address]);

  return {
    profile,
    badges,
  };
}
