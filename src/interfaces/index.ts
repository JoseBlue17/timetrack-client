import { UserRole, UserStatus } from '@/enums';

export interface IProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position?: string;
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

export interface IPayment {
  _id: string;
  id: string;
  userId: string;
  reportId: string;
  network: string;
  walletAddress: string;
  amountExpected: number;
  amountReceived: number;
  txid?: string;
  status: string;
  confirmations: number;
  detectedAt?: Date;
  paidAt?: Date;
  expiresAt: Date;
  rawBlockchainData?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  firstName?: string;
  lastName?: string;
}

export interface IWallet {
  _id: string;
  id: string;
  userId: string;
  network: string;
  walletAddress: string;
  isDefault: boolean;
  status: string;
  label?: string;
  createdAt: Date;
  updatedAt: Date;
}
