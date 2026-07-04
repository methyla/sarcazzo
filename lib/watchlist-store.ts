"use client"

import { useCallback, useSyncExternalStore } from "react"

// Temporary client-side store (localStorage) standing in for the Supabase
// `watchlist` table until backend/auth work is wired in. Shape mirrors the
// planned schema in spec/blueprints/data-model.md so swapping the persistence
// layer later doesn't require changing consumers of this hook.
export type WatchlistItem = {
  anime_id: number
  title: string
  image_url: string | null
  total_episodes: number | null
  watched_episodes: number
  is_favorite: boolean
  status: "watching" | "completed" | "dropped"
}

const STORAGE_KEY = "sarcazzo:watchlist"
const EMPTY_SNAPSHOT: WatchlistItem[] = []

type Listener = () => void
const listeners = new Set<Listener>()

let cachedSnapshot: WatchlistItem[] = EMPTY_SNAPSHOT
let cachedRaw: string | null = null

function readAll(): WatchlistItem[] {
  if (typeof window === "undefined") return EMPTY_SNAPSHOT
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw === cachedRaw) return cachedSnapshot
    cachedRaw = raw
    cachedSnapshot = raw ? (JSON.parse(raw) as WatchlistItem[]) : EMPTY_SNAPSHOT
    return cachedSnapshot
  } catch {
    cachedRaw = null
    cachedSnapshot = EMPTY_SNAPSHOT
    return EMPTY_SNAPSHOT
  }
}

function writeAll(items: WatchlistItem[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  listeners.forEach((l) => l())
}

function subscribe(listener: Listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useWatchlist() {
  const items = useSyncExternalStore(
    subscribe,
    readAll,
    () => EMPTY_SNAPSHOT
  )

  const addToList = useCallback((item: Omit<WatchlistItem, "watched_episodes" | "is_favorite" | "status">) => {
    const current = readAll()
    if (current.some((i) => i.anime_id === item.anime_id)) return
    writeAll([
      ...current,
      { ...item, watched_episodes: 0, is_favorite: false, status: "watching" },
    ])
  }, [])

  const isOnList = useCallback(
    (anime_id: number) => items.some((i) => i.anime_id === anime_id),
    [items]
  )

  const toggleFavorite = useCallback((anime_id: number) => {
    writeAll(
      readAll().map((i) =>
        i.anime_id === anime_id ? { ...i, is_favorite: !i.is_favorite } : i
      )
    )
  }, [])

  const setWatchedEpisodes = useCallback((anime_id: number, watched: number) => {
    writeAll(
      readAll().map((i) =>
        i.anime_id === anime_id
          ? { ...i, watched_episodes: Math.max(0, watched) }
          : i
      )
    )
  }, [])

  const setStatus = useCallback(
    (anime_id: number, status: WatchlistItem["status"]) => {
      writeAll(
        readAll().map((i) => (i.anime_id === anime_id ? { ...i, status } : i))
      )
    },
    []
  )

  return { items, addToList, isOnList, toggleFavorite, setWatchedEpisodes, setStatus }
}
