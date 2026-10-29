import type { UserRole } from './user-role.enum.js';

export type AuthenticatedUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  tokenVersion: number;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  inactivatedAt: string | null;
  inactivatedBy: number | null;
};

export type JwtPayload = {
  sub: number;
  role: UserRole;
  tokenVersion: number;
};
