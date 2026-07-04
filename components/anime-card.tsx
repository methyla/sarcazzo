"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useWatchlist } from "@/lib/watchlist-store"
import type { JikanAnime } from "@/lib/jikan"

export function AnimeCard({ anime }: { anime: JikanAnime }) {
  const { addToList, isOnList } = useWatchlist()
  const onList = isOnList(anime.mal_id)

  return (
    <Card className="overflow-hidden py-0 gap-0">
      <div className="relative aspect-[2/3] w-full bg-muted">
        {anime.images?.webp?.large_image_url && (
          <Image
            src={anime.images.webp.large_image_url}
            alt={anime.title}
            fill
            sizes="(max-width: 768px) 50vw, 200px"
            className="object-cover"
          />
        )}
      </div>
      <CardContent className="p-3">
        <p className="line-clamp-2 text-sm font-medium">{anime.title}</p>
        {anime.episodes != null && (
          <Badge variant="secondary" className="mt-2">
            {anime.episodes} eps
          </Badge>
        )}
      </CardContent>
      <CardFooter className="p-3 pt-0">
        <Button
          size="sm"
          variant={onList ? "secondary" : "default"}
          disabled={onList}
          className="w-full"
          onClick={() =>
            addToList({
              anime_id: anime.mal_id,
              title: anime.title,
              image_url: anime.images?.webp?.large_image_url ?? null,
              total_episodes: anime.episodes,
            })
          }
        >
          {onList ? "Already added" : "Add to List"}
        </Button>
      </CardFooter>
    </Card>
  )
}
