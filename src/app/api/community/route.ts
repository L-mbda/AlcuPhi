import { db } from "@/db/db";
import { question, questionCollection, questionLog, user } from "@/db/schema";
import { getSessionData } from "@/lib/session";
import { and, count, desc, eq, sql } from "drizzle-orm";
import { Pi } from "lucide-react";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  // Get token, data, and more
  const token = await getSessionData();
  const data = await request.json();
  // Authentication pipeline
  if (token.action == "continue") {
    // Create SET
    if (data.operation == "CREATE_SET") {
      // Generate a PublicID (alphanumeric) while length is not equal to 0, preventing conflict
      let publicID = Math.random().toString(36).slice(2);
      while (
        (
          await (await db())
            .select()
            .from(questionCollection)
            .where(eq(questionCollection.publicID, publicID))
        ).length != 0
      ) {
        publicID = Math.random().toString(36).slice(2);
      }
      // Insert in DB and then return
      const dbInfo = await (
        await db()
      )
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
        });

      return NextResponse.json({
        message: "Success!",
        status: "success",
        setID: dbInfo[0].id,
      });
    }
  }
  return NextResponse.json({
    message: "Failure.",
    status: "failure",
  });
}

// Check if request is DELETE
export async function DELETE(request: NextRequest) {
  // Get token, data, and more
  const token = await getSessionData();
  const requestData = await request.json();
  // Check and run
  if (
    token.action == "continue" &&
    requestData.method != undefined &&
    requestData.method == "DELETE_SET"
  ) {
    const data = await (await db())
      .select()
      .from(questionCollection)
      .where(eq(questionCollection.id, requestData?.id));
    // Check if set is under control and then respond
    if (
      data.length != 0 &&
      (data[0].creatorID == token.credentials?.id ||
        token.credentials?.role != "user")
    ) {
      // DELETE EVERYTHING RELATED!
      // Delete from questionLog
      await (await db())
        .delete(questionLog)
        .where(eq(questionLog.collectionID, data[0].id));
      // Delete from question
      await (await db())
        .delete(question)
        .where(eq(question.collectionID, data[0].id));
      // Delete from collection
      await (await db())
        .delete(questionCollection)
        .where(eq(questionCollection.id, data[0].id));
      // Return success
      return NextResponse.json(
        {
          status: "success",
        },
        {
          status: 202,
        },
      );
    }
    // Return unknown set
    return NextResponse.json(
      {
        status: "unknown set",
      },
      {
        status: 404,
      },
    );
  }
  // Return failure
  return NextResponse.json(
    {
      status: "failure",
    },
    {
      status: 405,
    },
  );
}

