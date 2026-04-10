
import React from "react"



export type RoleUser="admin" | "customer" | "guest"
export type User = {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  role: RoleUser;
};
export type AuthContextValue = {
  user: User | null;
  loading: boolean;
  error: string | null;
  setError: (message: string | null) => void;
};


export type ProtectedRouteProps = {
  redirectTo?: string; // default: /login
  requiredRole?:RoleUser[]
  laodingEffect?: React.ReactNode; // custom loader UI
};
