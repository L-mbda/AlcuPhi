import { cache } from "react"
import { Authentication } from "@/actions/authentication"

// Add a TTL (time-to-live) for the cache
const SESSION_CACHE_TTL = 60 * 1000 // 1 minute in milliseconds

// In-memory cache for session data
const sessionCache = new Map<string, { data: any; timestamp: number }>()

// Enhanced session data retrieval with TTL-based caching
export const getSessionData = cache(async () => {
  // Use a unique key for the current request (could be enhanced with user identifiers)
  const cacheKey = "current-session"

  // Check if we have a valid cached session
  const cachedSession = sessionCache.get(cacheKey)
  const now = Date.now()

  if (cachedSession && now - cachedSession.timestamp < SESSION_CACHE_TTL) {
    // Return cached data if it's still valid
    return cachedSession.data
  }

  // Otherwise fetch fresh session data
  const sessionData = await Authentication.verifySession()

  // Update the cache
  sessionCache.set(cacheKey, {
    data: sessionData,
    timestamp: now,
  })

  return sessionData
})
