"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/BottomNav";
import {
  formatNewsDate,
  WC2026_NEWS,
  WC2026_QUICK_FACTS,
} from "@/data/wc-news";
import { getStoredProfile } from "@/lib/user-profile";

const CATEGORY_COLORS: Record<string, string> = {
  Tournament: "bg-accent/30 text-red-200",
  Teams: "bg-blue-950/50 text-blue-200",
  Hosts: "bg-emerald-950/50 text-emerald-200",
  Format: "bg-purple-950/50 text-purple-200",
  Fans: "bg-orange-950/50 text-orange-200",
};

export default function ExplorePage() {
  const router = useRouter();
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const profile = getStoredProfile();
    if (!profile) {
      router.replace("/");
      return;
    }
    setName(profile.name);
  }, [router]);

  if (!name) {
    return (
      <main className="flex min-h-screen items-center justify-center pb-20">
        <p className="text-muted">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-8 pb-24 sm:py-10">
      <div className="mx-auto w-full max-w-2xl">
        <header className="mb-6 text-center">
          <div className="mx-auto mb-3 flex justify-center">
            <div className="relative h-14 w-14 overflow-hidden rounded-full border border-accent/40 shadow-[0_0_20px_rgba(139,26,26,0.35)]">
              <Image
                src="/app-icon.png"
                alt="FIFA World Cup 2026"
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
          </div>
          <p className="text-sm font-medium uppercase tracking-widest text-accent">
            Explore
          </p>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
            FIFA World Cup 2026
          </h1>
          <p className="mt-2 text-sm text-muted">
            Latest news &amp; tournament highlights for {name}
          </p>
        </header>

        <section className="mb-6" aria-label="Quick facts">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {WC2026_QUICK_FACTS.map((fact) => (
              <div
                key={fact.label}
                className="rounded-xl border border-card-border bg-card/80 px-3 py-3 text-center"
              >
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted">
                  {fact.label}
                </p>
                <p className="mt-1 text-xs font-bold text-foreground sm:text-sm">
                  {fact.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section aria-label="Latest news">
          <h2 className="mb-4 text-lg font-semibold">Latest news</h2>
          <div className="space-y-4">
            {WC2026_NEWS.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-2xl border border-card-border bg-gradient-to-br from-[#2a1040]/40 via-card/90 to-card/80 shadow-lg"
              >
                <div className="flex gap-4 p-4">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-2xl"
                    aria-hidden="true"
                  >
                    {item.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                          CATEGORY_COLORS[item.category] ??
                          "bg-white/10 text-muted"
                        }`}
                      >
                        {item.category}
                      </span>
                      <time
                        dateTime={item.publishedAt}
                        className="text-[10px] text-muted"
                      >
                        {formatNewsDate(item.publishedAt)}
                      </time>
                    </div>
                    <h3 className="text-base font-bold leading-snug text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {item.summary}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-8 text-center">
          <Link
            href="/dashboard"
            className="text-sm text-accent underline-offset-4 hover:underline"
          >
            Back to match schedule
          </Link>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
