import { create } from "zustand";

import { getResults, submitVote as apiSubmitVote } from "@/api/client";
import { fallbackMovies } from "@/data/movies";
import type { Movie, ResultItem, Vote } from "@/lib/types";

export const MAX_VOTES_PER_PERSON = 3;

interface VotingState {
  movies: Movie[];
  votes: Vote[];
  results: ResultItem[];
  error: string | null;
  castVote: (payload: { movieId: string; voterName: string }) => Promise<Vote | null>;
  refreshResults: () => Promise<void>;
}

export function countVotesForName(votes: Vote[], name: string): number {
  const key = name.trim().toLowerCase();
  return votes.filter((v) => v.voterName.trim().toLowerCase() === key).length;
}

export const useVotingStore = create<VotingState>((set, get) => ({
  movies: fallbackMovies,
  votes: [],
  results: [],
  error: null,

  castVote: async ({ movieId, voterName }) => {
    const name = voterName.trim() || "Anonim";
    const used = countVotesForName(get().votes, name);

    if (used >= MAX_VOTES_PER_PERSON) {
      set({
        error: `Maksimal ${MAX_VOTES_PER_PERSON} vote per orang. Udah habis quota kamu, ${name}!`,
      });
      return null;
    }

    const res = await apiSubmitVote({ movieId, voterName: name });

    if (res.ok && res.data) {
      set({ votes: [...get().votes, res.data], error: null });
      return res.data;
    }

    set({ error: res.error ?? "Waduh, vote-nya gagal ke kirim. Coba lagi ya!" });
    return null;
  },

  refreshResults: async () => {
    const res = await getResults();

    if (res.ok && res.data) {
      set({ results: res.data, error: null });
      return;
    }

    set({
      results: [],
      error: res.error ?? "Waduh, list vote-nya lagi error. Coba refresh atau balik lagi nanti ya!",
    });
  },
}));
