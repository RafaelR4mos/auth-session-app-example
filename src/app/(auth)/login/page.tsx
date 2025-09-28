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
    
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Importante para cookies
      });
      
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Erro ao entrar");
        return;
      }
      
      // Aguardar um pouco para o cookie ser definido
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Forçar refresh da página para garantir que o cookie seja lido
      window.location.href = "/";
    } catch (err) {
      console.error("Erro no login:", err);
      setError("Erro de conexão. Tente novamente.");
    }
  }

  return (
    <div className="card p-8 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-card-foreground mb-2">Entrar</h1>
        <p className="text-muted-foreground">
          Acesse sua conta para continuar
        </p>
      </div>
      
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-card-foreground">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="seu@email.com"
            className="input w-full"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-card-foreground">
            Senha
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="Sua senha"
            className="input w-full"
          />
        </div>
        
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
        
        <button 
          type="submit"
          className="btn btn-primary w-full py-3"
        >
          Entrar
        </button>
      </form>
      
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Novo por aqui?{" "}
          <a 
            href="/register" 
            className="text-primary hover:text-blue-700 font-medium underline"
          >
            Criar conta
          </a>
        </p>
      </div>
    </div>
  );
}
