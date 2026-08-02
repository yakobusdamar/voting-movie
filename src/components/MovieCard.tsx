import { useNavigate } from "react-router-dom";

import { RatingBadge } from "@/components/RatingBadge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { Movie } from "@/lib/types";

export function MovieCard({ movie }: { movie: Movie }) {
  const navigate = useNavigate();

  return (
    <Card
      className="flex h-full cursor-pointer flex-col overflow-hidden hover:bg-muted"
      onClick={() => navigate(`/movies/${movie.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          navigate(`/movies/${movie.id}`);
        }
      }}
      aria-label={`Lihat detail ${movie.title}`}
    >
      <CardHeader className="gap-1 p-3">
        <CardTitle className="text-base leading-tight">{movie.title}</CardTitle>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          <span>{movie.year}</span>
          <span aria-hidden="true">·</span>
          <span className="line-clamp-1">{movie.genre.join(", ")}</span>
          <span aria-hidden="true">·</span>
          <RatingBadge imdb={movie.ratings.imdb} local={movie.ratings.local} />
        </div>
      </CardHeader>
    </Card>
  );
}
