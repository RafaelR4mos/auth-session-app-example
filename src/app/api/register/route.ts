import { NextResponse } from "next/server";
import { createUser, findUserByEmail, hashPassword, createSession } from "@/lib/auth";


export async function POST(req: Request) {
const { email, password } = await req.json();
if (!email || !password) {
return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 });
}


const exists = findUserByEmail(email);
if (exists) {
return NextResponse.json({ error: "Email já registrado" }, { status: 409 });
}


const pwdHash = await hashPassword(password);
const userId = createUser(email, pwdHash);
createSession(userId);


return NextResponse.json({ ok: true });