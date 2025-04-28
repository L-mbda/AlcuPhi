import { db } from "@/db/db";
import { question, questionCollection, questionLog } from "@/db/schema";
import { fetchQuestion, generateQuestion } from "@/lib/questions/q";
import { getSessionData } from "@/lib/session";
import { and, asc, desc, eq, sql } from "drizzle-orm";
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
  const connection = await db();
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
    // Question log backend
    } else if (data.type == 'GET_DATA') {
      let set,query = undefined;
      // If Not Nan
      if (data.intent !== undefined && data.intent == 0) {
        // Get the set
        set = await (connection.select({
          'id': questionCollection.id
        }).from(questionCollection).where(eq(data.collectionID, questionCollection.publicID)));
        if (set.length == 0) {
          return NextResponse.json({
            'message': 'Set collection not passed.'
          },{status: 406})
        }
        // Get data
        query = await connection.select({
          'correct': questionLog.correct,
          'timestamp': questionLog.timestamp,
          'type': question.type,
          'name': question.questionName,
          'answerChoices': question.answerChoices,
          'correctAnswer': question.correctAnswer,
          'response': questionLog.response
        }).from(questionLog).where(and(
          // @ts-expect-error We should expect this to occur
          eq(questionLog.userID, token.credentials?.id),
          eq(questionLog.collectionID, set[0].id),
        ))
        .leftJoin(question, eq(sql`CAST(${question.id} AS VARCHAR)`, questionLog.questionID))
        .orderBy(desc(sql`CAST(${questionLog.timestamp} AS BIGINT)`)).limit(data.limit);
        return NextResponse.json({
          'message': 'success',
          'response': query
        });  
        // If NaN
      } else {
        // Make array
        const setQuestionArray = [];
        // Make db query
        const newInfo = await connection.select().from(questionLog).where(and(
          eq(questionLog.questionSet, data.collectionID),
          // @ts-expect-error Expecting lmao
          eq(questionLog.userID, token.credentials?.id)
        ))
        .orderBy(desc(sql`CAST(${questionLog.timestamp} AS BIGINT)`)).limit(data.limit);
        // For
        for (let i = 0; i < newInfo.length;i++) {
          const query = fetchQuestion(newInfo[i].questionID)
          if (query != null) {
            if (query.answerMethod == 'multipleChoice') {
              setQuestionArray.push({
                'name': query.question,
                'response': newInfo[i].response,
                'correct': newInfo[i].correct,
                'timestamp': newInfo[i].timestamp,
                'type': query.answerMethod,
                'correctAnswer': query.answer,
                'answerChoices': query.options
                // 'logInfo': 
              });  
            } else {
              setQuestionArray.push({
                'name': query.question,
                'response': newInfo[i].response,
                'correct': newInfo[i].correct,
                'timestamp': newInfo[i].timestamp,
                'type': query.answerMethod,
                'correctAnswer': [query.answer],
                'answerChoices': []
                // 'logInfo': 
              });  
            }
          }
        }
        return NextResponse.json({
          'message': 'success',
          'response': setQuestionArray,
        });  
      }
    }
  }
  return NextResponse.json(
    { message: "Unauthenticated." },
    {
      status: 401,
    },
  );
}
