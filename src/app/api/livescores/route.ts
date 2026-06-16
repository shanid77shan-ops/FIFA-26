import { NextResponse } from "next/server";
import { fetchInplayLivescores } from "@/lib/sportmonks";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const matches = await fetchInplayLivescores();
    return NextResponse.json({ matches });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch live scores";
    return NextResponse.json({ error: message, matches: [] }, { status: 500 });
  }
}
