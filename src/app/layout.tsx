import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js Sessions Example",
  description: "Login/Registro com sessão em SQLite",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className="min-h-screen bg-background">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Sistema de Autenticação
              </h1>
              <p className="text-muted-foreground">
                Gerencie suas sessões com segurança
              </p>
            </div>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
