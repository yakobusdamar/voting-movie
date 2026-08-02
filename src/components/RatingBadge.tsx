import { Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RatingBadgeProps {
  imdb?: number;
  local?: number;
  className?: string;
}

export function RatingBadge({ imdb, local, className }: RatingBadgeProps) {
  const primary = imdb ?? local;
  if (!primary) return null;

  return (
    <Badge variant="outline" className={cn("gap-1 bg-yellow-200", className)}>
      <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
      <span>{primary.toFixed(1)}</span>
      <span className="font-normal text-muted-foreground">{imdb ? "IMDb" : "Rating"}</span>
      {imdb && local ? (
        <span className="font-normal text-muted-foreground">· {local.toFixed(1)} lokal</span>
      ) : null}
    </Badge>
  );
}
