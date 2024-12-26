export interface Account {
  id: string;
  name: string;
  created_at: string;
}

export interface AccountMember {
  id: string;
  account_id: string;
  user_id: string;
  role: 'admin' | 'member';
  created_at: string;
}