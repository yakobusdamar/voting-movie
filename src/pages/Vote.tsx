import { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarClock, Check, Loader2, PartyPopper, RefreshCw } from "lucide-react";

import { RatingBadge } from "@/components/RatingBadge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MOVIE_NIGHT } from "@/lib/event";
import { useMovies } from "@/hooks/useMovies";
import { useVotes } from "@/hooks/useVotes";
import { countVotesForName, MAX_VOTES_PER_PERSON } from "@/store/votingStore";

interface SubmitOutcome {
  success: string[];
  failed: { movieId: string; title: string; error?: string }[];
}

export function VotePage() {
  const { movies } = useMovies();
  const { voteMany, votes, error } = useVotes();

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [voterName, setVoterName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [outcome, setOutcome] = useState<SubmitOutcome | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const usedVotes = countVotesForName(votes, voterName);
  const quotaLeft = Math.max(0, MAX_VOTES_PER_PERSON - usedVotes);
  const selectedCount = selected.size;
  const canSubmit = selectedCount > 0 && quotaLeft > 0;

  function toggleMovie(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (quotaLeft > 0 && next.size < quotaLeft) {
        next.add(id);
      }
      return next;
    });
  }

  async function submitVotes(payloads: { movieId: string; voterName: string }[]) {
    setSubmitting(true);
    setSubmitError(null);
    setOutcome(null);

    const name = voterName.trim() || "Anonim";
    const result = await voteMany(
      payloads.map((p) => ({ ...p, voterName: name })),
    );

    setSubmitting(false);

    const successTitles = movies
      .filter((m) => result.success.some((v) => v.movieId === m.id))
      .map((m) => m.title);

    const failedWithTitle = result.failed.map((f) => ({
      ...f,
      title: movies.find((m) => m.id === f.movieId)?.title ?? f.movieId,
    }));

    if (successTitles.length === 0 && failedWithTitle.length === 0) {
      setSubmitError(error ?? "Waduh, vote-nya gagal ke kirim. Coba lagi ya!");
      return;
    }

    setOutcome({ success: successTitles, failed: failedWithTitle });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    const payloads = movies
      .filter((m) => selected.has(m.id))
      .map((m) => ({ movieId: m.id, voterName }));

    await submitVotes(payloads);
  }

  async function retryFailed() {
    if (!outcome) return;
    const payloads = outcome.failed.map((f) => ({ movieId: f.movieId, voterName }));
    await submitVotes(payloads);
  }

  if (outcome) {
    const allOk = outcome.failed.length === 0;
    return (
      <Card className="mx-auto max-w-lg text-center">
        <CardHeader>
          <div
            className={`mx-auto grid h-16 w-16 place-items-center rounded-full border-2 border-neon-border shadow-neobrutal ${
              allOk ? "bg-green-400" : "bg-yellow-300"
            }`}
          >
            {allOk ? (
              <PartyPopper className="h-8 w-8" aria-hidden="true" />
            ) : (
              <RefreshCw className="h-8 w-8" aria-hidden="true" />
            )}
          </div>
          <CardTitle className="text-xl">
            {allOk ? "Suara kamu masuk!" : "Sebagian masuk, sebagian belum"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {outcome.success.length > 0 ? (
            <div className="rounded-sm border-2 border-neon-border bg-green-50 p-3 text-left">
              <p className="mb-1 text-sm font-extrabold">✅ Berhasil ({outcome.success.length})</p>
              <ul className="list-inside list-disc text-sm text-muted-foreground">
                {outcome.success.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {outcome.failed.length > 0 ? (
            <div className="rounded-sm border-2 border-neon-border bg-yellow-50 p-3 text-left">
              <p className="mb-1 text-sm font-extrabold">❌ Gagal ({outcome.failed.length})</p>
              <ul className="list-inside list-disc text-sm text-muted-foreground">
                {outcome.failed.map((f) => (
                  <li key={f.movieId}>
                    {f.title}
                    {f.error ? ` — ${f.error}` : ""}
                  </li>
                ))}
              </ul>
              <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => void retryFailed()} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Nyoba lagi...
                  </>
                ) : (
                  "Coba Lagi yang Gagal"
                )}
              </Button>
            </div>
          ) : null}

          {allOk ? (
            <p>
              Nonton barengnya <strong>{MOVIE_NIGHT.dateLabel}</strong> jam{" "}
              <strong>{MOVIE_NIGHT.timeLabel}</strong>, jangan lupa!
            </p>
          ) : null}

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button asChild>
              <Link to="/results">Lihat Hasil</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/">Vote Lagi</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <section className="space-y-1">
        <h1 className="text-2xl font-extrabold sm:text-3xl">Vote film pilihanmu 🍿</h1>
        <p className="text-muted-foreground">
          Centang film komedi Indonesia favoritmu (boleh lebih dari satu, maks {MAX_VOTES_PER_PERSON}), isi
          nama, lalu kirim suara. Film paling banyak suara jadi tontonan bareng!
        </p>
      </section>

      <Alert variant="default" className="bg-primary">
        <CalendarClock className="h-4 w-4" aria-hidden="true" />
        <AlertTitle>Nonton bareng {MOVIE_NIGHT.fullLabel}</AlertTitle>
        <AlertDescription>
          Yuk ramaikan votingnya, biar besok gak bingung mau nonton apa!
        </AlertDescription>
      </Alert>

      {submitError ? (
        <Alert variant="destructive">
          <AlertTitle>Waduh!</AlertTitle>
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {movies.map((movie) => {
          const active = selected.has(movie.id);
          const canPick = active || selectedCount < quotaLeft;
          return (
            <Card
              key={movie.id}
              className={active ? "border-4 border-neon-border bg-yellow-100" : "cursor-pointer hover:bg-muted"}
              onClick={() => canPick && toggleMovie(movie.id)}
              role="button"
              tabIndex={0}
              aria-pressed={active}
              aria-disabled={!canPick}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && canPick) {
                  toggleMovie(movie.id);
                }
              }}
            >
              <CardContent className="flex items-start gap-3 p-4">
                <span
                  className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-sm border-2 border-neon-border ${
                    active ? "bg-green-400" : "bg-background"
                  }`}
                  aria-hidden="true"
                >
                  {active ? <Check className="h-4 w-4" /> : null}
                </span>
                <div className="min-w-0 space-y-1">
                  <CardTitle className="text-base leading-tight">{movie.title}</CardTitle>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span>{movie.year}</span>
                    <span aria-hidden="true">·</span>
                    <span>{movie.genre.join(", ")}</span>
                  </div>
                  <RatingBadge imdb={movie.ratings.imdb} local={movie.ratings.local} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-neon-border">
        <CardHeader>
          <CardTitle className="text-xl">
            {selectedCount > 0 ? `${selectedCount} film dipilih` : "Kirim suara kamu"}
          </CardTitle>
          {selectedCount > 0 ? (
            <p className="text-sm text-muted-foreground">
              Sisa kuota: {quotaLeft} dari {MAX_VOTES_PER_PERSON}
            </p>
          ) : null}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="voterName" className="text-sm font-bold">
                Nama kamu (boleh alias)
              </label>
              <Input
                id="voterName"
                value={voterName}
                onChange={(e) => setVoterName(e.target.value)}
                placeholder="Contoh: Budi, Kak Rara, atau 'anonim'"
                maxLength={40}
                autoComplete="name"
              />
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={submitting || !canSubmit}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Mengirim suara...
                </>
              ) : selectedCount === 0 ? (
                "Pilih film dulu dong 😅"
              ) : quotaLeft <= 0 ? (
                "Kuota vote abis 😅"
              ) : (
                `Kirim ${selectedCount} Suara`
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
