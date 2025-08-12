// src/types/auth.ts
export type LoginPayload = {
  email: string;
  password: string;
};

export type SsoPayload = {
  token: string;
};

export type User = {
  id: string | number;
  name: string;
  email: string;
  role?: string;
};

export type AuthResponse = {
  success: boolean;
  message?: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
    user?: User;
  };
};

export type LoginResponse = AuthResponse;

export type SsoResponse = AuthResponse;

export type RoleResponse = {
  success: boolean;
  message?: string;
  data?: {
    role: string;        
    permissions?: string[]; 
  };
};
