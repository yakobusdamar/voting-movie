import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AppHeader } from "@/components/AppHeader";
import { MovieDetailPage } from "@/pages/MovieDetail";
import { MoviesPage } from "@/pages/Movies";
import { ResultsPage } from "@/pages/Results";
import { VotePage } from "@/pages/Vote";

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="flex min-h-dvh flex-col">
        <AppHeader />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:py-8">
          <Routes>
            <Route path="/" element={<VotePage />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/movies/:id" element={<MovieDetailPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="*" element={<VotePage />} />
          </Routes>
        </main>
        <footer className="border-t-2 border-neon-border bg-background">
          <div className="mx-auto max-w-5xl px-4 py-4 text-center text-xs text-muted-foreground">
            OMK Lingkungan FX · Nonton bareng besok 🍿
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
