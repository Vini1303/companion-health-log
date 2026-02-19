import { beforeEach, describe, expect, it } from "vitest";
import {
  AUTH_DB_KEY,
  AUTH_SESSION_KEY,
  authenticateUser,
  createUser,
  getAuthSession,
  hasPermission,
} from "@/lib/auth";

describe("auth database and acl", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("stores user and logs successful login", () => {
    createUser({
      elderName: "Maria da Silva",
      birthDate: "2003-11-01",
      caregiverName: "Ana Souza",
    });

    const session = authenticateUser("maria.silva", "01112003");

    expect(session).not.toBeNull();
    expect(session?.role).toBe("caregiver");
    expect(hasPermission(session, "contacts:read")).toBe(true);

    const db = JSON.parse(localStorage.getItem(AUTH_DB_KEY) || "{}");
    expect(db.users).toHaveLength(1);
    expect(db.loginEvents.at(-1).status).toBe("success");
  });

  it("records failed login attempt and does not create session", () => {
    createUser({
      elderName: "João de Lima",
      birthDate: "2000-01-20",
      caregiverName: "Julia",
    });

    const session = authenticateUser("joao.lima", "senhaerrada");

    expect(session).toBeNull();
    expect(localStorage.getItem(AUTH_SESSION_KEY)).toBeNull();

    const db = JSON.parse(localStorage.getItem(AUTH_DB_KEY) || "{}");
    expect(db.loginEvents.at(-1).status).toBe("failure");
  });

  it("hydrates valid session from storage", () => {
    createUser({
      elderName: "Pedro Alves",
      birthDate: "1998-10-10",
      caregiverName: "Carlos",
    });
    authenticateUser("pedro.alves", "10101998");

    const stored = getAuthSession();

    expect(stored?.isAuthenticated).toBe(true);
    expect(stored?.username).toBe("pedro.alves");
  });
});
