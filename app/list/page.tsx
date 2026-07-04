"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { StarIcon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { WatchlistCard } from "@/components/watchlist-card"
import { useWatchlist } from "@/lib/watchlist-store"
import { cn } from "@/lib/utils"

export default function ListPage() {
  const { items } = useWatchlist()
  const [favoritesOnly, setFavoritesOnly] = useState(false)

  const visible = favoritesOnly ? items.filter((i) => i.is_favorite) : items

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold">My List</h1>
        <Button
          size="sm"
          variant={favoritesOnly ? "default" : "outline"}
          onClick={() => setFavoritesOnly((v) => !v)}
        >
          <HugeiconsIcon
            icon={StarIcon}
            className={cn("mr-1 size-4", favoritesOnly && "fill-current")}
          />
          Favorites only
        </Button>
      </div>

      {visible.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {favoritesOnly
            ? "No favorites yet."
            : "Your list is empty — add anime from Schedule, Search, or Calendar."}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {visible.map((item) => (
            <WatchlistCard key={item.anime_id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
