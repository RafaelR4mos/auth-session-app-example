import { getSessionUser } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";

export default function Home() {
  const user = getSessionUser();

  if (!user) {
    return (
      <div className="bg-white shadow rounded p-6">
        <h1 className="text-xl text-black font-semibold mb-2">
          Acesso restrito
        </h1>
        <p className="mb-4 text-black">Você precisa estar autenticado.</p>
        <div className="flex gap-2">
          <Link className="px-4 py-2 bg-blue-600 rounded" href="/login">
            Entrar
          </Link>
          <Link
            className="px-4 py-2 border text-black rounded"
            href="/register"
          >
            Criar conta
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Olá, {user.email}</h1>
      <p>
        Você está autenticado via cookie de sessão (HTTP-Only) + tabela{" "}
        <code>sessions</code> no SQLite.
      </p>
      <LogoutButton />
    </div>
  );
}
