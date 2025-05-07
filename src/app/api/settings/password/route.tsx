import { db } from "@/db/db";
import { user } from "@/db/schema";
import { getSessionData } from "@/lib/session";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import * as crypto from 'crypto'

export async function PUT(data: NextRequest) {
    const connection = await db();
    const json = await data.json();
    const token = await getSessionData();
    // Conditions check
    if (token.action == 'continue' && json.currentPassword != undefined && json.newPassword != undefined) {
        const userInfo = await connection.select({
            'salt1': user.salt1,
            'salt2': user.salt2,
            'password': user.password
        }).from(user).where(eq(user.id, token.credentials?.id))
        if (userInfo.length != 1) {
            return NextResponse.json({
                'message': 'Could not accept due to the user not existing'
            }, {
                'status': 418
            });
        }                
        let password = await crypto
            .createHash("sha3-256")
            .update(json.currentPassword + "")
            .digest("hex");
        password = await crypto
            .createHash("sha3-512")
            .update(userInfo[0].salt1 + password + userInfo[0].salt2)
            .digest("hex");
        if (password != userInfo[0].password) {
            return NextResponse.json({
                'message': "Current password is not the correct password provided."
            }, {
                'status': 403
            })
        }
        password = await crypto
            .createHash("sha3-256")
            .update(json.newPassword + "")
            .digest("hex");
        password = await crypto
            .createHash("sha3-512")
            .update(userInfo[0].salt1 + password + userInfo[0].salt2)
            .digest("hex");

        if (password == userInfo[0].password) {
            return NextResponse.json({
                'message': "New password cannot be the same as the old password."
            }, {
                'status': 406
            })
        }
        // Create the salting variables
        const salt1 = crypto.randomBytes(256).toString("hex");
        const salt2 = crypto.randomBytes(256).toString("hex");
        password = await crypto
            .createHash("sha3-256")
            .update(json.newPassword + "")
            .digest("hex");
        password = await crypto
            .createHash("sha3-512")
            .update(salt1 + password + salt2)
            .digest("hex");
        await connection.update(user).set({
            'salt1': salt1,
            'salt2': salt2,
            'password': password,
        }).where(eq(user.id, token.credentials?.id))
        return NextResponse.json({
            'message': 'Process succeeded'
        })
        
    }
    // Return json
    return NextResponse.json({
        'message': 'Could not process due to invalid password input or session.'
    }, {
        'status': 405
    })
}