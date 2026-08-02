import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CalendarClock, Check, Loader2, PartyPopper } from "lucide-react";

import { RatingBadge } from "@/components/RatingBadge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MOVIE_NIGHT } from "@/lib/event";
import { useMovies } from "@/hooks/useMovies";
import { useVotes } from "@/hooks/useVotes";
import { countVotesForName, MAX_VOTES_PER_PERSON } from "@/store/votingStore";

export function VotePage() {
  const { movies } = useMovies();
  const { vote, votes, error } = useVotes();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const selectedId = searchParams.get("movie");
  const selected = movies.find((m) => m.id === selectedId);

  const [voterName, setVoterName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const usedVotes = countVotesForName(votes, voterName);
  const quotaLeft = Math.max(0, MAX_VOTES_PER_PERSON - usedVotes);

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
      setSubmitError(error ?? "Waduh, vote-nya gagal ke kirim. Coba lagi ya!");
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
            Kamu memilih <strong>{done}</strong>. Nonton barengnya <strong>{MOVIE_NIGHT.dateLabel}</strong> jam{" "}
            <strong>{MOVIE_NIGHT.timeLabel}</strong>, jangan lupa!
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

  return (
    <div className="space-y-6">
      <section className="space-y-1">
        <h1 className="text-2xl font-extrabold sm:text-3xl">Vote film pilihanmu 🍿</h1>
        <p className="text-muted-foreground">
          Pilih film komedi Indonesia favoritmu di bawah, isi nama (boleh alias), kirim suara.
          Tiap orang maksimal {MAX_VOTES_PER_PERSON} film. Film paling banyak suara jadi tontonan
          bareng!
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
                <p className="text-xs text-muted-foreground">
                  Sisa kuota vote kamu: {quotaLeft} dari {MAX_VOTES_PER_PERSON}
                </p>
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={submitting || quotaLeft <= 0}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Mengirim suara...
                  </>
                ) : quotaLeft <= 0 ? (
                  "Kuota vote abis 😅"
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
            Pilih salah satu film di atas buat mulai voting.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
