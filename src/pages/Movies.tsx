import { Link } from "react-router-dom";

import { MovieCard } from "@/components/MovieCard";
import { Button } from "@/components/ui/button";
import { useMovies } from "@/hooks/useMovies";

export function MoviesPage() {
  const { movies } = useMovies();

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-2xl font-extrabold sm:text-3xl">Daftar Film</h1>
        <p className="text-muted-foreground">
          Film komedi Indonesia pilihan, dengan rating IMDb/lokal dan info platform streaming.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      <div className="flex flex-col items-stretch gap-3 border-t-2 border-dashed border-neon-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground">
          Sudah menentukan pilihan? Langsung vote sekarang.
        </p>
        <Button asChild size="lg">
          <Link to="/">Lanjut ke Voting</Link>
        </Button>
      </div>
    </div>
  );
}
