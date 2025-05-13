import { db } from "@/db/db"
import { question, questionCollection, questionLog, user } from "@/db/schema"
import { getSessionData } from "@/lib/session"
import { and, count, desc, eq, sql } from "drizzle-orm"
import { type NextRequest, NextResponse } from "next/server"
import { apiCache } from "@/lib/cache"

export async function PATCH(request: NextRequest) {
  try {
    // Get token, data, and more
    const token = await getSessionData()
    const data = await request.json()
    
    // Authentication pipeline
    if (token.action !== "continue") {
      return NextResponse.json({
        message: "Failure.",
        status: "failure",
      })
    }
    
    // Create SET
    if (data.operation === "CREATE_SET") {
      const connection = await db()
      
      // Generate a PublicID (alphanumeric) while length is not equal to 0, preventing conflict
      let publicID = Math.random().toString(36).slice(2)
      
      // Use a more efficient approach to check for ID conflicts
      let attempts = 0
      const maxAttempts = 5
      
      while (attempts < maxAttempts) {
        const existingSet = await connection
          .select({ count: count() })
          .from(questionCollection)
          .where(eq(questionCollection.publicID, publicID))
        
        if (existingSet[0].count === 0) {
          break
        }
        
        publicID = Math.random().toString(36).slice(2)
        attempts++
      }
      
      if (attempts >= maxAttempts) {
        return NextResponse.json({
          message: "Failed to generate unique ID after multiple attempts.",
          status: "failure",
        })
      }
      
      // Insert in DB and then return
      const dbInfo = await connection
        .insert(questionCollection)
        .values({
          name: data.setName,
          content: data.setDescription,
          tags: data.setTags,
          publicID: publicID,
          creatorID: token.credentials?.id,
        })
        .returning({
          id: questionCollection.publicID,
        })
      
      // Clear cache when new set is created
      apiCache.clear()
      
      return NextResponse.json({
        message: "Success!",
        status: "success",
        setID: dbInfo[0].id,
      })
    }
    
    return NextResponse.json({
      message: "Failure.",
      status: "failure",
    })
  } catch (error) {
    console.error("Error in community PATCH:", error)
    return NextResponse.json(
      { message: "Server error", status: "failure" },
      { status: 500 }
    )
  }
}

// Check if request is DELETE
export async function DELETE(request: NextRequest) {
  try {
    // Get token, data, and more
    const token = await getSessionData()
    const requestData = await request.json()
    
    // Check and run
    if (token.action !== "continue" || requestData.method === undefined || requestData.method !== "DELETE_SET") {
      return NextResponse.json(
        { status: "failure" },
        { status: 405 }
      )
    }
    
    const connection = await db()
    const data = await connection
      .select()
      .from(questionCollection)
      .where(eq(questionCollection.id, requestData?.id))
    
    // Check if set is under control and then respond
    if (data.length === 0 || (data[0].creatorID !== token.credentials?.id && token.credentials?.role === "user")) {
      return NextResponse.json(
        { status: "unknown set" },
        { status: 404 }
      )
    }
    
    // Use a transaction for the delete operation
    // @ts-expect-error
    await connection.transaction(async (tx) => {
      // Delete from questionLog
      await tx.delete(questionLog).where(eq(questionLog.collectionID, data[0].id))
      // Delete from question
      await tx.delete(question).where(eq(question.collectionID, data[0].id))
      // Delete from collection
      await tx.delete(questionCollection).where(eq(questionCollection.id, data[0].id))
    })
    
    // Clear cache when set is deleted
    apiCache.clear()
    
    // Return success
    return NextResponse.json(
      { status: "success" },
      { status: 202 }
    )
  } catch (error) {
    console.error("Error in community DELETE:", error)
    return NextResponse.json(
      { status: "failure", message: "Server error" },
      { status: 500 }
    )
  }
}

