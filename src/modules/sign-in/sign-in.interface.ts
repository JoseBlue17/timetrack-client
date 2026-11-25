export interface SignInValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface ISignInFormProps {
  onSubmit: (values: SignInValues) => void;
  isPending: boolean;
}

export interface SignInResponse {
  token?: string;
  user: {
    _id: string;
    id: string;
    email: string;
    profile: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    };
    role: string;
    createdAt: Date;
    updatedAt: Date;
    avatarUrl?: string;
  };
}
