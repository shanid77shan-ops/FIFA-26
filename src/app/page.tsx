"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { getStoredProfile, saveProfile } from "@/lib/user-profile";

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditing = searchParams.get("edit") === "1";

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const profile = getStoredProfile();

    if (profile && !isEditing) {
      router.replace("/dashboard");
      return;
    }

    if (profile && isEditing) {
      setName(profile.name);
    }

    setReady(true);
  }, [router, isEditing]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!name.trim()) {
      setNameError("Please enter your name.");
      return;
    }

    saveProfile(name.trim());
    router.push("/dashboard");
  }

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-muted">Loading...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <header className="mb-8 text-center">
          <div className="mx-auto mb-5 flex justify-center">
            <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-accent/50 shadow-[0_0_32px_rgba(139,26,26,0.45)] sm:h-32 sm:w-32">
              <Image
                src="/app-icon.png"
                alt="FIFA World Cup 2026 mascot"
                fill
                priority
                className="object-cover"
                sizes="128px"
              />
            </div>
          </div>
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-accent">
            FIFA World Cup 2026
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {isEditing ? "Update your name" : "Welcome, Fan!"}
          </h1>
          <p className="mt-3 text-muted">
            {isEditing
              ? "Change your name and continue to the match schedule."
              : "Enter your name to browse the full match schedule — day by day with dates and kick-off times in IST."}
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-card-border bg-card/80 p-6 shadow-xl sm:p-8"
        >
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Your name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setNameError("");
              }}
              placeholder="Enter your name"
              className="w-full rounded-xl border border-card-border bg-background/60 px-4 py-3 text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
              autoComplete="name"
            />
            {nameError && (
              <p className="mt-2 text-sm text-danger">{nameError}</p>
            )}
          </div>

          <button
            type="submit"
            className="mt-8 w-full rounded-xl bg-accent px-4 py-3 font-semibold text-foreground transition hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-card"
          >
            {isEditing ? "Save and continue" : "View match schedule"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center">
          <p className="text-muted">Loading...</p>
        </main>
      }
    >
      <OnboardingContent />
    </Suspense>
  );
}
