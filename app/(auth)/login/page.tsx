"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/context/useAuthStore";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [from, setFrom] = useState<string>("/");

  const { login, isLoading, error } = useAuthStore();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const value = params.get("from");
    if (typeof value === "string" && value) {
      setFrom(value);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!emailOrPhone.trim() || !password) return;
    try {
      await login(emailOrPhone.trim(), password);
      router.push(from);
      router.refresh();
    } catch {
      // Error is set in store
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4 flex-col space-y-4">

        <Image
          src="/logo-new.png"
          alt="Logo"
          width={96}
          height={96}
          priority
        />
        <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>
            Log in
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-4">
            <div className="space-y-4">
              <Label htmlFor="emailOrPhone">Enter your email</Label>
              <Input
                id="emailOrPhone"
                type="text"
                inputMode="email"
                autoComplete="username"
                placeholder="you@example.com"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
          </CardContent>
          <CardFooter className="mt-5">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Signing in…" : "Sign in"}
            </Button>
          </CardFooter>
        </form>
        </Card>
    </main>
  );
}
