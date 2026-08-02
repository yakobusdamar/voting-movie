import { useEffect } from "react";

import { useVotingStore } from "@/store/votingStore";

export function useMovies() {
  const movies = useVotingStore((s) => s.movies);
  const isLoading = useVotingStore((s) => s.isLoading);
  const error = useVotingStore((s) => s.error);
  const usingFallback = useVotingStore((s) => s.usingFallback);
  const loadMovies = useVotingStore((s) => s.loadMovies);

  useEffect(() => {
    if (movies.length === 0 && !isLoading) {
      void loadMovies();
    }
  }, [movies.length, isLoading, loadMovies]);

  return { movies, isLoading, error, usingFallback, reload: loadMovies };
}
