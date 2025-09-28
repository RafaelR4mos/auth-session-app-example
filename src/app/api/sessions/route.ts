import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  const rows = db
    .prepare(
      `
    SELECT sessions.id, sessions.user_id, users.email, sessions.created_at, sessions.expires_at
    FROM sessions
    JOIN users ON users.id = sessions.user_id
    ORDER BY sessions.created_at DESC
  `
    )
    .all();

  return NextResponse.json({ sessions: rows });
}
