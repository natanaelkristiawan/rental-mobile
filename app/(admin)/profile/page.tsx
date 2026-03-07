"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/context/useAuthStore";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogOut } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const isUpdating = useAuthStore((s) => s.isUpdating);
  const profileError = useAuthStore((s) => s.error);

  const [fullname, setFullname] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFullname(user.name ?? "");
      setEmail(user.email ?? "");
      setPhone(user.phone ?? "");
    }
  }, [user]);

  function handleLogout() {
    logout();
    router.push("/login");
    router.refresh();
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError(null);
    if (newPassword && newPassword !== retypePassword) {
      setPasswordError("Password baru dan ulangi password tidak sama.");
      return;
    }
    try {
      await updateProfile({
        name: fullname,
        email,
        phone,
        newPassword: newPassword || undefined,
      });
      setNewPassword("");
      setRetypePassword("");
    } catch {
      // Error is set in store and shown below
    }
  }

  return (
    <main className="min-h-screen p-8 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Profile</h1>
          <p className="mt-2 text-muted-foreground">Profil pengguna</p>
        </div>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="gap-2 border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-500/80 dark:text-red-400 dark:hover:bg-red-500/10 dark:hover:text-red-300"
        >
          <LogOut className="size-4" />
          Logout
        </Button>
      </div>
      <Card className="mt-6">
        <form onSubmit={handleSave}>
          <CardContent className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullname">Nama lengkap</Label>
              <Input
                id="fullname"
                type="text"
                autoComplete="name"
                placeholder="Nama lengkap"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telepon</Label>
              <Input
                id="phone"
                type="tel"
                autoComplete="tel"
                placeholder="+62 812 3456 7890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="border-t pt-4">
              <p className="mb-3 text-sm font-medium text-muted-foreground">
                Ubah password (opsional)
              </p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Password baru</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Kosongkan jika tidak ingin mengubah"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retypePassword">Ulangi password baru</Label>
                  <Input
                    id="retypePassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Ulangi password baru"
                    value={retypePassword}
                    onChange={(e) => setRetypePassword(e.target.value)}
                  />
                </div>
                {passwordError && (
                  <p className="text-sm text-destructive" role="alert">
                    {passwordError}
                  </p>
                )}
              </div>
            </div>

            {profileError && (
              <p className="text-sm text-destructive" role="alert">
                {profileError}
              </p>
            )}

            <Button type="submit" className="mt-2 w-full" disabled={isUpdating}>
              {isUpdating ? "Menyimpan…" : "Simpan"}
            </Button>
          </CardContent>
        </form>
      </Card>

    </main>
  );
}
