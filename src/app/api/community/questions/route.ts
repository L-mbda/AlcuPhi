import { db } from "@/db/db";
import { question, questionCollection } from "@/db/schema";
import { getSessionData } from "@/lib/session";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { stringify } from "querystring";

export async function POST(data: NextRequest) {
  const json = await data.json()
  const token = await getSessionData();
  // Preprocess
  if (json.type != undefined && token.action == 'continue') {
    // Check collection
    const collectionInfo = await (await db()).select().from(questionCollection).where(and(eq(questionCollection.publicID,json.collectionId),eq(token.credentials?.id,questionCollection.creatorID)))

    if (collectionInfo.length == 0) {
      return NextResponse.json({'message': "Permissions are invalid or the set could not be found."},{'status': 403})
    }
    // Check if MCQ
    if (json.type == 'multipleChoice') {
      // Clean up options
      let options = [];
      // Map and then stringify for it to not be seen as [object Object] in DB
      json.answer.options.map((option,i) => {
        options.push(stringify(option))
      })
      
      // Create the submission
      await (await db()).insert(question).values({
        'questionName': json.question,
        'collectionID': collectionInfo[0].id,
        'answerChoices': options,
        'correctAnswer': json.answer.correctAnswers,
        'type': 'multipleChoice',
        'questionCollectionTagName': collectionInfo[0].tags,
        'difficulty': 5.00,
      })
      return NextResponse.json({
        'message': 'Created question successfully'
      }, {
        'status': 201
      })
    } else if (json.type == 'freeResponse') {
      // Create submission
      await (await db()).insert(question).values({
        'questionName': json.question,
        'collectionID': collectionInfo[0].id,
        'answerChoices': [],
        'correctAnswer': [json.answer.text],
        'type': 'freeResponse',
        'questionCollectionTagName': collectionInfo[0].tags,
        'difficulty': 5.00,
      })
      // Return success
      return NextResponse.json({
        'message': 'Created question successfully'
      }, {
        'status': 201
      })
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
