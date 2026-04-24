import { UserRole, UserStatus } from '@/enums';

// ─── User ───────────────────────────────────────────────────────────────────

export interface IProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface IUser {
  _id: string;
  id: string;
  email: string;
  profile: IProfile;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  avatarUrl?: string;
  status?: UserStatus;
  lastLoginDate?: Date;
}

export interface IOnLogin {
  token: string;
  user: IUser;
}

export interface IUserMeResponse {
  user: IUser;
}

// ─── Shared ──────────────────────────────────────────────────────────────────

export interface IPaginatedResponse<T> {
  data: T[];
  nextCursor: string | null;
}

export interface IAppContext {
  loggedUser: IUser | null;
  token: string | null;
  updateLoggedUser: (user: IUser | null) => void;
  updateToken: (token: string | null) => void;
}
