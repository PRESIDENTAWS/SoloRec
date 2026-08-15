export interface Contact {
  id: string;
  organizationId: string;
  clientId: string;
  firstName: string;
  lastName: string;
  title?: string;
  email?: string;
  phone?: string;
  isPrimary: boolean;
}
