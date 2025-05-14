/*
    AlcuPhi Recommendation Engine
    ©2025 Horizon Labs, Inc. All Rights Reserved.
*/
import { db } from "@/db/db";
import { questionCollection, questionLog } from "@/db/schema";
import { Mistral } from "@mistralai/mistralai";
import { and, arrayOverlaps, eq, not, sql } from "drizzle-orm";

const mistral = new Mistral({
    apiKey: process.env['MISTRAL_API_KEY']
})
const connection = await db()

export async function recommendSetsByID(accuracy: number, setID: number, userID: number) {    
    const setInformation = await connection.select().from(questionCollection).where(eq(questionCollection.id, setID));
    const relatedSets = await connection
    .select()
    .from(questionCollection)
    .where(
    and(
        arrayOverlaps(questionCollection.tags, setInformation[0].tags),         // overlap on any tag
        not(eq(questionCollection.id, setID))                 // exclude self
    ))

    const result = await mistral.chat.complete({
        model: "mistral-small-latest",
        messages: [
        { role: "system", content: "You are an Neural Engine utilized in the AlcuPhi adaptive physics learning application for recommending sets, please be this. Provide only an array for the sets that you recommend (only the ID) and only if the sets exist because I know you are not doing that, and ONLY use the available sets provided. If there are none, return an empty array. DO Not add any responses apart from the array with the JSON information for your recommended set (ONLY IF THEY EXIST, NO HALLUCINATING and use the RELATED_SETS part of the prompt, if theres only one related set, give that), thanks!" },
        { role: "user", content: `Please recommend me some sets based on my accuracy and sets in the same topics and are relevant given the set characteristics. My accuracy is ${accuracy}% in the set called ${setInformation[0].name}
        with the description ${setInformation[0].content}. The tags for the set are ${setInformation[0].tags} and the related sets that are available in the system are
        [RELATED_SETS]=${JSON.stringify(relatedSets)}. I know theres atleast one related set available because of the tag, so provide that in the format and give based on the name, publicID, and description seen with the related sets.
        ` }
        ]
    });    
    // @ts-expect-error Expecting because we dunno
    const raw = result.choices[0]?.message.content;
    let recommendations;
    try {
        // @ts-expect-error Expecting because we dunno
        recommendations = JSON.parse(raw);
    } catch (e) {
        // @ts-expect-error Expecting because we dunno
        const match = raw.match(/\[.*\]/s);
        recommendations = match ? JSON.parse(match[0]) : [];
    }

    return recommendations
}