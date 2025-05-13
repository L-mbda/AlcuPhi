type CacheEntry<T> = {
    data: T
    timestamp: number
  }
  
  class APICache {
    private cache: Map<string, CacheEntry<any>> = new Map()
    private defaultTTL: number = 60 * 1000 // 1 minute in milliseconds
  
    /**
     * Get a value from the cache
     * @param key Cache key
     * @param ttl Time-to-live in milliseconds (optional)
     * @returns The cached value or undefined if not found or expired
     */
    get<T>(key: string, ttl?: number): T | undefined {
      const entry = this.cache.get(key)
      const now = Date.now()
      const maxAge = ttl || this.defaultTTL
  
      if (entry && now - entry.timestamp < maxAge) {
        return entry.data as T
      }
  
      // Remove expired entry
      if (entry) {
        this.cache.delete(key)
      }
  
      return undefined
    }
  
    /**
     * Set a value in the cache
     * @param key Cache key
     * @param data Data to cache
     */
    set<T>(key: string, data: T): void {
      this.cache.set(key, {
        data,
        timestamp: Date.now(),
      })
    }
  
    /**
     * Delete a value from the cache
     * @param key Cache key
     */
    delete(key: string): void {
      this.cache.delete(key)
    }
  
    /**
     * Clear all values from the cache
     */
    clear(): void {
      this.cache.clear()
    }
  
    /**
     * Get or set a value in the cache using a factory function
     * @param key Cache key
     * @param factory Function to create the value if not in cache
     * @param ttl Time-to-live in milliseconds (optional)
     * @returns The cached or newly created value
     */
    async getOrSet<T>(key: string, factory: () => Promise<T>, ttl?: number): Promise<T> {
      const cached = this.get<T>(key, ttl)
      if (cached !== undefined) {
        return cached
      }
  
      const data = await factory()
      this.set(key, data)
      return data
    }
  }
  
  // Export a singleton instance
  export const apiCache = new APICache()
  