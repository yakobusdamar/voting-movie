import { create } from "zustand";

import { getMovies, getResults, submitVote as apiSubmitVote, fallbackMovies } from "@/api/client";
import type { Movie, ResultItem, Vote } from "@/lib/types";

interface VotingState {
  movies: Movie[];
  isLoading: boolean;
  error: string | null;
  usingFallback: boolean;
  votes: Vote[];
  results: ResultItem[];
  loadMovies: () => Promise<void>;
  castVote: (payload: { movieId: string; voterName: string }) => Promise<Vote | null>;
  refreshResults: () => Promise<void>;
}

const STORAGE_KEY = "omk-fx-votes";

function loadLocalVotes(): Vote[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Vote[]) : [];
  } catch {
    return [];
  }
}

function saveLocalVotes(votes: Vote[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(votes));
  } catch {
    // localStorage penuh / tidak tersedia — abaikan
  }
}

export const useVotingStore = create<VotingState>((set, get) => ({
  movies: [],
  isLoading: false,
  error: null,
  usingFallback: false,
  votes: loadLocalVotes(),
  results: [],

  loadMovies: async () => {
    set({ isLoading: true, error: null });

    const res = await getMovies();

    if (res.ok && res.data && res.data.length > 0) {
      set({
        movies: res.data,
        isLoading: false,
        usingFallback: false,
        error: null,
      });
      return;
    }

    set({
      movies: fallbackMovies,
      isLoading: false,
      usingFallback: true,
      error: res.error ?? null,
    });
  },

  castVote: async ({ movieId, voterName }) => {
    const res = await apiSubmitVote({ movieId, voterName });

    if (res.ok && res.data) {
      const votes = [...get().votes, res.data];
      saveLocalVotes(votes);
      set({ votes, error: null });
      return res.data;
    }

    const offlineVote: Vote = {
      id: `local-${Date.now()}`,
      movieId,
      voterName,
      createdAt: new Date().toISOString(),
    };
    const votes = [...get().votes, offlineVote];
    saveLocalVotes(votes);
    set({ votes, error: res.error ?? null, usingFallback: true });
    return offlineVote;
  },

  refreshResults: async () => {
    const res = await getResults();

    if (res.ok && res.data) {
      set({ results: res.data, error: null, usingFallback: false });
      return;
    }

    const movies = get().movies;
    const votes = get().votes;
    const counts = votes.reduce<Record<string, number>>((acc, v) => {
      acc[v.movieId] = (acc[v.movieId] ?? 0) + 1;
      return acc;
    }, {});

    const localResults: ResultItem[] = movies
      .map((m) => ({
        movieId: m.id,
        title: m.title,
        poster: m.poster,
        count: counts[m.id] ?? 0,
      }))
      .filter((r) => r.count > 0)
      .sort((a, b) => b.count - a.count);

    set({
      results: localResults,
      error: res.error ?? null,
      usingFallback: true,
    });
  },
}));
