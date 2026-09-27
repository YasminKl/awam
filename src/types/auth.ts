export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string | null;
  role: 'user' | 'admin';
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
}


export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
}