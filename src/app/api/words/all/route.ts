import { five_char_words } from "@/utils/word-list";

export async function GET() {
  const words = five_char_words;

  return new Response(JSON.stringify({ words }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
