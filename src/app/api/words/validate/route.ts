import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { word } = await req.json();

    if (!word) {
      return NextResponse.json(
        { error: "Missing 'word' in request body" },
        { status: 400 }
      );
    }

    const apiKey = process.env.DICTIONARY_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Dictionary API key not configured" },
        { status: 500 }
      );
    }

    const res = await fetch(
      `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${apiKey}`
    );

    if (!res.ok) {
      throw new Error(`Dictionary API error: ${res.status}`);
    }

    const data = await res.json();

    // Check if the first entry is an object with `meta` (definition entry)
    const isValid =
      Array.isArray(data) &&
      data.length > 0 &&
      typeof data[0] === "object" &&
      !!data[0].meta;

    return NextResponse.json({ isValid });
  } catch (error) {
    console.error("Word validation error:", error);
    return NextResponse.json(
      { error: "Failed to validate word" },
      { status: 500 }
    );
  }
}