// POST Function for Sets
export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    
    // Cache key based on request parameters
    const cacheKey = `community-sets-${JSON.stringify(data)}`
    
    // Use cache for sets data with 1-minute TTL for read operations
    return await apiCache.getOrSet(
      cacheKey,
      async () => {
        if (data.method !== "GET_SETS") {
          return NextResponse.json({
            explanation: "This method allows you to get the information about a set",
          })
        }
        
        const connection = await db()
        // Get tags
        let tags = data.tags
        // Get range
        const range = data.range
        let query = []
        // Create variable for sets in network
        let setsInNetwork = 0
        
        // Optimize query building
        const baseQuery = connection
          .select({
            publicID: questionCollection.publicID,
            name: questionCollection.name,
            description: questionCollection.content,
            tags: questionCollection.tags,
            creator: user.name,
            plays: questionCollection.plays,
            questions: count(question),
          })
          .from(questionCollection)
          .leftJoin(user, eq(user.id, questionCollection.creatorID))
          .fullJoin(question, eq(question.collectionID, questionCollection.id))
          .groupBy(questionCollection.id, user.name)
          .orderBy(desc(questionCollection.plays))
          .limit(data.rangeLimit)
          .offset(range - data.rangeLimit)
        
        // Build where clause based on parameters
        if (data.userID !== undefined) {
          const userFilter = eq(questionCollection.creatorID, Number.parseInt(data.userID))
          
          if (tags !== undefined && tags.length !== 0) {
            // Make tags lowercase
            tags = tags.map((tag: string) => tag.toLowerCase())
            
            // Create SQL query for tag filtering
            const sqlQuery = sql`
              EXISTS (
                SELECT 1
                FROM unnest(${questionCollection.tags}) AS x
                WHERE lower(x) = ANY(${sql.raw(`ARRAY['${tags.join("','")}']::varchar[]`)})
              )
            `
            
            // Query with both user and tags filters
            query = await baseQuery.where(and(sqlQuery, userFilter))
            
            // Count total matching sets
            setsInNetwork = (
              await connection
                .select({ amount: count() })
                .from(questionCollection)
                .where(and(sqlQuery, userFilter))
            )[0].amount
          } else {
            // Query with only user filter
            query = await baseQuery.where(userFilter)
            
            // Count total matching sets
            setsInNetwork = (
              await connection
                .select({ amount: count() })
                .from(questionCollection)
                .where(userFilter)
            )[0].amount
          }
        } else {
          if (tags !== undefined && tags.length !== 0) {
            // Make tags lowercase
            tags = tags.map((tag: string) => tag.toLowerCase())
            
            // Create SQL query for tag filtering
            const sqlQuery = sql`
              EXISTS (
                SELECT 1
                FROM unnest(${questionCollection.tags}) AS x
                WHERE lower(x) = ANY(${sql.raw(`ARRAY['${tags.join("','")}']::varchar[]`)})
              )
            `
            
            // Query with tags filter
            query = await baseQuery.where(sqlQuery)
            
            // Count total matching sets
            setsInNetwork = (
              await connection
                .select({ amount: count() })
                .from(questionCollection)
                .where(sqlQuery)
            )[0].amount
          } else {
            // Query without filters
            query = await baseQuery
            
            // Count total matching sets
            setsInNetwork = (
              await connection
                .select({ amount: count() })
                .from(questionCollection)
            )[0].amount
          }
        }
        
        return NextResponse.json({
          status: "success",
          sets: query,
          setsInNetwork: setsInNetwork,
        })
      },
      60000 // 1 minute TTL
    )
  } catch (error) {
    console.error("Error in community POST:", error)
    return NextResponse.json(
      { status: "error", message: "Server error" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  const data = await request.json()
  const session = await getSessionData()
  if (session.action == "continue" && data.publicID != undefined) {
    // Check if User is ownere
    const query = await (await db())
      .select()
      .from(questionCollection)
      .where(eq(questionCollection.publicID, data.publicID))
    if ((query.length != 0 && query[0].creatorID == session.credentials?.id) || session.credentials?.role != "user") {
      // Update collection
      await (await db())
        .update(questionCollection)
        .set({
          content: data.description,
          name: data.name,
          tags: data.tags,
        })
        .where(eq(questionCollection.publicID, data.publicID))
      return NextResponse.json(
        {
          status: "success",
          message: "Collection has been updated successfully.",
        },
        {
          status: 200,
        },
      )
    }
  }
  return NextResponse.json(
    {
      status: "failure",
      message: "You aren't authorized to update the collection or the collection doesn't exist.",
    },
    {
      status: 403,
    },
  )
}
