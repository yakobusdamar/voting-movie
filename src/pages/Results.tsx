import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarClock, LoaderCircle, RefreshCw, TriangleAlert } from "lucide-react";

import { VoteBar } from "@/components/VoteBar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MOVIE_NIGHT } from "@/lib/event";
import { useMovies } from "@/hooks/useMovies";
import { useVotes } from "@/hooks/useVotes";

export function ResultsPage() {
  const { movies } = useMovies();
  const { results, error, isLoadingResults, refreshResults } = useVotes();
  const [refreshing, setRefreshing] = useState(false);

  const total = results.reduce((sum, r) => sum + r.count, 0);
  const max = results.reduce((max, r) => Math.max(max, r.count), 0);

  const leaderId = results.find((r) => r.count === max && max > 0)?.movieId;

  async function handleRefresh() {
    setRefreshing(true);
    await refreshResults();
    setRefreshing(false);
  }

  useEffect(() => {
    const id = setInterval(() => {
      void refreshResults();
    }, 30000);
    return () => clearInterval(id);
  }, [refreshResults]);

  const ranked = results
    .map((r) => ({
      ...r,
      title: r.title ?? movies.find((m) => m.id === r.movieId)?.title ?? "Film",
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold sm:text-3xl">Papan Hasil Voting</h1>
          <p className="text-muted-foreground">
            {isLoadingResults
              ? "Muat data hasil... "
              : total > 0
                ? `Total ${total} suara masuk. Auto-update tiap 30 detik.`
                : "Belum ada suara masuk. Yuk vote duluan!"}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => void handleRefresh()} disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} aria-hidden="true" />
          Perbarui
        </Button>
      </section>

      <Alert variant="default" className="bg-primary">
        <CalendarClock className="h-4 w-4" aria-hidden="true" />
        <AlertTitle>Nonton bareng {MOVIE_NIGHT.fullLabel}</AlertTitle>
        <AlertDescription>
          Film pemenangnya kita tonton bareng. Sampai ketemu di sesi nonton!
        </AlertDescription>
      </Alert>

      {error ? (
        <Alert variant="destructive">
          <TriangleAlert className="h-4 w-4" aria-hidden="true" />
          <AlertTitle>Waduh, list vote-nya error! 😱</AlertTitle>
          <AlertDescription>
            {error}. Coba pencet tombol Perbarui atau refresh halamannya ya.
          </AlertDescription>
        </Alert>
      ) : null}

      {!error && isLoadingResults ? (
        <Card className="p-8 text-center">
          <div className="mb-3 flex items-center justify-center gap-2 text-muted-foreground">
            <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />
            <span className="font-bold">Muat data hasil...</span>
          </div>
          <p className="text-sm text-muted-foreground">Bentar, lagi narik data suara dari server.</p>
        </Card>
      ) : null}

      {!error && !isLoadingResults && ranked.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="mb-4 text-muted-foreground">Belum ada voting untuk hari ini.</p>
          <Button asChild>
            <Link to="/">Vote Sekarang</Link>
          </Button>
        </Card>
      ) : null}

      {ranked.length > 0 ? (
        <div className="space-y-5">
          {ranked.map((r) => (
            <VoteBar
              key={r.movieId}
              label={r.title}
              count={r.count}
              total={total}
              isLeader={r.movieId === leaderId}
            />
          ))}
        </div>
      ) : null}

      {total > 0 ? (
        <p className="text-sm text-muted-foreground">
          Film paling banyak suara jadi tontonan {MOVIE_NIGHT.fullLabel}. Kategori rating bukan
          penentu — yang penting suara OMK! 🎉
        </p>
      ) : null}
    </div>
  );
}
