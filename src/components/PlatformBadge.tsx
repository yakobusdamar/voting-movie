import { getPlatformMeta } from "@/lib/platforms";
import type { StreamingPlatform } from "@/lib/types";

export function PlatformBadge({ platform }: { platform: StreamingPlatform }) {
  const meta = getPlatformMeta(platform);
  return (
    <span
      className={`inline-flex items-center rounded-sm border-2 border-neon-border px-2 py-0.5 text-xs font-bold shadow-neobrutal-sm ${meta.className}`}
    >
      {meta.label}
    </span>
  );
}

export function PlatformBadges({ platforms }: { platforms: StreamingPlatform[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {platforms.map((p) => (
        <PlatformBadge key={p} platform={p} />
      ))}
    </div>
  );
}
