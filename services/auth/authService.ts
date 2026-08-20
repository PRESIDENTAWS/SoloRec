import type { PortalRole } from "@/lib/auth/roles";
import { roleHome } from "@/lib/auth/roles";

/**
 * Authentication seam.
 *
 * One identity system, role-based access. This starter has no live backend, so
 * the mock implementation "authenticates" by role and returns a session plus
 * the post-login destination. A real implementation (Supabase Auth — see
 * docs/architecture/03-security-and-tenancy.md) swaps in here without changing
 * the login UI or the portals: the same `Session` shape and `roleHome`
 * redirect drive everything.
 */

export interface Session {
  userId: string;
  name: string;
  email: string;
  role: PortalRole;
  organizationId?: string;
}

export interface LoginResult {
  session: Session;
  /** Where the caller should navigate after login. */
  redirectTo: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
  role: PortalRole;
}

const MOCK_NAMES: Record<PortalRole, string> = {
  admin: "Alex Morgan",
  recruiter: "Alex Morgan",
  client: "Jordan Blake",
  candidate: "Sam Rivera"
};

export interface AuthService {
  login(credentials: AuthCredentials): Promise<LoginResult>;
  getSession(): Promise<Session | null>;
}

class MockAuthService implements AuthService {
  async login(credentials: AuthCredentials): Promise<LoginResult> {
    // Mock: no credential check. Real impl verifies against Supabase Auth and
    // reads the role off the authenticated user, ignoring any client-sent role.
    const session: Session = {
      userId: `user-${credentials.role}`,
      name: MOCK_NAMES[credentials.role],
      email: credentials.email || `${credentials.role}@example.com`,
      role: credentials.role,
      organizationId: "org-demo"
    };
    return { session, redirectTo: roleHome(credentials.role) };
  }

  async getSession(): Promise<Session | null> {
    // Mock: no persisted session in this starter.
    return null;
  }
}

export const authService: AuthService = new MockAuthService();
