"use client"

import Image from "next/image"
import { HugeiconsIcon } from "@hugeicons/react"
import { StarIcon, MinusSignIcon, PlusSignIcon } from "@hugeicons/core-free-icons"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useWatchlist, type WatchlistItem } from "@/lib/watchlist-store"

export function WatchlistCard({ item }: { item: WatchlistItem }) {
  const { toggleFavorite, setWatchedEpisodes } = useWatchlist()
  const hasTotal = item.total_episodes != null && item.total_episodes > 0
  const percent = hasTotal
    ? Math.min(100, (item.watched_episodes / item.total_episodes!) * 100)
    : 0

  return (
    <Card className="overflow-hidden py-0 gap-0">
      <div className="relative aspect-[2/3] w-full bg-muted">
        {item.image_url && (
          <Image
            src={item.image_url}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 50vw, 200px"
            className="object-cover"
          />
        )}
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-1 right-1 size-8 bg-background/70 backdrop-blur"
          onClick={() => toggleFavorite(item.anime_id)}
        >
          <HugeiconsIcon
            icon={StarIcon}
            className={item.is_favorite ? "fill-yellow-400 text-yellow-400" : ""}
          />
        </Button>
      </div>
      <CardContent className="p-3">
        <p className="line-clamp-2 text-sm font-medium">{item.title}</p>

        {hasTotal ? (
          <div className="mt-2 space-y-1">
            <Progress value={percent} />
            <p className="text-xs text-muted-foreground">
              {item.watched_episodes} / {item.total_episodes} episodes
            </p>
          </div>
        ) : (
          <p className="mt-2 text-xs text-muted-foreground">
            {item.watched_episodes} episodes watched
          </p>
        )}

        <div className="mt-2 flex items-center gap-2">
          <Button
            size="icon"
            variant="outline"
            className="size-7"
            onClick={() =>
              setWatchedEpisodes(item.anime_id, item.watched_episodes - 1)
            }
          >
            <HugeiconsIcon icon={MinusSignIcon} className="size-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="size-7"
            onClick={() =>
              setWatchedEpisodes(item.anime_id, item.watched_episodes + 1)
            }
          >
            <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
