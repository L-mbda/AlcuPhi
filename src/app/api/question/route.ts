import { db } from "@/db/db";
import { questionLog } from "@/db/schema";
import { fetchQuestion, generateQuestion } from "@/lib/questions/q";
import { getSessionData } from "@/lib/session";
import { desc, eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

/*
  Get question log
*/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
  const token = await getSessionData();
  if (token.action == "continue") {
    const questionLogData = await (
      await db()
    )
      .select()
      .from(questionLog)
      // @ts-expect-error Expected because of token.credentials.id
      .where(eq(questionLog.userID, token.credentials.id))
      // Order by timestamp
      .orderBy(desc(sql`CAST(${questionLog.timestamp} AS BIGINT)`))
      .limit(5);
    return NextResponse.json({ questionLog: questionLogData });
  }
  return NextResponse.json({ message: "Hello" });
}

// POST Request, Question Algorithm :)
export async function POST(request: NextRequest) {
  const token = await getSessionData();
  const data = await request.json();
  if (token.action == "continue") {
    // Mainly for getting the question
    // TODO: Create the question algorithm
    if (data.type == "REQUEST") {
      const question = generateQuestion("*");
      console.log(question);
      // @ts-expect-error Expected because of question
      if (question.id.startsWith("qset.")) {
        return NextResponse.json({
          question: question,
          qset: true,
        });
      }
      return NextResponse.json({ question: question, qset: false });
      // Second option is for answering the question
    } else if (data.type == "ANSWER") {
      // Complex logic I don't know what I am doing
      const question = await fetchQuestion(data.questionID);
      // Check if the question exists and is correct, if it is, then return a success message
      if (question !== undefined) {
        if (question.answer == data.response) {
          // Update log
          await (await db()).insert(questionLog).values({
            // @ts-expect-error Expected since there'll be "mismatch"
            correct: true,
            question: question.id.toString(),
            userID: token.credentials?.id,
            timestamp: new Date().getTime(),
            questionID: question.id,
          });
          return NextResponse.json(
            { message: "Correct", correct: true },
            {
              status: 201,
            },
          );
        } else {
          // Update log and return incorrect
          await (await db()).insert(questionLog).values({
            // @ts-expect-error Expected since there'll be "mismatch"
            correct: false,
            question: question.id.toString(),
            userID: token.credentials?.id,
            timestamp: new Date().getTime(),
            questionID: question.id,
          });
          return NextResponse.json(
            {
              message: "Incorrect",
              correct: false,
              correctAnswer: question.answer,
            },
            {
              status: 201,
            },
          );
        }
      }
      return NextResponse.json(
        { message: "Question does not exist." },
        {
          status: 404,
        },
      );
    }
  }
  return NextResponse.json(
    { message: "Unauthenticated." },
    {
      status: 401,
    },
  );
}
