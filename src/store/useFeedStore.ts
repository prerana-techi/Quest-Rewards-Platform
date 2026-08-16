'use client';

import { create } from 'zustand';
import { LiveFeedEvent, SorobanEventType } from '@/types';
import { questStorage } from '@/services/questStorage';

interface FeedState {
  events: LiveFeedEvent[];
  filterType: SorobanEventType | 'all';
  isLiveStreaming: boolean;
  pulseCount: number;

  // Actions
  loadInitialEvents: () => void;
  setFilterType: (type: SorobanEventType | 'all') => void;
  setIsLiveStreaming: (live: boolean) => void;
  addEvent: (event: LiveFeedEvent) => void;
}

export const useFeedStore = create<FeedState>((set) => ({
  events: [],
  filterType: 'all',
  isLiveStreaming: true,
  pulseCount: 0,

  loadInitialEvents: () => {
    const events = questStorage.getLiveEvents();
    set({ events });
  },

  setFilterType: (type) => {
    set({ filterType: type });
  },

  setIsLiveStreaming: (live) => {
    set({ isLiveStreaming: live });
  },

  addEvent: (event) => {
    questStorage.addLiveEvent(event);
    set((state) => ({
      events: [event, ...state.events.slice(0, 49)],
      pulseCount: state.pulseCount + 1,
    }));
  },
}));
