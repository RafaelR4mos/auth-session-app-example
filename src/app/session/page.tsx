"use client";

import { useEffect, useState } from "react";
import type { Session } from "@/types/database";

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [deletingSession, setDeletingSession] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<boolean>(false);

  useEffect(() => {
    fetch("/api/sessions")
      .then((res) => res.json())
      .then((data) => setSessions(data.sessions));
  }, []);

  const copyToken = async (token: string) => {
    try {
      await navigator.clipboard.writeText(token);
      setCopiedToken(token);
      setTimeout(() => setCopiedToken(null), 2000); // Remove a notificação após 2 segundos
    } catch (err) {
      console.error('Erro ao copiar token:', err);
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      setDeletingSession(sessionId);
      
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        alert(`Erro ao deletar sessão: ${error.error}`);
        return;
      }

      // Remove a sessão da lista local
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      setShowDeleteConfirm(null);
      setDeleteSuccess(true);
      setTimeout(() => setDeleteSuccess(false), 3000);
      
    } catch (err) {
      console.error('Erro ao deletar sessão:', err);
      alert('Erro ao deletar sessão. Tente novamente.');
    } finally {
      setDeletingSession(null);
    }
  };

  const confirmDelete = (sessionId: string) => {
    setShowDeleteConfirm(sessionId);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  return (
    <div className="card p-8 space-y-6">
      {/* Notificações */}
      {copiedToken && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse">
          ✓ Token copiado para a área de transferência!
        </div>
      )}
      
      {deleteSuccess && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse">
          ✓ Sessão deletada com sucesso!
        </div>
      )}
      
      <div className="text-center">
        <h1 className="text-2xl font-bold text-card-foreground mb-2">
          Sessões Ativas
        </h1>
        <p className="text-muted-foreground">
          Gerencie suas sessões de autenticação
        </p>
      </div>
      
      {sessions.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <p className="text-muted-foreground">Nenhuma sessão ativa encontrada.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((s) => (
            <div key={s.id} className="border border-border rounded-lg p-4 bg-accent/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-card-foreground mb-1">Email</p>
                  <p className="text-sm text-muted-foreground">{s.email}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-card-foreground mb-1">Token</p>
                  <div className="relative group">
                    <code 
                      className="text-xs bg-background px-2 py-1 rounded border cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => copyToken(s.id)}
                      title="Clique para copiar o token completo"
                    >
                      {s.id.substring(0, 8)}...
                    </code>
                    <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-10">
                      <div className="bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg max-w-xs break-all">
                        <div className="font-mono text-xs">
                          {s.id}
                        </div>
                        <div className="text-gray-300 text-xs mt-1">
                          {copiedToken === s.id ? (
                            <span className="text-green-400">✓ Copiado!</span>
                          ) : (
                            "Clique para copiar"
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-card-foreground mb-1">Criada em</p>
                  <p className="text-sm text-muted-foreground">
                    {s.created_at}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-card-foreground mb-1">Expira em</p>
                  <p className="text-sm text-muted-foreground">
                    {s.expires_at}
                  </p>
                </div>
              </div>
              
              {/* Botão de deletar */}
              <div className="mt-6 flex w-full flex justify-center">
                <button
                  onClick={() => confirmDelete(s.id)}
                  disabled={deletingSession === s.id}
                  className="btn btn-destructive text-sm"
                >
                  {deletingSession === s.id ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deletando...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Deletar Sessão
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="text-center">
        <a 
          href="/"
          className="btn btn-secondary"
        >
          Voltar ao início
        </a>
      </div>

      {/* Modal de confirmação de exclusão */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md mx-4">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-card-foreground">
                  Confirmar Exclusão
                </h3>
                <p className="text-sm text-muted-foreground">
                  Esta ação não pode ser desfeita
                </p>
              </div>
            </div>
            
            <p className="text-card-foreground mb-6">
              Tem certeza que deseja deletar esta sessão? O usuário será desconectado imediatamente.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDelete}
                className="btn btn-secondary"
                disabled={deletingSession === showDeleteConfirm}
              >
                Cancelar
              </button>
              <button
                onClick={() => deleteSession(showDeleteConfirm)}
                disabled={deletingSession === showDeleteConfirm}
                className="btn btn-destructive"
              >
                {deletingSession === showDeleteConfirm ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deletando...
                  </>
                ) : (
                  'Sim, Deletar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
