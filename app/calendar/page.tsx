import { getSchedules, groupByWeekday, WEEKDAY_ORDER } from "@/lib/jikan"
import { AnimeCard } from "@/components/anime-card"

export default async function CalendarPage() {
  const anime = await getSchedules()
  const grouped = groupByWeekday(anime)

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-2xl font-semibold">Calendar</h1>
      {WEEKDAY_ORDER.map((day) => {
        const dayAnime = grouped.get(day) ?? []
        if (dayAnime.length === 0) return null
        return (
          <section key={day} className="space-y-3">
            <h2 className="text-lg font-medium">{day}</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {dayAnime.map((item) => (
                <AnimeCard key={item.mal_id} anime={item} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
