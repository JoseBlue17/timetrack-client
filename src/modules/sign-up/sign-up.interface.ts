export interface SignUpValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ISignUpFormProps {
  onSubmit: (values: SignUpValues) => void;
  isPending: boolean;
}

export interface SignUpResponse {
  token: string;
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
  };
}
