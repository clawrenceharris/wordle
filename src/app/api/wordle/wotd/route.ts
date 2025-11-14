import { getWordOfTheDay } from "@/utils";

export async function GET() {
  const word = getWordOfTheDay();

  return new Response(JSON.stringify({ word }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
