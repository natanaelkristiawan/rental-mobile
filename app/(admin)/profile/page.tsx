"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/context/useAuthStore";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  function handleLogout() {
    logout();
    router.push("/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen p-8 pb-24">
      <h1 className="text-2xl font-semibold text-foreground">Profile</h1>
      <p className="mt-2 text-muted-foreground">Profil pengguna</p>
      <Button
        variant="outline"
        onClick={handleLogout}
        className="mt-6 gap-2"
      >
        <LogOut className="size-4" />
        Logout
      </Button>
    </main>
  );
}
