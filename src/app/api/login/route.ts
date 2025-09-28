import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, verifyPassword, createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    const user = findUserByEmail(email);
    if (!user) {
      console.log("Login failed: User not found for email:", email);
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    const ok = await verifyPassword(password, user.password_hash);
    if (!ok) {
      console.log("Login failed: Invalid password for user:", user.id);
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    console.log("Login successful for user:", user.id);
    const token = await createSession(user.id);
    console.log("Session created with token:", token.substring(0, 8) + "...");
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
