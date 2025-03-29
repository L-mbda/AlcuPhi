"use server";

import { db } from "@/db/db";
import { question, questionCollection } from "@/db/schema";
import { getSessionData } from "@/lib/session";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function deleteQuestion(id: number) {
  const session = await getSessionData();
  // Check if continue then continue
  if (session.action == "continue") {
    const questionToDelete = await (
      await db()
    )
      .select()
      .from(question)
      // @ts-expect-error We know this will occur
      .where(eq(id, question.id));
    if (questionToDelete.length != 0) {
      const qset = await (await db())
        .select()
        .from(questionCollection)
        .where(eq(questionCollection.id, questionToDelete[0].collectionID));
      // Check
      if (qset.length != 0 && qset[0].creatorID == session.credentials?.id) {
        // Delete
        await (await db()).delete(question).where(eq(question.id, id));
        return redirect("/set/" + qset[0].publicID);
      }
    }
  }
}

export async function deleteSet(id: string | null) {
  const session = await getSessionData();
  // Check if continue then continue
  if (session.action == "continue") {
    const set = await (
      await db()
    )
      .select()
      .from(questionCollection)
      // @ts-expect-error We know this will occur
      .where(eq(questionCollection.publicID, id));
    if (set.length != 0 && set[0].creatorID == session.credentials?.id) {
      // Delete all questions
      await (await db())
        .delete(question)
        .where(eq(question.collectionID, set[0].id));
      // Delete collection now
      await (await db())
        .delete(questionCollection)
        .where(eq(questionCollection.id, set[0].id));
    }
  }
  return "OK";
}
