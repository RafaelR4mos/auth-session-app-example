import { NextResponse } from "next/server";
import db from "@/lib/db";
import { formatBrazilianDate } from "@/lib/date-utils";

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

  // Formatar as datas para o timezone brasileiro
  const sessionsWithBrazilianDates = rows.map(row => ({
    ...row,
    created_at: formatBrazilianDate(row.created_at),
    expires_at: formatBrazilianDate(row.expires_at)
  }));

  return NextResponse.json({ sessions: sessionsWithBrazilianDates });
}
