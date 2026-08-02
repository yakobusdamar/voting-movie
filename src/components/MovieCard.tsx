import { useNavigate } from "react-router-dom";

import { RatingBadge } from "@/components/RatingBadge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { Movie } from "@/lib/types";

const fallbackPoster =
  "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%22300%22%20height=%22450%22%3E%3Crect%20fill=%22%23ffd83d%22%20width=%22300%22%20height=%22450%22/%3E%3Ctext%20x=%22150%22%20y=%22225%22%20font-family=%22sans-serif%22%20font-size=%2224%22%20fill=%22%23000%22%20text-anchor=%22middle%22%3E%F0%9F%8E%AC%3C/text%3E%3C/svg%3E";

export function MovieCard({ movie }: { movie: Movie }) {
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
