'use server'

import { db } from "@/db/db";
import { question, questionCollection } from "@/db/schema";
import { getSessionData } from "@/lib/session";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function deleteQuestion(id:number) {
    const session = (await getSessionData());
    // Check if continue then continue
    if (session.action == 'continue') {
        const questionToDelete = await (await db()).select().from(question).where(eq(id, question.id));
        if (questionToDelete.length != 0) {
            const qset = await (await db()).select().from(questionCollection).where(eq(questionCollection.id, questionToDelete[0].collectionID))
            // Check
            if (qset.length != 0 && qset[0].creatorID == session.credentials?.id) {
                // Delete
                await (await db()).delete(question).where(eq(question.id, id));
                return redirect('/set/' + qset[0].publicID);
            }
        }
    }
}