export interface Usuario {
  userId?: number;
  userName?: string;
  documento?: string;
  password?: string;
  roleId?: number;
  roleRelated?: {
    name: string
  }
}
