'use client';

import { create } from 'zustand';
import { Quest, Submission } from '@/types';
import { questStorage } from '@/services/questStorage';

interface QuestFilterState {
  searchQuery: string;
  statusFilter: string;
  tagFilter: string;
  sortBy: 'latest' | 'reward_high' | 'reward_low' | 'deadline';
}

interface QuestState {
  quests: Quest[];
  submissions: Submission[];
  filters: QuestFilterState;
  createModalOpen: boolean;
  submitModalQuest: Quest | null;
  reviewModalSubmission: Submission | null;

  // Actions
  loadInitialData: () => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  setTagFilter: (tag: string) => void;
  setSortBy: (sort: 'latest' | 'reward_high' | 'reward_low' | 'deadline') => void;
  setCreateModalOpen: (open: boolean) => void;
  setSubmitModalQuest: (quest: Quest | null) => void;
  setReviewModalSubmission: (sub: Submission | null) => void;
  createQuestOptimistic: (quest: Quest) => void;
  submitWorkOptimistic: (sub: Submission) => void;
  reviewWorkOptimistic: (submissionId: number, approve: boolean, feedback: string) => void;
}

export const useQuestStore = create<QuestState>((set, get) => ({
  quests: [],
  submissions: [],
  filters: {
    searchQuery: '',
    statusFilter: 'all',
    tagFilter: 'all',
    sortBy: 'latest',
  },
  createModalOpen: false,
  submitModalQuest: null,
  reviewModalSubmission: null,

  loadInitialData: () => {
    const quests = questStorage.getQuests();
    const submissions = questStorage.getSubmissions();
    set({ quests, submissions });
  },

  setSearchQuery: (query) => {
    set((state) => ({ filters: { ...state.filters, searchQuery: query } }));
  },

  setStatusFilter: (status) => {
    set((state) => ({ filters: { ...state.filters, statusFilter: status } }));
  },

  setTagFilter: (tag) => {
    set((state) => ({ filters: { ...state.filters, tagFilter: tag } }));
  },

  setSortBy: (sortBy) => {
    set((state) => ({ filters: { ...state.filters, sortBy } }));
  },

  setCreateModalOpen: (open) => {
    set({ createModalOpen: open });
  },

  setSubmitModalQuest: (quest) => {
    set({ submitModalQuest: quest });
  },

  setReviewModalSubmission: (sub) => {
    set({ reviewModalSubmission: sub });
  },

  createQuestOptimistic: (quest) => {
    questStorage.addQuest(quest);
    set((state) => ({ quests: [quest, ...state.quests], createModalOpen: false }));
  },

  submitWorkOptimistic: (sub) => {
    questStorage.addSubmission(sub);
    const quests = questStorage.getQuests();
    const submissions = questStorage.getSubmissions();
    set({ quests, submissions, submitModalQuest: null });
  },

  reviewWorkOptimistic: (submissionId, approve, feedback) => {
    questStorage.reviewSubmission(submissionId, approve, feedback);
    const quests = questStorage.getQuests();
    const submissions = questStorage.getSubmissions();
    set({ quests, submissions, reviewModalSubmission: null });
  },
}));
