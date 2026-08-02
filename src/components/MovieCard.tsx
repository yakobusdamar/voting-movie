import { useNavigate } from "react-router-dom";

import { PlatformBadges } from "@/components/PlatformBadge";
import { RatingBadge } from "@/components/RatingBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Movie } from "@/lib/types";

interface MovieCardProps {
  movie: Movie;
  showDetailAction?: boolean;
}

const fallbackPoster =
  "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%22300%22%20height=%22450%22%3E%3Crect%20fill=%22%23ffd83d%22%20width=%22300%22%20height=%22450%22/%3E%3Ctext%20x=%22150%22%20y=%22225%22%20font-family=%22sans-serif%22%20font-size=%2224%22%20fill=%22%23000%22%20text-anchor=%22middle%22%3E%F0%9F%8E%AC%3C/text%3E%3C/svg%3E";

export function MovieCard({ movie, showDetailAction = false }: MovieCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <button
        type="button"
        onClick={() => navigate(`/movies/${movie.id}`)}
        className="block text-left"
        aria-label={`Lihat detail ${movie.title}`}
      >
        <div className="relative aspect-[2/3] w-full overflow-hidden border-b-2 border-neon-border bg-muted">
          <img
            src={movie.poster ?? fallbackPoster}
            alt={`Poster ${movie.title}`}
            loading="lazy"
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackPoster;
            }}
          />
        </div>
      </button>

      <CardHeader className="pb-2">
        <CardTitle className="text-lg leading-tight">{movie.title}</CardTitle>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>{movie.year}</span>
          <span aria-hidden="true">·</span>
          <span>{movie.genre.join(", ")}</span>
        </div>
        <RatingBadge imdb={movie.ratings.imdb} local={movie.ratings.local} className="w-fit" />
      </CardHeader>

      <CardContent className="pb-2 pt-0">
        <PlatformBadges platforms={movie.platforms} />
      </CardContent>

      {movie.synopsis ? (
        <CardContent className="pb-2 pt-0">
          <p className="line-clamp-2 text-sm text-muted-foreground">{movie.synopsis}</p>
        </CardContent>
      ) : null}

      {showDetailAction ? (
        <CardFooter className="mt-auto pt-2">
          <Button className="w-full" variant="accent" onClick={() => navigate(`/movies/${movie.id}`)}>
            Lihat Detail
          </Button>
        </CardFooter>
      ) : null}
    </Card>
  );
}
