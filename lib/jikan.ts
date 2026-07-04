const JIKAN_BASE = "https://api.jikan.moe/v4"

export type JikanAnime = {
  mal_id: number
  title: string
  images: { webp: { image_url: string; large_image_url: string } }
  episodes: number | null
  status: string
  broadcast: { day: string | null; string: string | null }
}

type JikanListResponse = { data: JikanAnime[] }

export async function getSeasonNow(): Promise<JikanAnime[]> {
  const res = await fetch(`${JIKAN_BASE}/seasons/now`, {
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error(`Jikan /seasons/now failed: ${res.status}`)
  const json: JikanListResponse = await res.json()
  return json.data
}

export async function getSchedules(): Promise<JikanAnime[]> {
  const res = await fetch(`${JIKAN_BASE}/schedules`, {
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error(`Jikan /schedules failed: ${res.status}`)
  const json: JikanListResponse = await res.json()
  return json.data
}

export async function searchAnime(query: string): Promise<JikanAnime[]> {
  const res = await fetch(
    `${JIKAN_BASE}/anime?q=${encodeURIComponent(query)}&limit=20`
  )
  if (!res.ok) throw new Error(`Jikan /anime search failed: ${res.status}`)
  const json: JikanListResponse = await res.json()
  return json.data
}

export const WEEKDAY_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const

export function dedupeByMalId(anime: JikanAnime[]): JikanAnime[] {
  const seen = new Set<number>()
  return anime.filter((item) => {
    if (seen.has(item.mal_id)) return false
    seen.add(item.mal_id)
    return true
  })
}

export function groupByWeekday(anime: JikanAnime[]) {
  const deduped = dedupeByMalId(anime)
  const groups = new Map<string, JikanAnime[]>(
    WEEKDAY_ORDER.map((day) => [day, []])
  )
  for (const item of deduped) {
    const day = item.broadcast?.day
    if (day && groups.has(day)) {
      groups.get(day)!.push(item)
    }
  }
  return groups
}
