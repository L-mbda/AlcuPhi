// src/session.ts

import { cache } from "react";
import { Authentication } from "@/actions/authentication";
import { cookies } from "next/headers";

// TTL for cached sessions (1 minute)
const SESSION_CACHE_TTL = 60 * 1000;

// In‐memory cache keyed by JWT cookie value
const sessionCache = new Map<string, { data: any; timestamp: number }>();

export const getSessionData = cache(async () => {
  // Derive a per-user cache key from the JWT cookie
  const ck = await cookies();
  const token = ck.get("header")?.value ?? "";
  const cacheKey = `session:${token}`;

  const now = Date.now();
  const cached = sessionCache.get(cacheKey);
  if (cached && now - cached.timestamp < SESSION_CACHE_TTL) {
    return cached.data;
  }

  // Otherwise fetch fresh session data
  const sessionData = await Authentication.verifySession();

  sessionCache.set(cacheKey, { data: sessionData, timestamp: now });
  return sessionData;
});
