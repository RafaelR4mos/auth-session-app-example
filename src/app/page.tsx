import { getSessionUser } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";

export default async function Home() {
  const user = await getSessionUser();

  if (!user) {
    return (
      <div className="card p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-card-foreground mb-2">
            Acesso restrito
          </h1>
          <p className="text-muted-foreground">
            Você precisa estar autenticado para acessar esta área.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Link 
            className="btn btn-primary flex-1 text-center" 
            href="/login"
          >
            Entrar
          </Link>
          <Link
            className="btn btn-secondary flex-1 text-center"
            href="/register"
          >
            Criar conta
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-8 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-card-foreground mb-2">
          Bem-vindo!
        </h1>
        <p className="text-muted-foreground">
          Olá, <span className="font-medium text-card-foreground">{user.email}</span>
        </p>
      </div>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <p className="text-sm text-green-800">
            Você está autenticado via cookie de sessão (HTTP-Only) + tabela{" "}
            <code className="bg-green-100 px-1 rounded text-xs">sessions</code> no SQLite.
          </p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Link 
          href="/session"
          className="btn btn-secondary flex-1 text-center"
        >
          Ver sessões ativas
        </Link>
        <LogoutButton />
      </div>
    </div>
  );
}
