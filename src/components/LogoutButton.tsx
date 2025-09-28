"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  async function doLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.refresh();
  }
  return (
    <button
      onClick={doLogout}
      className="px-4 py-2 bg-gray-900 text-white rounded"
    >
      Sair
    </button>
  );
}
