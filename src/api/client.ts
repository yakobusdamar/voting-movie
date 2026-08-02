import { fallbackMovies } from "@/data/movies";
import type { ApiResponse, Movie, ResultItem, Vote } from "@/lib/types";

const API_BASE = import.meta.env.VITE_API_BASE as string | undefined;

export const API_CONFIGURED = Boolean(API_BASE);

async function request<T>(path: string, init?: RequestInit): Promise<ApiResponse<T>> {
  if (!API_BASE) {
    return { ok: false, error: "VITE_API_BASE belum dikonfigurasi" };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      signal: controller.signal,
    });

    let body: ApiResponse<T> | null = null;
    try {
      body = (await res.json()) as ApiResponse<T>;
    } catch {
      body = null;
    }

    if (!res.ok) {
      return {
        ok: false,
        error: body?.error ?? `Server error (${res.status})`,
      };
    }

    return body ?? { ok: true, data: undefined as T };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof DOMException && err.name === "AbortError"
        ? "Waktu tunggu habis. Coba lagi."
        : "Gagal terhubung ke server.",
    };
  } finally {
    clearTimeout(timeout);
  }
}

export function getMovies(): Promise<ApiResponse<Movie[]>> {
  return request<Movie[]>("/voting/movies");
}

export function submitVote(payload: { movieId: string; voterName: string }): Promise<ApiResponse<Vote>> {
  return request<Vote>("/voting/vote", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getResults(): Promise<ApiResponse<ResultItem[]>> {
  return request<ResultItem[]>("/voting/results");
}

export { fallbackMovies };
