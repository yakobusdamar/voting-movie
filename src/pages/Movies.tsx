import { Link } from "react-router-dom";
import { CalendarClock } from "lucide-react";

import { MovieCard } from "@/components/MovieCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { MOVIE_NIGHT } from "@/lib/event";
import { useMovies } from "@/hooks/useMovies";

export function MoviesPage() {
  const { movies } = useMovies();

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-2xl font-extrabold sm:text-3xl">Daftar Film 🎬</h1>
        <p className="text-muted-foreground">
          Film komedi Indonesia pilihan lengkap sama rating. Klik film buat liat detail & di mana
          aja bisa nontonnya.
        </p>
      </section>

      <Alert variant="default" className="bg-primary">
        <CalendarClock className="h-4 w-4" aria-hidden="true" />
        <AlertTitle>Nonton bareng {MOVIE_NIGHT.fullLabel}</AlertTitle>
        <AlertDescription>
          Udah siap pilih film? Gas vote sekarang!
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      <div className="flex flex-col items-stretch gap-3 border-t-2 border-dashed border-neon-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground">Udah nemu film inceran? Gas langsung vote.</p>
        <Button asChild size="lg">
          <Link to="/">Lanjut ke Voting</Link>
        </Button>
      </div>
    </div>
  );
}
