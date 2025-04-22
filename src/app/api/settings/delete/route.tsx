import { db } from "@/db/db";
import { getSessionData } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import * as crypto from 'crypto'
import { question, questionCollection, user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(request: NextRequest) {
    const connection = await db();
    const data = await request.json();
    const token = await getSessionData();
    if (data.password != undefined && token.action == 'continue') {
        // @ts-expect-error Expecting since we know
        const credentials = await connection.select().from(user).where(eq(user.id, token.credentials?.id))
        // Check password
        let password = crypto
        .createHash("sha3-256")
        .update(data.password + "")
        .digest("hex");
        password = crypto
        .createHash("sha3-512")
        .update(credentials[0].salt1 + password + credentials[0].salt2)
        .digest("hex");
        // If success, delete        
        if (credentials[0].password == password && credentials[0].role != 'owner') {
            // Check systemquery
            const systemquery = await connection.insert(user).values({
                'name': 'service',
                'active': "active",
                'email': "service@alcuphi.me",
                'role': 'owner',
                'salt1': "INVALID_SALT",
                'salt2': "INVALID_SALT",
                'password': "NONE_REQUIRED_INVALID"
            }).onConflictDoNothing({
                'target': user.email
            }).returning({
                id: user.id
            })    
            // Check and transfer to system as needed
            await connection.update(questionCollection).set({
                'creatorID': systemquery[0].id
            // @ts-expect-error I know this would occur
            }).where(eq(questionCollection.creatorID, token.credentials?.id))
            // @ts-expect-error Expecting again
            await connection.delete(user).where(eq(user.id, token.credentials?.id));
            // Return response
            return NextResponse.json({
                'message': 'Sorry to see you go! Your account has been deleted.'
            }, {
              'status': 201  
            })        
        } else {
            // Return response
            return NextResponse.json({
                'message': 'Could not be deleted due to incorrect password or insufficient permissions.'
            }, {
              'status': 406
            })        
        }
    }
    // Return json
    return NextResponse.json({
        'message': 'Sorry to see you go! Your account has been deleted.'
    }, {
      'status': 404  
    })
}