"use client";

import { useEffect, useState } from "react";

type Session = {
  id: string;
  user_id: number;
  email: string;
  created_at: string;
  expires_at: string;
};

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    fetch("/api/sessions")
      .then((res) => res.json())
      .then((data) => setSessions(data.sessions));
  }, []);

  return (
    <div className="bg-white shadow rounded p-6">
      <h1 className="text-2xl font-semibold mb-4">Sessões Ativas</h1>
      {sessions.length === 0 && (
        <p className="text-gray-600">Nenhuma sessão ativa.</p>
      )}
      <ul className="space-y-3">
        {sessions.map((s) => (
          <li key={s.id} className="p-3 border rounded">
            <p>
              <strong>Email:</strong> {s.email}
            </p>
            <p>
              <strong>Token:</strong> <code className="text-xs">{s.id}</code>
            </p>
            <p>
              <strong>Criada:</strong> {s.created_at}
            </p>
            <p>
              <strong>Expira:</strong> {s.expires_at}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