// POST Function for Sets
export async function POST(req: NextRequest) {
  const data = await req.json();
  if (data.method == "GET_SETS") {
    // Get tags
    let tags = data.tags;
    // Get range
    const range = data.range;
    let query = [];
    // Create variable for sets in network
    let setsInNetwork = 0;
    if (data.userID != undefined) {
      // Check if tags arent undefined or if
      // their length isnt 0
      if (tags != undefined && tags.length != 0) {
        // Make tags lowercase
        tags = tags.map((tag: string) => tag.toLowerCase());
        // Create SQL query to be able to use in WHERE clause
        // for finding if a tag exists in the array for any collection
        // row, without case sensitivity
        const sqlQuery = sql`
          EXISTS (
            SELECT 1
            FROM unnest(${questionCollection.tags}) AS x
            WHERE lower(x) = ANY(${sql.raw(`ARRAY['${tags.join("','")}']::varchar[]`)})
          )
        `;
        // Query for sets with tags
        query = await (
          await db()
        )
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
          // Query for selection
          .where(
            and(
              sqlQuery,
              eq(questionCollection.creatorID, parseInt(data.userID)),
            ),
          )
          .limit(data.rangeLimit)
          .offset(range - data.rangeLimit)
          .leftJoin(user, eq(user.id, questionCollection.creatorID))
          .fullJoin(question, eq(question.collectionID, questionCollection.id))
          .groupBy(questionCollection.id, user.name)
          .orderBy(desc(questionCollection.plays));
        // Grabbing sets from query
        setsInNetwork = (
          await (
            await db()
          )
            .select({
              amount: count(),
            })
            .from(questionCollection)
            .where(
              and(
                sqlQuery,
                eq(questionCollection.creatorID, parseInt(data.userID)),
              ),
            )
        )[0].amount;
      } else {
        // Query for sets (wildcard)
        query = await (
          await db()
        )
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
          .where(eq(questionCollection.creatorID, parseInt(data.userID)))
          .limit(data.rangeLimit)
          .offset(range - data.rangeLimit)
          .leftJoin(user, eq(user.id, questionCollection.creatorID))
          .fullJoin(question, eq(question.collectionID, questionCollection.id))
          .groupBy(questionCollection.id, user.name)
          .orderBy(desc(questionCollection.plays));
        // General purpose grab
        setsInNetwork = (
          await (
            await db()
          )
            .select({
              amount: count(),
            })
            .from(questionCollection)
            .where(eq(questionCollection.creatorID, parseInt(data.userID)))
        )[0].amount;
      }
    } else {
      // Check if tags arent undefined or if
      // their length isnt 0
      if (tags != undefined && tags.length != 0) {
        // Make tags lowercase
        tags = tags.map((tag: string) => tag.toLowerCase());
        // Create SQL query to be able to use in WHERE clause
        // for finding if a tag exists in the array for any collection
        // row, without case sensitivity
        const sqlQuery = sql`
          EXISTS (
            SELECT 1
            FROM unnest(${questionCollection.tags}) AS x
            WHERE lower(x) = ANY(${sql.raw(`ARRAY['${tags.join("','")}']::varchar[]`)})
          )
        `;
        // Query for sets with tags
        query = await (
          await db()
        )
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
          // Query for selection
          .where(sqlQuery)
          .limit(data.rangeLimit)
          .offset(range - data.rangeLimit)
          .leftJoin(user, eq(user.id, questionCollection.creatorID))
          .fullJoin(question, eq(question.collectionID, questionCollection.id))
          .groupBy(questionCollection.id, user.name)
          .orderBy(desc(questionCollection.plays));
        // Grabbing sets from query
        setsInNetwork = (
          await (
            await db()
          )
            .select({
              amount: count(),
            })
            .from(questionCollection)
            .where(sqlQuery)
        )[0].amount;
      } else {
        // Query for sets (wildcard)
        query = await (
          await db()
        )
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
          .limit(data.rangeLimit)
          .offset(range - data.rangeLimit)
          .leftJoin(user, eq(user.id, questionCollection.creatorID))
          .fullJoin(question, eq(question.collectionID, questionCollection.id))
          .groupBy(questionCollection.id, user.name)
          .orderBy(desc(questionCollection.plays));
        // General purpose grab
        setsInNetwork = (
          await (
            await db()
          )
            .select({
              amount: count(),
            })
            .from(questionCollection)
        )[0].amount;
      }
    }
    return NextResponse.json({
      status: "success",
      sets: query,
      setsInNetwork: setsInNetwork,
    });
  }
  // Return set
  return NextResponse.json({
    explanation: "This method allows you to get the information about a set",
  });
}

export async function PUT(request: NextRequest) {
  const data = await request.json();
  const session = await getSessionData();
  if (session.action == "continue" && data.publicID != undefined) {
    // Check if User is ownere
    const query = await (await db())
      .select()
      .from(questionCollection)
      .where(eq(questionCollection.publicID, data.publicID));
    if (query.length != 0 && query[0].creatorID == session.credentials?.id || session.credentials?.role != 'user') {
      // Update collection
      await (
        await db()
      )
        .update(questionCollection)
        .set({
          content: data.description,
          name: data.name,
          tags: data.tags,
        })
        .where(eq(questionCollection.publicID, data.publicID));
      return NextResponse.json(
        {
          status: "success",
          message: "Collection has been updated successfully.",
        },
        {
          status: 200,
        },
      );
    }
  }
  return NextResponse.json(
    {
      status: "failure",
      message:
        "You aren't authorized to update the collection or the collection doesn't exist.",
    },
    {
      status: 403,
    },
  );
}
