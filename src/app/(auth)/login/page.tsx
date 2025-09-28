"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const email = form.get("email");
    const password = form.get("password");
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Erro ao entrar");
      return;
    }
    router.replace("/");
  }

  return (
    <div className="bg-white shadow rounded p-6">
      <h1 className="text-2xl font-semibold mb-4">Entrar</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          name="email"
          type="email"
          required
          placeholder="email@exemplo.com"
          className="w-full border rounded px-3 py-2"
        />
        <input
          name="password"
          type="password"
          required
          placeholder="senha"
          className="w-full border rounded px-3 py-2"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700">
          Entrar
        </button>
      </form>
      <p className="text-sm mt-4">
        Novo por aqui?{" "}
        <a href="/(auth)/register" className="underline">
          Criar conta
        </a>
      </p>
    </div>
  );
}
