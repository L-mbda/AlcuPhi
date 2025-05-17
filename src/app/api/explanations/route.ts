import { explainQuestion } from "@/lib/engine";
import { NextRequest, NextResponse } from "next/server";

export async function POST(data: NextRequest) {
    const json = await data.json();
    // Check if attempt exists
    if (json.attempt != undefined) {
        return NextResponse.json({
          explanation: await explainQuestion(json.attempt),  
        })
    }
    // Return if null
    return NextResponse.json({
        explanation: "There is no \"attempt\" attribute passed with the question information."
    }, {status: 400})
}