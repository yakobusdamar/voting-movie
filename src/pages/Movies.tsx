import { CloudAlert } from "lucide-react";

import { MovieCard } from "@/components/MovieCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMovies } from "@/hooks/useMovies";
import { Link } from "react-router-dom";

export function MoviesPage() {
  const { movies, isLoading, error, usingFallback } = useMovies();

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-2xl font-extrabold sm:text-3xl">Daftar Film</h1>
        <p className="text-muted-foreground">
          Film komedi Indonesia pilihan, dengan rating IMDb/lokal dan info platform streaming.
        </p>
      </section>

      {usingFallback ? (
        <Alert variant="warning">
          <CloudAlert className="h-4 w-4" aria-hidden="true" />
          <AlertTitle>Data lama</AlertTitle>
          <AlertDescription>
            Server voting lagi tidak terjangkau, jadi ini daftar dari pembaruan terakhir.
            {error ? ` (${error})` : ""}
          </AlertDescription>
        </Alert>
      ) : null}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-[2/3] w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}

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
