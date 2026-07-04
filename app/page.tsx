import { getSeasonNow, dedupeByMalId } from "@/lib/jikan"
import { AnimeCard } from "@/components/anime-card"

export default async function SchedulePage() {
  const anime = dedupeByMalId(await getSeasonNow())

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-2xl font-semibold">
        Currently Airing
      </h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {anime.map((item) => (
          <AnimeCard key={item.mal_id} anime={item} />
        ))}
      </div>
    </div>
  )
}
