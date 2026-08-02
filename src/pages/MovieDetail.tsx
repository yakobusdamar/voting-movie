import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Ticket } from "lucide-react";

import { PlatformBadges } from "@/components/PlatformBadge";
import { RatingBadge } from "@/components/RatingBadge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMovies } from "@/hooks/useMovies";
import { formatPlatforms } from "@/lib/platforms";

const fallbackPoster =
  "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%22300%22%20height=%22450%22%3E%3Crect%20fill=%22%23ffd83d%22%20width=%22300%22%20height=%22450%22/%3E%3Ctext%20x=%22150%22%20y=%22225%22%20font-family=%22sans-serif%22%20font-size=%2224%22%20fill=%22%23000%22%20text-anchor=%22middle%22%3E%F0%9F%8E%AC%3C/text%3E%3C/svg%3E";

export function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { movies, isLoading, error } = useMovies();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <div className="grid gap-6 sm:grid-cols-[220px_1fr]">
          <Skeleton className="aspect-[2/3] w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  const movie = movies.find((m) => m.id === id);

  if (!movie) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/movies")}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Kembali
        </Button>
        <Alert variant="destructive">
          <AlertTitle>Film tidak ditemukan</AlertTitle>
          <AlertDescription>{error ?? "Film yang kamu cari tidak ada di daftar."}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate("/movies")}>
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Kembali ke daftar
      </Button>

      <div className="grid gap-6 sm:grid-cols-[220px_1fr]">
        <div className="mx-auto w-full max-w-[220px]">
          <img
            src={movie.poster ?? fallbackPoster}
            alt={`Poster ${movie.title}`}
            className="w-full rounded-sm border-2 border-neon-border object-cover shadow-neobrutal-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackPoster;
            }}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl leading-tight">{movie.title}</CardTitle>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
                {movie.year}
              </span>
              <span aria-hidden="true">·</span>
              <span>{movie.genre.join(", ")}</span>
            </div>
            <RatingBadge imdb={movie.ratings.imdb} local={movie.ratings.local} className="w-fit" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <h2 className="text-sm font-extrabold">Tersedia di</h2>
              <PlatformBadges platforms={movie.platforms} />
              <p className="text-xs text-muted-foreground">
                {formatPlatforms(movie.platforms)} · diverifikasi {movie.verifiedAt}
              </p>
            </div>

            {movie.synopsis ? (
              <div className="space-y-1.5">
                <h2 className="text-sm font-extrabold">Sinopsis</h2>
                <p className="text-sm text-muted-foreground">{movie.synopsis}</p>
              </div>
            ) : null}

            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link to={`/?movie=${movie.id}`}>
                <Ticket className="h-4 w-4" aria-hidden="true" />
                Vote Film Ini
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
