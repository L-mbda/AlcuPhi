import { db } from "@/db/db";
import { question, questionCollection, questionLog } from "@/db/schema";
import { getSessionData } from "@/lib/session";
import { and, count, eq, lt, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const connection = await db()
    const data = await request.json()
    const session = (await getSessionData());
    if (session.action != 'continue') {
        return NextResponse.json({'message': 'You are unauthorized to do this action.'},{status:403})
    }
    if (data.setID != undefined && data.method == 'GET_QUESTION') {
        const setInformation = await (connection).select().from(questionCollection).where(eq(data.setID, questionCollection.publicID))
        if (setInformation.length == 0) {
            return NextResponse.json({
                'message': "Set doesn't exist, boy!"
            }, {
                status: 404,
            })
        }
        // Define info
        const questionSetLogs = await (connection).select({
            'correctAnswers': count(questionLog.correct),
            'difficulty': sql`
                CASE
                    WHEN ${question.difficulty} > 7 THEN 'difficult'
                    WHEN ${question.difficulty} > 4 THEN 'medium'
                    ELSE 'easy'
                END
            `,
        // @ts-expect-error We should expect this to occur
        }).from(questionLog).where(and(eq(questionLog.collectionID, setInformation[0].id), eq(questionLog.userID, session.credentials?.id)))
        .leftJoin(question, eq(questionLog.questionID, sql`CAST(${question.id} as varchar)`))
        .groupBy(sql`
            CASE
              WHEN ${question.difficulty} > 7 THEN 'difficult'
              WHEN ${question.difficulty} > 4 THEN 'medium'
              ELSE 'easy'
            END
          `);
        // If logs are 0, be generous
        if (questionSetLogs.length == 0 || questionSetLogs.length != 0) {
            // Generate questions and grab a random one
            const questions = await (connection).select({
                'id': question.id,
                'type': question.type,
                'questionName': question.questionName,
                'answerChoices': question.answerChoices,            
            }).from(question).where(and(eq(question.collectionID, setInformation[0].id), lt(question.difficulty, 7)))
            // Grabbing an effectively random question from the DB
            return NextResponse.json({
                'question': questions[Math.trunc(Math.random() * questions.length)]
            })
        }
    }
    return NextResponse.json({
        'question': 'NONE'
    }); 
}

// Question log submission and more
export async function PATCH(request: NextRequest) {
    const connection = await db()
    const data = await request.json()
    const session = (await getSessionData());
    if (session.action == 'continue' && data.questionID != undefined && data.response != undefined) {
        const questions = await connection.select().from(question).where(eq(data.questionID, question.id))
        // If question length is 0, return fail
        if (questions.length == 0) {
            return NextResponse.json({"message": "failed to submit to question log, question doesn't exist?"}, {'status': 404})
        }
        // Continue
        if (questions[0].type != 'multipleChoice') {
            await connection.insert(questionLog).values({
                // @ts-expect-error We should expect this to occur
                'userID': session.credentials?.id,
                'correct': true,
                'response': data.response,
                'timestamp': (new Date()).getTime(),
                'questionID': questions[0].id,
                'collectionID': questions[0].collectionID,
            })
            return NextResponse.json({"message": "success", "correctAnswer": questions[0].correctAnswer})
        } else {
            await connection.insert(questionLog).values({
                // @ts-expect-error We should expect this to occur
                'userID': session.credentials?.id,
                'correct': questions[0].correctAnswer.includes(('option-' + (parseInt(data.response.split('-')[1]) + 1))),
                'response': data.response,
                'timestamp': (new Date()).getTime(),
                'questionID': questions[0].id,
                'collectionID': questions[0].collectionID,
            })            
            return NextResponse.json({"message": "success",
                "correctAnswer": questions[0].correctAnswer, 'correct': questions[0].correctAnswer.includes(('option-' + (parseInt(data.response.split('-')[1]) + 1)))})
        }
    }
    return NextResponse.json({"message": "error"})
}