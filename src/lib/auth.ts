import { patient } from "@/lib/mock-data";

export const AUTH_SESSION_KEY = "care:auth:session";
export const AUTH_PROFILE_KEY = "care:auth:profile";
export const AUTH_DB_KEY = "care:auth:db";
export const ELDER_INFO_KEY = "care:elder-info";

export type AuthRole = "caregiver" | "elder";

export type AuthPermission =
  | "dashboard:read"
  | "vitals:read"
  | "medications:read"
  | "exams:read"
  | "allergies:read"
  | "contacts:read"
  | "elder-info:read"
  | "nutrition:read"
  | "profile:read";

const ROLE_PERMISSIONS: Record<AuthRole, AuthPermission[]> = {
  caregiver: [
    "dashboard:read",
    "vitals:read",
    "medications:read",
    "exams:read",
    "allergies:read",
    "contacts:read",
    "elder-info:read",
    "nutrition:read",
    "profile:read",
  ],
  elder: [
    "dashboard:read",
    "vitals:read",
    "medications:read",
    "exams:read",
    "allergies:read",
    "nutrition:read",
    "profile:read",
  ],
};

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
  role: AuthRole;
  permissions: AuthPermission[];
  createdAt: string;
  updatedAt: string;
};

type LoginEvent = {
  username: string;
  status: "success" | "failure";
  timestamp: string;
};

type AuthDatabase = {
  users: AuthUser[];
  loginEvents: LoginEvent[];
};

export type AuthSession = {
  isAuthenticated: boolean;
  username: string;
  role: AuthRole;
  permissions: AuthPermission[];
  loginAt: string;
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

function migrateUser(user: Partial<AuthUser>): AuthUser {
  const role: AuthRole = user.role || "caregiver";
  const now = new Date().toISOString();
  return {
    username: user.username || "",
    password: user.password || "",
    elderName: user.elderName || "",
    caregiverName: user.caregiverName,
    role,
    permissions: user.permissions?.length ? user.permissions : ROLE_PERMISSIONS[role],
    createdAt: user.createdAt || now,
    updatedAt: user.updatedAt || now,
  };
}

function readAuthDatabase(): AuthDatabase {
  const saved = localStorage.getItem(AUTH_DB_KEY);
  if (!saved) return { users: [], loginEvents: [] };

  const parsed = JSON.parse(saved) as Partial<AuthDatabase>;
  return {
    users: (parsed.users || []).map((user) => migrateUser(user)),
    loginEvents: parsed.loginEvents || [],
  };
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

  const fallback = { elderName: patient.name, birthDate: patient.birthDate };
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
  const now = new Date().toISOString();

  const nextUser: AuthUser = {
    username,
    password,
    elderName: profile.elderName,
    caregiverName: profile.caregiverName,
    role: "caregiver",
    permissions: ROLE_PERMISSIONS.caregiver,
    createdAt: index >= 0 ? db.users[index].createdAt : now,
    updatedAt: now,
  };

  if (index >= 0) {
    db.users[index] = nextUser;
  } else {
    db.users.push(nextUser);
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

function recordLoginEvent(username: string, status: "success" | "failure") {
  const db = readAuthDatabase();
  db.loginEvents.push({ username, status, timestamp: new Date().toISOString() });
  db.loginEvents = db.loginEvents.slice(-100);
  writeAuthDatabase(db);
}

export function authenticateUser(username: string, password: string): AuthSession | null {
  const normalizedUsername = username.trim().toLowerCase();
  const normalizedPassword = password.replace(/\D/g, "");
  const db = readAuthDatabase();
  const matched = db.users.find(
    (user) => user.username === normalizedUsername && user.password === normalizedPassword,
  );

  if (!matched) {
    recordLoginEvent(normalizedUsername || "unknown", "failure");
    return null;
  }

  const session: AuthSession = {
    isAuthenticated: true,
    username: matched.username,
    role: matched.role,
    permissions: matched.permissions,
    loginAt: new Date().toISOString(),
  };

  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
  recordLoginEvent(matched.username, "success");
  return session;
}

export function getAuthSession(): AuthSession | null {
  const saved = localStorage.getItem(AUTH_SESSION_KEY);
  if (!saved) return null;

  try {
    const session = JSON.parse(saved) as AuthSession;
    if (!session.isAuthenticated) return null;
    return session;
  } catch {
    return null;
  }
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_SESSION_KEY);
}

export function hasPermission(session: AuthSession | null, permission: AuthPermission) {
  return !!session?.permissions.includes(permission);
}

export function validateUserCredentials(username: string, password: string) {
  return authenticateUser(username, password) !== null;
}

export function getDashboardNames() {
  const profile = getAuthProfile();

  const caregiverName = profile.caregiverName?.trim() || "Cuidador";

  const savedElder = localStorage.getItem(ELDER_INFO_KEY);
  if (savedElder) {
    const elder = JSON.parse(savedElder) as { name?: string };
    if (elder.name?.trim()) {
      return { caregiverName, patientName: elder.name.trim() };
    }
  }

  return { caregiverName, patientName: profile.elderName || patient.name };
}
