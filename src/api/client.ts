import type { ApiResponse, ResultItem, Vote } from "@/lib/types";

const API_BASE = import.meta.env.VITE_API_BASE as string | undefined;
const API_TOKEN = import.meta.env.VITE_API_TOKEN as string | undefined;

export const API_CONFIGURED = Boolean(API_BASE && API_TOKEN);

async function request<T>(path: string, init?: RequestInit): Promise<ApiResponse<T>> {
  if (!API_BASE) {
    return { ok: false, error: "VITE_API_BASE belum dikonfigurasi" };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN ?? ""}`,
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

    // n8n kadang balik objek mentah (bukan wrapper {ok,data}) — normalisasi.
    // Body boleh object apa pun atau kosong; status 200 = sukses.
    if (body && typeof body === "object" && "ok" in body) {
      return body;
    }

    return { ok: true, data: body as T };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof DOMException && err.name === "AbortError"
        ? "Server lama bales. Coba lagi ya!"
        : "Gagal terhubung ke server.",
    };
  } finally {
    clearTimeout(timeout);
  }
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
