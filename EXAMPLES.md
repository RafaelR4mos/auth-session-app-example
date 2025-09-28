# 📚 Exemplos Práticos de Uso

Este documento contém exemplos práticos de como usar o sistema de autenticação implementado.

## 🔐 Exemplos de Autenticação

### **1. Verificação de Sessão em Páginas**

```typescript
// src/app/dashboard/page.tsx
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getSessionUser();
  
  if (!user) {
    redirect('/login');
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Bem-vindo, {user.email}!</p>
    </div>
  );
}
```

### **2. Middleware de Autenticação**

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session');
  
  // Rotas protegidas
  const protectedRoutes = ['/dashboard', '/profile', '/admin'];
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/admin/:path*']
};
```

### **3. Hook Personalizado para Autenticação**

```typescript
// src/hooks/useAuth.ts
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  email: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/me');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return { user, loading, logout };
}
```

### **4. Componente de Proteção de Rota**

```typescript
// src/components/ProtectedRoute.tsx
"use client";

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return fallback || null;
  }

  return <>{children}</>;
}
```

## 🔌 Exemplos de API

### **1. Endpoint para Dados do Usuário Atual**

```typescript
// src/app/api/me/route.ts
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  
  if (!user) {
    return NextResponse.json(
      { error: "Não autenticado" },
      { status: 401 }
    );
  }

  return NextResponse.json(user);
}
```

### **2. Endpoint para Atualizar Perfil**

```typescript
// src/app/api/profile/route.ts
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import db from "@/lib/db";

export async function PUT(request: Request) {
  const user = await getSessionUser();
  
  if (!user) {
    return NextResponse.json(
      { error: "Não autenticado" },
      { status: 401 }
    );
  }

  const { email, name } = await request.json();

  try {
    db.prepare(
      "UPDATE users SET email = ?, name = ? WHERE id = ?"
    ).run(email, name, user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao atualizar perfil" },
      { status: 500 }
    );
  }
}
```

### **3. Endpoint para Listar Usuários (Admin)**

```typescript
// src/app/api/admin/users/route.ts
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import db from "@/lib/db";

export async function GET() {
  const user = await getSessionUser();
  
  if (!user) {
    return NextResponse.json(
      { error: "Não autenticado" },
      { status: 401 }
    );
  }

  // Verificar se é admin (implementar lógica de admin)
  const isAdmin = await checkAdminRole(user.id);
  if (!isAdmin) {
    return NextResponse.json(
      { error: "Acesso negado" },
      { status: 403 }
    );
  }

  const users = db.prepare("SELECT id, email, created_at FROM users").all();
  return NextResponse.json({ users });
}
```

## 🎨 Exemplos de Interface

### **1. Header com Status de Login**

```typescript
// src/components/Header.tsx
"use client";

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export function Header() {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              Meu App
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-700">
                  Olá, {user.email}
                </span>
                <button
                  onClick={logout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Registrar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
```

### **2. Formulário de Login com Validação**

```typescript
// src/components/LoginForm.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        const data = await response.json();
        setError(data.error || 'Erro ao fazer login');
      }
    } catch (err) {
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Senha
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
}
```

## 🔧 Exemplos de Configuração

### **1. Configuração de Ambiente**

```bash
# .env.local
SECRET_KEY=chave-super-secreta-para-producao
NODE_ENV=development
DATABASE_URL=./app.db
SESSION_TTL=604800  # 7 dias em segundos
```

### **2. Configuração de Middleware**

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Rotas públicas
  const publicRoutes = ['/login', '/register', '/'];
  const isPublicRoute = publicRoutes.includes(pathname);
  
  // Verificar cookie de sessão
  const sessionCookie = request.cookies.get('session');
  
  if (!isPublicRoute && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  if (isPublicRoute && sessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

### **3. Configuração de Banco de Dados**

```typescript
// src/lib/db.ts
import Database from "better-sqlite3";
import path from "node:path";

const dbPath = process.env.DATABASE_URL || path.join(process.cwd(), "app.db");
const db = new Database(dbPath);

// Configurações de performance
db.pragma("journal_mode = WAL");
db.pragma("synchronous = NORMAL");
db.pragma("cache_size = 1000");
db.pragma("temp_store = MEMORY");

export default db;
```

## 🧪 Exemplos de Testes

### **1. Teste de Autenticação**

```typescript
// tests/auth.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createUser, hashPassword, verifyPassword } from '../src/lib/auth';

describe('Autenticação', () => {
  it('deve criar hash de senha corretamente', async () => {
    const password = 'senha123';
    const hash = await hashPassword(password);
    
    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);
    
    const isValid = await verifyPassword(password, hash);
    expect(isValid).toBe(true);
  });

  it('deve rejeitar senha incorreta', async () => {
    const password = 'senha123';
    const wrongPassword = 'senha456';
    const hash = await hashPassword(password);
    
    const isValid = await verifyPassword(wrongPassword, hash);
    expect(isValid).toBe(false);
  });
});
```

### **2. Teste de API**

```typescript
// tests/api.test.ts
import { describe, it, expect } from 'vitest';

describe('API de Login', () => {
  it('deve rejeitar credenciais inválidas', async () => {
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'senha_errada'
      })
    });
    
    expect(response.status).toBe(401);
  });
});
```

## 📱 Exemplos de Uso em Produção

### **1. Configuração de Rate Limiting**

```typescript
// src/lib/rate-limit.ts
import { NextRequest } from 'next/server';

const attempts = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(ip: string, maxAttempts = 5, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const attempt = attempts.get(ip);
  
  if (!attempt || now > attempt.resetTime) {
    attempts.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (attempt.count >= maxAttempts) {
    return false;
  }
  
  attempt.count++;
  return true;
}
```

### **2. Logging de Segurança**

```typescript
// src/lib/security-logger.ts
export function logSecurityEvent(event: string, details: any) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    details,
    ip: details.ip || 'unknown'
  };
  
  console.log('SECURITY:', JSON.stringify(logEntry));
  
  // Em produção, enviar para serviço de logging
  if (process.env.NODE_ENV === 'production') {
    // Enviar para Sentry, DataDog, etc.
  }
}
```

---

Estes exemplos demonstram como usar o sistema de autenticação em diferentes cenários e configurações. Adapte conforme suas necessidades específicas!
