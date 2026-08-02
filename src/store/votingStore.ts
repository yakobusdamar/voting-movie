import { create } from "zustand";

import { getResults, submitVote as apiSubmitVote } from "@/api/client";
import { fallbackMovies } from "@/data/movies";
import type { Movie, ResultItem, Vote } from "@/lib/types";

export const MAX_VOTES_PER_PERSON = 3;

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

interface VotingState {
  movies: Movie[];
  votes: Vote[];
  results: ResultItem[];
  error: string | null;
  castVote: (payload: { movieId: string; voterName: string }) => Promise<Vote | null>;
  castVotes: (payloads: { movieId: string; voterName: string }[]) => Promise<Vote[]>;
  refreshResults: () => Promise<void>;
}

export function countVotesForName(votes: Vote[], name: string): number {
  const key = name.trim().toLowerCase();
  return votes.filter((v) => v.voterName.trim().toLowerCase() === key).length;
}

export const useVotingStore = create<VotingState>((set, get) => ({
  movies: fallbackMovies,
  votes: loadLocalVotes(),
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
      const votes = [...get().votes, res.data];
      saveLocalVotes(votes);
      set({ votes, error: null });
      return res.data;
    }

    set({ error: res.error ?? "Waduh, vote-nya gagal ke kirim. Coba lagi ya!" });
    return null;
  },

  castVotes: async (payloads) => {
    const first = payloads[0];
    const name = (first?.voterName ?? "").trim() || "Anonim";
    const used = countVotesForName(get().votes, name);

    if (payloads.length > MAX_VOTES_PER_PERSON - used) {
      set({
        error: `Maksimal ${MAX_VOTES_PER_PERSON} vote per orang. Kamu cuma sisa ${Math.max(0, MAX_VOTES_PER_PERSON - used)} slot, ${name}!`,
      });
      return [];
    }

    const newVotes: Vote[] = [];
    for (const payload of payloads) {
      const res = await apiSubmitVote({ movieId: payload.movieId, voterName: name });

      if (res.ok && res.data) {
        newVotes.push(res.data);
      } else {
        set({ error: res.error ?? `Vote ${payload.movieId} gagal ke kirim.` });
      }
    }

    if (newVotes.length > 0) {
      const votes = [...get().votes, ...newVotes];
      saveLocalVotes(votes);
      set({ votes, error: null });
    }

    return newVotes;
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
