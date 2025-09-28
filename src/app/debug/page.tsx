"use client";

import { useEffect, useState } from "react";

interface DebugInfo {
  hasSessionCookie: boolean;
  sessionCookieValue: string | null;
  user: any;
  environment: string;
  timestamp: string;
}

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDebugInfo() {
      try {
        const response = await fetch("/api/debug");
        const data = await response.json();
        setDebugInfo(data);
      } catch (error) {
        console.error("Error fetching debug info:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDebugInfo();
  }, []);

  if (loading) {
    return <div className="p-8">Carregando informações de debug...</div>;
  }

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Debug de Autenticação</h1>
      
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Informações do Sistema</h2>
        <p><strong>Ambiente:</strong> {debugInfo?.environment}</p>
        <p><strong>Timestamp:</strong> {debugInfo?.timestamp}</p>
      </div>

      <div className="bg-blue-100 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Cookie de Sessão</h2>
        <p><strong>Cookie existe:</strong> {debugInfo?.hasSessionCookie ? "Sim" : "Não"}</p>
        <p><strong>Valor do cookie:</strong> {debugInfo?.sessionCookieValue || "N/A"}</p>
      </div>

      <div className="bg-green-100 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Usuário Logado</h2>
        {debugInfo?.user ? (
          <div>
            <p><strong>ID:</strong> {debugInfo.user.id}</p>
            <p><strong>Email:</strong> {debugInfo.user.email}</p>
          </div>
        ) : (
          <p>Nenhum usuário logado</p>
        )}
      </div>

      <div className="space-y-2">
        <a href="/" className="block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Voltar ao início
        </a>
        <a href="/login" className="block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Ir para login
        </a>
      </div>
    </div>
  );
}
