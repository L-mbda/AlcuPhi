import { NextRequest, NextResponse } from "next/server";

export async function POST(data: NextRequest) {
  return NextResponse.json(
    {
      message: "An error occured while creating the question",
    },
    { status: 500 },
  );
}
