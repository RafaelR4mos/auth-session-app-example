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
      <body className="min-h-screen">
        <div className="max-w-md mx-auto p-6">{children}</div>
      </body>
    </html>
  );
}
