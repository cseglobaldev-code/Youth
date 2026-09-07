export interface PortalRole {
  id: number;
  name: string;
  description: string;
  type: string;
}

export interface PortalUser {
  id: number;
  username: string;
  email: string;
  confirmed?: boolean;
  blocked?: boolean;
  role?: PortalRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  jwt: string;
  user: PortalUser;
}