import { useCallback, useEffect } from "react";

import { useVotingStore } from "@/store/votingStore";

export function useVotes() {
  const votes = useVotingStore((s) => s.votes);
  const results = useVotingStore((s) => s.results);
  const error = useVotingStore((s) => s.error);
  const isLoadingResults = useVotingStore((s) => s.isLoadingResults);
  const castVote = useVotingStore((s) => s.castVote);
  const castVotes = useVotingStore((s) => s.castVotes);
  const refreshResults = useVotingStore((s) => s.refreshResults);

  useEffect(() => {
    void refreshResults();
  }, [refreshResults]);

  const vote = useCallback(
    (payload: { movieId: string; voterName: string }) => castVote(payload),
    [castVote],
  );

  const voteMany = useCallback(
    (payloads: { movieId: string; voterName: string }[]) => castVotes(payloads),
    [castVotes],
  );

  return {
    votes,
    results,
    error,
    isLoadingResults,
    vote,
    voteMany,
    refreshResults,
  };
}
