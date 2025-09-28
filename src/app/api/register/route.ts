import { NextRequest, NextResponse } from "next/server";
import { createUser, findUserByEmail, hashPassword, createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  
  if (!email || !password) {
    return NextResponse.json(
      { error: "Email e senha são obrigatórios" },
      { status: 400 }
    );
  }

  const exists = findUserByEmail(email);
  if (exists) {
    return NextResponse.json(
      { error: "Email já registrado" },
      { status: 409 }
    );
  }

  const pwdHash = await hashPassword(password);
  const userId = createUser(email, pwdHash);
  await createSession(userId);

  return NextResponse.json({ ok: true });
}