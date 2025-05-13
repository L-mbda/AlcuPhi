import { db } from "@/db/db";
import { question, questionCollection, questionLog } from "@/db/schema";
import { fetchQuestion, generateQuestion } from "@/lib/questions/q";
import { getSessionData } from "@/lib/session";
import { and, count, desc, eq, gt, lt, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const connection = await db()
    const data = await request.json()
    const session = (await getSessionData());
    if (session.action != 'continue') {
        return NextResponse.json({'message': 'You are unauthorized to do this action.'},{status:403})
    }
    if (data.setID != undefined && data.method == 'GET_QUESTION' && data.intent == 0) {
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
    } else if (data.setID != undefined && data.method == 'GET_QUESTION' && data.intent == 1) {
        const query = await connection.select().from(questionLog).where(eq(questionLog.questionSet, data.setID));
        // If length is 0, give a random question to start off with
        if (query.length == 0) {
            return NextResponse.json({
                'question': generateQuestion('*', data.setID),
            })
        // Otherwise, begin adaptability
        } else {
            const questionSetCorrect = await connection.select({'correctAnswers': count(questionLog.correct)}).from(questionLog)
            .where(and(
                eq(session.credentials?.id, questionLog.userID),
                eq(questionLog.correct, true),
                eq(questionLog.questionSet, data.setID),
            ))
            const questionSetCount = await connection.select({'totalAnswers': count(questionLog.correct)}).from(questionLog)
            .where(and(
                eq(session.credentials?.id, questionLog.userID),
                eq(questionLog.questionSet, data.setID),
            ))
            const recentQuestion = await connection.select().from(questionLog)
            .where(and(
                eq(session.credentials?.id, questionLog.userID),
                eq(questionLog.questionSet, data.setID),
            ))
            .orderBy(desc(sql`CAST(${questionLog.timestamp} AS BIGINT)`)).limit(1)
            const weight = 0.6
            const accuracy = ((1.0*questionSetCorrect[0].correctAnswers)/questionSetCount[0].totalAnswers)
            const abilityEstimate = weight * accuracy + (1-weight) * (recentQuestion[0].correct ? 1 : 0)
            // @ts-expect-error We know that this would occur anyways
            const nextDifficulty = (fetchQuestion(recentQuestion[0].questionSetID).difficulty + 3 * (abilityEstimate - 0.6)) * 10     
            if (Math.max(0, Math.min(10, nextDifficulty)) > 7) {              
               // Grabbing an effectively random question from the DB
               return NextResponse.json({
                    'question': generateQuestion('*',data.setID,'hard'),                
                })
               // Medium
            } else if (Math.max(0, Math.min(10, nextDifficulty)) >4) {                
               // Grabbing an effectively random question from the DB
               return NextResponse.json({
                   'question': generateQuestion('*',data.setID,'medium'),                
               })
   
               // Easy otherwise
            } else {                
               // Grabbing an effectively random question from the DB
               return NextResponse.json({
                   'question': generateQuestion('*',data.setID,'easy'),                
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
        if (data.intent == 0) {
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
                }).from(questionLog).where(eq(questionLog.questionID,questions[0].id));
                const correctLogs = await connection.select({
                    correct: count(questionLog.correct)
                }).from(questionLog).where(and(eq(questionLog.questionID,questions[0].id), eq(questionLog.correct, true)));
                // Update question difficulty regardless of any action
                await connection.update(question).set({
                    'difficulty': 10-(correctLogs[0].correct/questionLogs[0].totalAttempts)*10
                }).where(eq(question.id, questions[0].id));
                // Else
                return NextResponse.json({"message": "success",
                "correctAnswer": questions[0].correctAnswer, 'correct': questions[0].correctAnswer.includes(('option-' + (parseInt(data.response.split('-')[1]) + 1)))})
            }    
        } else {
            // Else get from question sets and then if add if answer method isnt mcq
            const question = fetchQuestion(data.questionID);
            // @ts-expect-error
            if (question.answerMethod != 'multipleChoice') {
                await connection.insert(questionLog).values({
                    // @ts-expect-error Expecting lmao
                    'questionSet': question.id.split('.')[1],
                    // @ts-expect-error Expect this errors
                    'questionSetID': question.id,
                    // @ts-expect-error Expect this errors
                    'correct': data.response === question.answer,
                    'response': data.response,
                    'userID': session.credentials?.id,
                    'timestamp': (new Date()).getTime(),
                })
                // @ts-expect-error
                return NextResponse.json({"message": "success", "correctAnswer": [question.answer]})
            } else {
                await connection.insert(questionLog).values({
                    // @ts-expect-error Expecting lmao
                    'questionSet': question.id.split('.')[1],
                    // @ts-expect-error Expect this errors
                    'questionSetID': question.id,
                    // @ts-expect-error Expect this errors
                    'correct': data.response === question.answer,
                    'response': data.response,
                    'userID': session.credentials?.id,
                    'timestamp': (new Date()).getTime(),
                    // @ts-expect-error Expecting since its a bit diverse
                    'correct': question.answer.includes(('option-' + (parseInt(data.response.split('-')[1]) + 1))),
                })
                // Else
                return NextResponse.json({"message": "success",
                // @ts-expect-error Expect this errors
                "correctAnswer": question.answer, 'correct': question.answer.includes(('option-' + (parseInt(data.response.split('-')[1]) + 1))),})
            }
        }
   }
    return NextResponse.json({"message": "error"})
}