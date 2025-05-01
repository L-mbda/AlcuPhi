// @ts-nocheck
import { db } from "@/db/db";
import { question, questionCollection } from "@/db/schema";
import { getSessionData } from "@/lib/session";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { stringify } from "querystring";

export async function POST(data: NextRequest) {
  const json = await data.json();
  const token = await getSessionData();
  // Preprocess
  if (json.type != undefined && token.action == "continue") {
    // Check collection
    const collectionInfo = await (
      await db()
    )
      .select()
      .from(questionCollection)
      .where(
        and(
          eq(questionCollection.publicID, json.collectionId),
        ),
      );

    if (collectionInfo.length == 0 || (collectionInfo[0].creatorID != token.credentials.id && token.credentials.role == 'user')) {
      return NextResponse.json(
        { message: "Permissions are invalid or the set could not be found." },
        { status: 403 },
      );
    }
    // Check if MCQ
    if (json.type == "multipleChoice") {
      // Clean up options
      /* eslint-disable */
      let options = [];
      // Map and then stringify for it to not be seen as [object Object] in DB
      json.answer.options.map((option, i) => {
        options.push(stringify(option));
      });

      // Create the submission
      await (await db()).insert(question).values({
        questionName: json.question,
        collectionID: collectionInfo[0].id,
        // @ts-expect-error We know this will occur
        answerChoices: options,
        correctAnswer: json.answer.correctAnswers,
        type: "multipleChoice",
        questionCollectionTagName: collectionInfo[0].tags,
        difficulty: 5.0,
      });
      return NextResponse.json(
        {
          message: "Created question successfully",
        },
        {
          status: 201,
        },
      );
    } else if (json.type == "freeResponse") {
      // Create submission
      await (await db()).insert(question).values({
        questionName: json.question,
        collectionID: collectionInfo[0].id,
        answerChoices: [],
        correctAnswer: [json.answer.text],
        type: "freeResponse",
        questionCollectionTagName: collectionInfo[0].tags,
        difficulty: 5.0,
      });
      // Return success
      return NextResponse.json(
        {
          message: "Created question successfully",
        },
        {
          status: 201,
        },
      );
    }
  }
  // Return error
  return NextResponse.json(
    {
      message: "An error occured while creating the question",
    },
    { status: 500 },
  );
}

export async function PUT(data: NextRequest) {
  const json = await data.json();
  console.log(json);
  const session = await getSessionData();
  const token = session;
  if (session.action == "continue" && json.id !== null) {
    const data = await (
      await db()
    )
      .select()
      .from(question)
      .where(eq(question.id, parseInt(json.id)));

    if (data.length != 0) {
      // Check collection
      const collectionInfo = await (
        await db()
      )
        .select()
        .from(questionCollection)
        .where(
          and(
            eq(questionCollection.id, json.collectionID),
          ),
        );
        if (collectionInfo.length == 0 || (collectionInfo[0].creatorID != token.credentials.id && token.credentials.role == 'user')) {
          return NextResponse.json(
          { message: "Permissions are invalid or the set could not be found." },
          { status: 403 },
        );
      }
      // Check if type
      if (json.type == "freeResponse") {
        await (await db()).update(question).set({
          questionName: json.questionName,
          type: json.type,
          questionCollectionTagName: collectionInfo[0].tags,
          answerChoices: [],
          correctAnswer: json.correctAnswer,
        });
      } else {
        const fixedChoices = [];
        for (let i = 0; i < json.answerChoices.length; i++) {
          fixedChoices.push("text=" + json.answerChoices[i])
        }
        await (await db()).update(question).set({
          questionName: json.questionName,
          type: json.type,
          questionCollectionTagName: collectionInfo[0].tags,
          answerChoices: fixedChoices,
          correctAnswer: json.correctAnswer,
        });
      }
      return NextResponse.json(
        {
          message: "SUCCESS",
        },
        { status: 201 },
      );
    }
  }
  // Return error
  return NextResponse.json(
    {
      message: "An error occured while creating the question",
    },
    { status: 500 },
  );
}
