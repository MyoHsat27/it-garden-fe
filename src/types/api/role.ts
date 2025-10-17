export interface Role {
  id: number;
  name: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: number;
  subject: string;
  action: string;
}
