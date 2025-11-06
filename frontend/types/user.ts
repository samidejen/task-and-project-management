export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "project_manager" | "employee";
  createdAt: string;
  updatedAt: string;
}

/** Auth requests */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: "admin" | "project_manager" | "employee";
}

/** Auth responses */
export interface LoginResponse {
  user: User;
  token: string;
}
