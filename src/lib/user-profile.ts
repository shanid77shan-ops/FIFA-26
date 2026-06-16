import {
  USER_PROFILE_KEY,
  type UserProfile,
} from "@/data/qualified-countries";

export function getStoredProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem(USER_PROFILE_KEY);
  if (!stored) return null;

  try {
    const profile = JSON.parse(stored) as UserProfile;
    if (!profile.name?.trim()) return null;
    return { name: profile.name.trim() };
  } catch {
    return null;
  }
}

export function saveProfile(name: string): UserProfile {
  const profile: UserProfile = { name: name.trim() };
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  return profile;
}

export function clearProfile(): void {
  localStorage.removeItem(USER_PROFILE_KEY);
}
