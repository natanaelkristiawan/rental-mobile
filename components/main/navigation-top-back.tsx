"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavigationTopBackProps {
  /** Title shown next to the back button (e.g. "Detail Surat Jalan") */
  title: string;
  /** If set, back button navigates to this href. Otherwise uses router.back() */
  backHref?: string;
  className?: string;
}

export function NavigationTopBack({
  title,
  backHref,
  className,
}: NavigationTopBackProps) {
  const router = useRouter();

  const backContent = (
    <>
      <ChevronLeft className="size-6 shrink-0" aria-hidden />
      <span className="font-semibold text-foreground">{title}</span>
    </>
  );

  return (
    <header
      className={cn(
        "flex min-w-0 items-center gap-2 py-3",
        className
      )}
      role="banner"
    >
      {backHref ? (
        <Link
          href={backHref}
          className="flex min-w-0 items-center gap-1 text-foreground no-underline hover:opacity-80"
          aria-label={`Kembali ke ${backHref === "/" ? "beranda" : "sebelumnya"}`}
        >
          {backContent}
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => router.back()}
          className="flex min-w-0 items-center gap-1 bg-transparent p-0 text-left text-foreground hover:opacity-80"
          aria-label="Kembali"
        >
          {backContent}
        </button>
      )}
      
    </header>
  );
}
