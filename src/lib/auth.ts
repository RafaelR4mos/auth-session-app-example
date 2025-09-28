import { cookies } from "next/headers";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import db from "./db";
import { getBrazilianUnixNow } from "./date-utils";
import type { User, UserSession } from "@/types/database";

// duração da sessão (ex.: 1 minuto = 60)
export const SESSION_TTL_SECONDS = 120  // 7 Dias 60 * 60 * 24 * 7;
export const COOKIE_NAME = "session";
export const SECRET = process.env.SECRET_KEY || "dev-secret-change-me";

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

function randomToken() {
  // token HMAC para ficar aleatório e assinado
  const raw = crypto.randomBytes(32).toString("hex");
  const hmac = crypto.createHmac("sha256", SECRET).update(raw).digest("hex");
  return `${raw}.${hmac}`;
}

export async function createSession(userId: number) {
  const token = randomToken();
  const now = getBrazilianUnixNow();
  const expires = now + SESSION_TTL_SECONDS;

  console.log("Creating session for user:", userId);
  console.log("Token:", token.substring(0, 8) + "...");
  console.log("Expires at:", new Date(expires * 1000).toISOString());

  db.prepare(
    "INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, datetime(?,'unixepoch'))"
  ).run(token, userId, expires);

  // grava cookie http-only
  const cookieStore = await cookies();
  const cookieOptions = {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production" ? true : false,
    path: "/",
    expires: new Date(expires * 1000),
  };
  
  console.log("Setting cookie with options:", cookieOptions);
  cookieStore.set(cookieOptions as any);

  return token;
}

export async function destroySession() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  if (cookie?.value) {
    db.prepare("DELETE FROM sessions WHERE id = ?").run(cookie.value);
  }
  cookieStore.set({
    name: COOKIE_NAME,
    value: "",
    path: "/",
    expires: new Date(0),
  });
}

export async function getSessionUser(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  if (!cookie?.value) return null;

  const row = db
    .prepare(
      `
    SELECT users.id as id, users.email as email
    FROM sessions
    JOIN users ON users.id = sessions.user_id
    WHERE sessions.id = ? AND sessions.expires_at > datetime('now')
  `
    )
    .get(cookie.value) as UserSession | undefined;

  return row ?? null;
}

export function createUser(email: string, passwordHash: string) {
  const stmt = db.prepare(
    "INSERT INTO users (email, password_hash) VALUES (?, ?)"
  );
  const info = stmt.run(email.toLowerCase(), passwordHash);
  return info.lastInsertRowid as number;
}

export function findUserByEmail(email: string): User | undefined {
  return db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email.toLowerCase()) as User | undefined;
}
