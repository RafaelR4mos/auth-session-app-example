import { cookies } from "next/headers";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import db from "./db";

// duração da sessão (ex.: 7 dias)
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
export const COOKIE_NAME = "session";
export const SECRET = process.env.SECRET_KEY || "dev-secret-change-me";

export type User = { id: number; email: string; password_hash: string };

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

export function createSession(userId: number) {
  const token = randomToken();
  const now = Math.floor(Date.now() / 1000);
  const expires = now + SESSION_TTL_SECONDS;

  db.prepare(
    "INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, datetime(?,'unixepoch'))"
  ).run(token, userId, expires);

  // grava cookie http-only
  cookies().set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(expires * 1000),
  });

  return token;
}

export function destroySession() {
  const cookie = cookies().get(COOKIE_NAME);
  if (cookie?.value) {
    db.prepare("DELETE FROM sessions WHERE id = ?").run(cookie.value);
  }
  cookies().set({
    name: COOKIE_NAME,
    value: "",
    path: "/",
    expires: new Date(0),
  });
}

export function getSessionUser(): { id: number; email: string } | null {
  const cookie = cookies().get(COOKIE_NAME);
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
    .get(cookie.value) as { id: number; email: string } | undefined;

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
