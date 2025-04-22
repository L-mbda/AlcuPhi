import { db } from "@/db/db";
import { user } from "@/db/schema";
import { getSessionData } from "@/lib/session";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(data: NextRequest) {
    const connection = await db()
    const token = await getSessionData();
    if (token.action == 'continue' && token.credentials?.role != 'user') {
        const data = await connection.select({
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'role': user.role
        }).from(user)
        return NextResponse.json({
            'users': data
        })
    }
    return NextResponse.json({
        'message': 'Could not accept'
    }, {
        'status': 404
    })
}

export async function POST(data: NextRequest) {
    const connection = await db()
    const token = await getSessionData();
    const json = await data.json();
}