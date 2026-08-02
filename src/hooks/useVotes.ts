import { useCallback, useEffect } from "react";

import { useVotingStore } from "@/store/votingStore";

export function useVotes() {
  const votes = useVotingStore((s) => s.votes);
  const results = useVotingStore((s) => s.results);
  const error = useVotingStore((s) => s.error);
  const castVote = useVotingStore((s) => s.castVote);
  const refreshResults = useVotingStore((s) => s.refreshResults);

  useEffect(() => {
    void refreshResults();
  }, [refreshResults]);

  const vote = useCallback(
    (payload: { movieId: string; voterName: string }) => castVote(payload),
    [castVote],
  );

  return {
    votes,
    results,
    error,
    vote,
    refreshResults,
  };
}
