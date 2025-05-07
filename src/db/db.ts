import { drizzle } from "drizzle-orm/node-postgres"
// @ts-expect-error Expecting
import { Pool } from "pg"

// Create a singleton connection pool
let connectionPool: Pool | null = null

function getConnectionPool() {
  if (!connectionPool) {
    connectionPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    })

    // Log when the pool is created
    console.log("✅ Database connection pool initialized")
  }
  return connectionPool
}

// Export a singleton drizzle instance with connection pooling
let drizzleInstance: any = null

export const db = async () => {
  if (!drizzleInstance) {
    const pool = getConnectionPool()
    drizzleInstance = drizzle(pool)
  }
  return drizzleInstance
}

// Handle cleanup on application shutdown
if (typeof process !== "undefined") {
  process.on("SIGINT", async () => {
    if (connectionPool) {
      await connectionPool.end()
      console.log("Database connection pool closed")
    }
    process.exit(0)
  })
}
