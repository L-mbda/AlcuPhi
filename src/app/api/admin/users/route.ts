import { db } from "@/db/db";
import { questionCollection, questionLog, session, user } from "@/db/schema";
import { getSessionData } from "@/lib/session";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(data: NextRequest) {
    const connection = await db()
    const token = await getSessionData();
    if (token.action == 'continue' && token.credentials?.role != 'user') {
        const data = await connection.select({
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'role': user.role,
            'active': user.active,
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
    if (json.action !== undefined && token.action == 'continue' && token.credentials?.role != 'user') {
        const roleHierarchy: Record<string, number> = {
            user: 0,
            admin: 1,
            owner: 2,
          }
        const currentRoleRank = roleHierarchy[token.credentials?.role]        
        const individuals = await connection.select({
            'role': user.role
        }).from(user).where(eq(user.id, json.id));
        if (individuals.length == 0) {
            return NextResponse.json({
                'message': 'Could not accept'
            },{status: 404})
        }
        const userRole = roleHierarchy[individuals[0].role];
        if (userRole >= currentRoleRank) {
            return NextResponse.json({
                'message': 'Couldn\'t accept'
            }, {status: 405})
        }
        // Promote
        if (json.action == 'promote' && token.credentials?.role == 'owner') {
            await connection.update(user).set({
                'role': 'admin'
            }).where(eq(user.id, json.id))
            return NextResponse.json({
                'message': 'OK'
            })
        // Demote
        } else if (json.action == 'demote' && token.credentials?.role == 'owner') {
            await connection.update(user).set({
                'role': 'user'
            }).where(eq(user.id, json.id))
            return NextResponse.json({
                'message': 'OK'
            })
        }  else if (json.action == 'suspend') {
            await connection.update(user).set({
                'active': 'suspended'
            }).where(eq(user.id, json.id))
            return NextResponse.json({
                'message': 'OK'
            })
        } else if (json.action == 'delete') {
            // Check systemquery
            await connection.insert(user).values({
                'name': 'service',
                'active': "active",
                'email': "service@alcuphi.me",
                'role': 'owner',
                'salt1': "INVALID_SALT",
                'salt2': "INVALID_SALT",
                'password': "NONE_REQUIRED_INVALID"
            }).onConflictDoNothing({ target: [user.email] })
            const systemquery = (await connection.select({
                id: user.id
            }).from(user).where(and(eq(user.name, 'service'), eq(user.email, 'service@alcuphi.me'), eq(user.role, 'owner'))))
            // Check and transfer to system as needed
            await connection.update(questionCollection).set({
                'creatorID': systemquery[0].id
            }).where(eq(questionCollection.creatorID, json.id))
            // Check and transfer to system as needed
            await connection.delete(questionLog)
            .where(eq(questionLog.userID, json.id))
            // Delete session
            await connection.delete(session).where(eq(session.userID, json.id));
            // Delete account
            await connection.delete(user).where(eq(user.id, json.id));

            return NextResponse.json({
                'message': 'OK'
            })
        } else if (json.action == 'reactivate') {
            await connection.update(user).set({
                'active': 'active'
            }).where(eq(user.id, json.id))
            return NextResponse.json({
                'message': 'OK'
            })
        }
    }
}