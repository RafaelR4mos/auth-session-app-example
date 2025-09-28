// Tipos para o banco de dados
export type User = {
  id: number;
  email: string;
  password_hash: string;
  created_at: string;
};

export type Session = {
  id: string;
  user_id: number;
  email: string;
  created_at: string;
  expires_at: string;
};

export type SessionRow = {
  id: string;
  user_id: number;
  email: string;
  created_at: string;
  expires_at: string;
};

export type UserSession = {
  id: number;
  email: string;
};
