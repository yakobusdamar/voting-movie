import { useVotingStore } from "@/store/votingStore";

export function useMovies() {
  const movies = useVotingStore((s) => s.movies);

  return { movies, isLoading: false, error: null, usingFallback: false };
}
