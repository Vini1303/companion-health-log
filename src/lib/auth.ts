export const AUTH_SESSION_KEY = "care:auth:session";
export const AUTH_PROFILE_KEY = "care:auth:profile";
export const AUTH_DB_KEY = "care:auth:db";
export const ELDER_INFO_KEY = "care:elder-info";

export type AuthProfile = {
  elderName: string;
  birthDate: string;
  caregiverName?: string;
};

type AuthUser = {
  username: string;
  password: string;
  elderName: string;
  caregiverName?: string;
};

type AuthDatabase = {
  users: AuthUser[];
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

export function birthDateToPassword(birthDate: string) {
  const digits = birthDate.replace(/\D/g, "");
  if (digits.length === 8 && birthDate.includes("-")) {
    const yyyy = digits.slice(0, 4);
    const mm = digits.slice(4, 6);
    const dd = digits.slice(6, 8);
    return `${dd}${mm}${yyyy}`;
  }

  if (digits.length === 8 && birthDate.includes("/")) {
    const dd = digits.slice(0, 2);
    const mm = digits.slice(2, 4);
    const yyyy = digits.slice(4, 8);
    return `${dd}${mm}${yyyy}`;
  }

  return digits;
}

function readAuthDatabase(): AuthDatabase {
  const saved = localStorage.getItem(AUTH_DB_KEY);
  if (saved) return JSON.parse(saved) as AuthDatabase;
  return { users: [] };
}

function writeAuthDatabase(db: AuthDatabase) {
  localStorage.setItem(AUTH_DB_KEY, JSON.stringify(db));
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

  const fallback = { elderName: "", birthDate: "" };
  localStorage.setItem(AUTH_PROFILE_KEY, JSON.stringify(fallback));
  return fallback;
}

export function saveAuthProfile(profile: AuthProfile) {
  localStorage.setItem(AUTH_PROFILE_KEY, JSON.stringify(profile));

  const savedElder = localStorage.getItem(ELDER_INFO_KEY);
  if (savedElder) {
    const elder = JSON.parse(savedElder) as Record<string, unknown>;
    localStorage.setItem(
      ELDER_INFO_KEY,
      JSON.stringify({ ...elder, name: profile.elderName, birthDate: profile.birthDate }),
    );
  }
}

export function upsertUserFromProfile(profile: AuthProfile) {
  const username = nameToUsername(profile.elderName);
  const password = birthDateToPassword(profile.birthDate);

  const db = readAuthDatabase();
  const index = db.users.findIndex((u) => u.username === username);

  if (index >= 0) {
    db.users[index] = { username, password, elderName: profile.elderName, caregiverName: profile.caregiverName };
  } else {
    db.users.push({ username, password, elderName: profile.elderName, caregiverName: profile.caregiverName });
  }

  writeAuthDatabase(db);
  return { username, password };
}

export function ensureDefaultUser() {
  const profile = getAuthProfile();
  const db = readAuthDatabase();
  if (db.users.length === 0) {
    upsertUserFromProfile(profile);
  }
}

export function createUser(profile: AuthProfile) {
  saveAuthProfile(profile);
  return upsertUserFromProfile(profile);
}

export function validateUserCredentials(username: string, password: string) {
  const db = readAuthDatabase();
  return db.users.some(
    (user) => user.username === username.trim().toLowerCase() && user.password === password.replace(/\D/g, ""),
  );
}


export function getDashboardNames() {
  const profile = getAuthProfile();

  const caregiverName = profile.caregiverName?.trim() || "";

  const savedElder = localStorage.getItem(ELDER_INFO_KEY);
  if (savedElder) {
    const elder = JSON.parse(savedElder) as { name?: string };
    if (elder.name?.trim()) {
      return { caregiverName, patientName: elder.name.trim() };
    }
  }

  return { caregiverName, patientName: profile.elderName?.trim() || "" };
}
