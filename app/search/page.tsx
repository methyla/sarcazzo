"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { AnimeCard } from "@/components/anime-card"
import { Skeleton } from "@/components/ui/skeleton"
import { searchAnime, dedupeByMalId, type JikanAnime } from "@/lib/jikan"

const DEBOUNCE_MS = 800

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<JikanAnime[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query.trim()) {
      return
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect -- debounce timer needs to flip loading on immediately
    setLoading(true)
    const timeout = setTimeout(() => {
      searchAnime(query)
        .then((results) => setResults(dedupeByMalId(results)))
        .finally(() => setLoading(false))
    }, DEBOUNCE_MS)

    return () => clearTimeout(timeout)
  }, [query])

  const showEmpty = !query.trim()

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-2xl font-semibold">Search</h1>
      <Input
        placeholder="Search for an anime..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="max-w-md"
      />

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[2/3] w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {(showEmpty ? [] : results).map((item) => (
            <AnimeCard key={item.mal_id} anime={item} />
          ))}
        </div>
      )}
    </div>
  )
}
