import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Check, Loader2, PartyPopper } from "lucide-react";

import { PlatformBadges } from "@/components/PlatformBadge";
import { RatingBadge } from "@/components/RatingBadge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useMovies } from "@/hooks/useMovies";
import { useVotes } from "@/hooks/useVotes";

export function VotePage() {
  const { movies, isLoading, error, usingFallback } = useMovies();
  const { vote, usingFallback: voteFallback } = useVotes();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const selectedId = searchParams.get("movie");
  const selected = movies.find((m) => m.id === selectedId);

  const [voterName, setVoterName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;

    setSubmitting(true);
    setSubmitError(null);

    const name = voterName.trim() || "Anonim";
    const result = await vote({ movieId: selected.id, voterName: name });

    setSubmitting(false);
    if (result) {
      setDone(selected.title);
    } else {
      setSubmitError("Voting gagal dikirim. Coba lagi ya.");
    }
  }

  if (done) {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <CardHeader>
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border-2 border-neon-border bg-green-400 shadow-neobrutal">
            <PartyPopper className="h-8 w-8" aria-hidden="true" />
          </div>
          <CardTitle className="text-xl">Suara kamu masuk!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Kamu memilih <strong>{done}</strong>. Besok kita lihat hasilnya di papan voting.
          </p>
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Gagal memuat film</AlertTitle>
        <AlertDescription>
          {error ?? "Tidak ada film yang bisa ditampilkan."}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <section className="space-y-1">
        <h1 className="text-2xl font-extrabold sm:text-3xl">Vote film pilihanmu 🍿</h1>
        <p className="text-muted-foreground">
          Mau nonton apa besok? Pilih satu film di bawah, isi nama (boleh panggilan/alias), lalu
          kirim suara. Film paling banyak suara jadi tontonan besok!
        </p>
      </section>

      {usingFallback || voteFallback ? (
        <Alert variant="warning">
          <AlertTitle>Data lama</AlertTitle>
          <AlertDescription>
            Server voting tidak terjangkau. Vote akan tersimpan di perangkat ini untuk sementara.
          </AlertDescription>
        </Alert>
      ) : null}

      {submitError ? (
        <Alert variant="destructive">
          <AlertTitle>Voting gagal</AlertTitle>
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {movies.map((movie) => {
          const active = movie.id === selectedId;
          return (
            <Card
              key={movie.id}
              className={active ? "border-4 border-neon-border bg-yellow-100" : "cursor-pointer hover:bg-muted"}
              onClick={() => navigate(`/?movie=${movie.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  navigate(`/?movie=${movie.id}`);
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
                  <PlatformBadges platforms={movie.platforms} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selected ? (
        <Card className="border-neon-border">
          <CardHeader>
            <CardTitle className="text-xl">Kirim suara untuk: {selected.title}</CardTitle>
            {selected.synopsis ? (
              <p className="text-sm text-muted-foreground">{selected.synopsis}</p>
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
              <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Mengirim suara...
                  </>
                ) : (
                  "Kirim Suara"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-6 text-center text-muted-foreground">
            Pilih salah satu film di atas untuk mulai voting.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
