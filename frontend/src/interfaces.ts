// interfaces.ts
export interface Ticket {
  id: number;
  name: string;
  email: string;
  description: string;
  status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED';
  created_at: string;
  updated_at: string;
  reply: string | null;
}