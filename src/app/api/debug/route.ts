import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");
    
    console.log("Debug - Session cookie:", sessionCookie);
    console.log("Debug - All cookies:", cookieStore.getAll());
    
    const user = await getSessionUser();
    
    return NextResponse.json({
      hasSessionCookie: !!sessionCookie,
      sessionCookieValue: sessionCookie?.value ? sessionCookie.value.substring(0, 8) + "..." : null,
      user: user,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Debug error:", error);
    return NextResponse.json(
      { error: "Debug failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
