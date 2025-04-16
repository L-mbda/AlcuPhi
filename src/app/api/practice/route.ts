import { db } from "@/db/db";
import { question, questionCollection, questionLog } from "@/db/schema";
import { getSessionData } from "@/lib/session";
import { and, asc, count, desc, eq, gt, lt, sql } from "drizzle-orm";
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
        const questionSetCount = await (connection).select({
            'totalAnswers': count(questionLog.correct),            
        // @ts-expect-error We should expect this to occur
        }).from(questionLog).where(and(eq(questionLog.collectionID, setInformation[0].id), eq(questionLog.userID, session.credentials?.id)))
        .leftJoin(question, eq(questionLog.questionID, sql`CAST(${question.id} as varchar)`))
        // .groupBy(sql`
        //     CASE
        //       WHEN ${question.difficulty} > 7 THEN 'difficult'
        //       WHEN ${question.difficulty} > 4 THEN 'medium'
        //       ELSE 'easy'
        //     END
        //   `);
        const questionSetCorrect = await (connection).select({
            'correctAnswers': count(questionLog.correct),            
        // @ts-expect-error We should expect this to occur
        }).from(questionLog).where(and(eq(questionLog.collectionID, setInformation[0].id), eq(questionLog.userID, session.credentials?.id), eq(questionLog.correct, true)))
        .leftJoin(question, eq(questionLog.questionID, sql`CAST(${question.id} as varchar)`))
        .groupBy(sql`
            CASE
              WHEN ${question.difficulty} > 7 THEN 'difficult'
              WHEN ${question.difficulty} > 4 THEN 'medium'
              ELSE 'easy'
            END
          `);
        // const questionCorrectDifficulty = await (connection).select({
        //     'difficulty': sql`
        //         CASE
        //             WHEN ${question.difficulty} > 7 THEN 'difficult'
        //             WHEN ${question.difficulty} > 4 THEN 'medium'
        //             ELSE 'easy'
        //         END
        //     `,
        //     'correct': count(question.difficulty)
        // // @ts-expect-error We should expect this to occur
        // }).from(questionLog).where(and(eq(questionLog.collectionID, setInformation[0].id), eq(questionLog.userID, session.credentials?.id), eq(questionLog.correct, true)))
        // .leftJoin(question, eq(questionLog.questionID, sql`CAST(${question.id} as varchar)`))
        // .groupBy(sql`
        //     CASE
        //       WHEN ${question.difficulty} > 7 THEN 'difficult'
        //       WHEN ${question.difficulty} > 4 THEN 'medium'
        //       ELSE 'easy'
        //     END
        //   `);
        // Get previous question
        const query = await connection.select({
            'correct': questionLog.correct,
            'timestamp': questionLog.timestamp,
            'type': question.type,
            'id': question.id,
            'difficulty': question.difficulty
          }).from(questionLog).where(and(
            // @ts-expect-error We should expect this to occur
            eq(questionLog.userID, session.credentials?.id),
            eq(questionLog.collectionID, setInformation[0].id),
          ))
          .leftJoin(question, eq(sql`CAST(${question.id} AS VARCHAR)`, questionLog.questionID))
          .orderBy(desc(sql`CAST(${questionLog.timestamp} AS BIGINT)`)).limit(1)
        // If logs are 0, be generous
        if (questionSetCount[0].totalAnswers == 0) {
            // Generate questions and grab a random one
            const questions = await (connection).select({
                'id': question.id,
                'type': question.type,
                'questionName': question.questionName,
                'answerChoices': question.answerChoices,            
            }).from(question).where(and(eq(question.collectionID, setInformation[0].id)))
            // Grabbing an effectively random question from the DB
            return NextResponse.json({
                'question': questions[Math.trunc(Math.random() * questions.length)]
            })
        // Begin the algorithm based on total stats
        } else {
            /*
            Logic happens here
            */
            //    Ability estimate
            const weight = 0.6
            const accuracy = ((1.0*questionSetCorrect[0].correctAnswers)/questionSetCount[0].totalAnswers)
            const abilityEstimate = weight * accuracy + (1-weight) * (query[0].correct ? 1 : 0)
            // @ts-expect-error We know that this would occur anyways
            const nextDifficulty = (query[0].difficulty + 3 * (abilityEstimate - 0.6)) * 10     
            if (Math.max(0, Math.min(10, nextDifficulty)) > 7) {
                // Generate questions and grab a random one
                let questions = await (connection).select({
                   'id': question.id,
                   'type': question.type,
                   'questionName': question.questionName,
                   'answerChoices': question.answerChoices,            
               }).from(question).where(and(eq(question.collectionID, setInformation[0].id), gt(question.difficulty, 7)))
                //    If questions are 0, grab random one
                if (questions.length == 0) {
                    questions = await (connection).select({
                        'id': question.id,
                        'type': question.type,
                        'questionName': question.questionName,
                        'answerChoices': question.answerChoices,            
                    }).from(question).where(and(eq(question.collectionID, setInformation[0].id)))        
                }
               // Grabbing an effectively random question from the DB
               return NextResponse.json({
                   'question': questions[Math.trunc(Math.random() * questions.length)]
               })
               // Medium
            } else if (Math.max(0, Math.min(10, nextDifficulty)) >4) {
                // Generate questions and grab a random one
                let questions = await (connection).select({
                   'id': question.id,
                   'type': question.type,
                   'questionName': question.questionName,
                   'answerChoices': question.answerChoices,            
               }).from(question).where(and(eq(question.collectionID, setInformation[0].id), gt(question.difficulty, 4), lt(question.difficulty, 7)))
                //    If questions are 0, grab random one
                if (questions.length == 0) {
                    questions = await (connection).select({
                        'id': question.id,
                        'type': question.type,
                        'questionName': question.questionName,
                        'answerChoices': question.answerChoices,            
                    }).from(question).where(and(eq(question.collectionID, setInformation[0].id)))        
                }
               // Grabbing an effectively random question from the DB
               return NextResponse.json({
                   'question': questions[Math.trunc(Math.random() * questions.length)]
               })
   
               // Easy otherwise
            } else {
                // Generate questions and grab a random one
                let questions = await (connection).select({
                   'id': question.id,
                   'type': question.type,
                   'questionName': question.questionName,
                   'answerChoices': question.answerChoices,            
               }).from(question).where(and(eq(question.collectionID, setInformation[0].id), lt(question.difficulty, 4)))
                //    If questions are 0, grab random one
                if (questions.length == 0) {
                    questions = await (connection).select({
                        'id': question.id,
                        'type': question.type,
                        'questionName': question.questionName,
                        'answerChoices': question.answerChoices,            
                    }).from(question).where(and(eq(question.collectionID, setInformation[0].id)))        
                }
               // Grabbing an effectively random question from the DB
               return NextResponse.json({
                   'question': questions[Math.trunc(Math.random() * questions.length)]
               })
            }
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
        const collectionData = await connection.select().from(questionCollection).where(eq(questionCollection.id, questions[0].collectionID))
        await connection.update(questionCollection).set({
            'plays': collectionData[0].plays + 1
        }).where(eq(questionCollection.id, collectionData[0].id))
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
            // Check logs
            const questionLogs = await connection.select({
                totalAttempts: count(questionLog.timestamp)
            // @ts-expect-error Expected
            }).from(questionLog).where(eq(questionLog.questionID,questions[0].id));
            const correctLogs = await connection.select({
                correct: count(questionLog.correct)
            // @ts-expect-error Expected
            }).from(questionLog).where(and(eq(questionLog.questionID,questions[0].id), eq(questionLog.correct, true)));
            // Update question difficulty regardless of any action
            await connection.update(question).set({
                'difficulty': 10-(correctLogs[0].correct/questionLogs[0].totalAttempts)*10
            }).where(eq(question.id, questions[0].id));
            // Else
            return NextResponse.json({"message": "success",
            "correctAnswer": questions[0].correctAnswer, 'correct': questions[0].correctAnswer.includes(('option-' + (parseInt(data.response.split('-')[1]) + 1)))})
        }
    }
    return NextResponse.json({"message": "error"})
}