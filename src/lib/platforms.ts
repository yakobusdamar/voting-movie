import type { StreamingPlatform } from "@/lib/types";

export interface PlatformMeta {
  id: StreamingPlatform;
  label: string;
  className: string;
}

export const PLATFORMS: PlatformMeta[] = [
  { id: "netflix", label: "Netflix", className: "bg-red-500 text-white" },
  { id: "prime-video", label: "Prime Video", className: "bg-sky-500 text-white" },
  { id: "disney-plus", label: "Disney+ Hotstar", className: "bg-indigo-600 text-white" },
];

export function getPlatformMeta(id: StreamingPlatform): PlatformMeta {
  return PLATFORMS.find((p) => p.id === id) ?? PLATFORMS[0];
}

export function formatPlatforms(platforms: StreamingPlatform[]): string {
  return platforms.map((id) => getPlatformMeta(id).label).join(", ");
}
