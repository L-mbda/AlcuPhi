import { explainQuestion } from "@/lib/engine";
import { NextRequest, NextResponse } from "next/server";
import {createHash} from 'crypto'
import { db } from "@/db/db";
import { getSessionData } from "@/lib/session";
import { explanations } from "@/db/schema";
import { eq } from "drizzle-orm";

const connection = await db(); // DB

export async function POST(data: NextRequest) {
    const json = await data.json();
    const session = await getSessionData();
    // Check if attempt exists
    if (json.attempt != undefined && session.action == 'continue') {
        if (json.attempt.type == 'multipleChoice') {
            // Seed generator (if MCQ)
            const seed = createHash('SHA512').update(json.attempt.answerChoices.toString() + json.attempt.name + json.attempt.type+json.attempt.correctAnswer).digest('hex');
            const query = await connection.select().from(explanations).where(eq(explanations.seed, seed));
            // Cache if query length is 0
            if (query.length == 0) {
                const explanation = await explainQuestion(json.attempt);
                await connection.insert(explanations).values({
                    'seed': seed,
                    'explanation': explanation
                })
                // Return response
                return NextResponse.json({
                    explanation
                })
            } else {
                return NextResponse.json({
                    explanation: query[0].explanation,  
                })
            }
        }
        return NextResponse.json({
            explanation: await explainQuestion(json.attempt),  
        })
    }
    // Return if null
    return NextResponse.json({
        explanation: "There is no \"attempt\" attribute passed with the question information or you are unauthenticated."
    }, {status: 400})
}