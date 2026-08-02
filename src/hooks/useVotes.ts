import { useCallback, useEffect } from "react";

import { useVotingStore } from "@/store/votingStore";

export function useVotes() {
  const votes = useVotingStore((s) => s.votes);
  const results = useVotingStore((s) => s.results);
  const error = useVotingStore((s) => s.error);
  const usingFallback = useVotingStore((s) => s.usingFallback);
  const castVote = useVotingStore((s) => s.castVote);
  const refreshResults = useVotingStore((s) => s.refreshResults);

  useEffect(() => {
    if (results.length === 0) {
      void refreshResults();
    }
  }, [results.length, refreshResults]);

  const vote = useCallback(
    (payload: { movieId: string; voterName: string }) => castVote(payload),
    [castVote],
  );

  return {
    votes,
    results,
    error,
    usingFallback,
    vote,
    refreshResults,
  };
}
