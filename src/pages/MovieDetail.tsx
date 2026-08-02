import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Ticket } from "lucide-react";

import { PlatformBadges } from "@/components/PlatformBadge";
import { RatingBadge } from "@/components/RatingBadge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMovies } from "@/hooks/useMovies";
import { formatPlatforms } from "@/lib/platforms";

export function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { movies } = useMovies();
  const navigate = useNavigate();

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
          <AlertDescription>Film yang kamu cari tidak ada di daftar.</AlertDescription>
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
              <Link to="/">
                <Ticket className="h-4 w-4" aria-hidden="true" />
                Vote Film Ini
              </Link>
            </Button>
          </CardContent>
        </Card>
    </div>
  );
}
