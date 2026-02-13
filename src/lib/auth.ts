import { patient } from "@/lib/mock-data";

export const AUTH_SESSION_KEY = "care:auth:session";
export const AUTH_PROFILE_KEY = "care:auth:profile";
export const ELDER_INFO_KEY = "care:elder-info";

export type AuthProfile = {
  elderName: string;
  birthDate: string;
};

export function nameToUsername(name: string) {
  const normalized = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (normalized.length === 0) return "idoso";
  if (normalized.length === 1) return normalized[0];
  return `${normalized[0]}.${normalized[normalized.length - 1]}`;
}

export function getAuthProfile(): AuthProfile {
  const savedProfile = localStorage.getItem(AUTH_PROFILE_KEY);
  if (savedProfile) return JSON.parse(savedProfile) as AuthProfile;

  const savedElder = localStorage.getItem(ELDER_INFO_KEY);
  if (savedElder) {
    const elder = JSON.parse(savedElder) as { name?: string; birthDate?: string };
    if (elder.name && elder.birthDate) {
      const profile = { elderName: elder.name, birthDate: elder.birthDate };
      localStorage.setItem(AUTH_PROFILE_KEY, JSON.stringify(profile));
      return profile;
    }
  }

  const fallback = { elderName: patient.name, birthDate: patient.birthDate };
  localStorage.setItem(AUTH_PROFILE_KEY, JSON.stringify(fallback));
  return fallback;
}

export function saveAuthProfile(profile: AuthProfile) {
  localStorage.setItem(AUTH_PROFILE_KEY, JSON.stringify(profile));

  const savedElder = localStorage.getItem(ELDER_INFO_KEY);
  if (savedElder) {
    const elder = JSON.parse(savedElder) as Record<string, unknown>;
    localStorage.setItem(ELDER_INFO_KEY, JSON.stringify({ ...elder, name: profile.elderName, birthDate: profile.birthDate }));
  }
}
