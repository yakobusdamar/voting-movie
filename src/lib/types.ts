export type StreamingPlatform = "netflix" | "prime-video" | "disney-plus";

export interface Movie {
  id: string;
  title: string;
  year: number;
  genre: string[];
  platforms: StreamingPlatform[];
  verifiedAt: string;
  ratings: {
    imdb?: number;
    local?: number;
  };
  synopsis?: string;
}

export interface Vote {
  id: string;
  movieId: string;
  voterName: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

export interface ResultItem {
  movieId: string;
  count: number;
  title?: string;
}
