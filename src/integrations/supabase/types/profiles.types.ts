export interface ProfilesTable {
  Row: {
    id: string;
    avatar_url: string | null;
    role: string | null;
    created_at: string;
    updated_at: string;
    first_name: string | null;
    last_name: string | null;
  };
  Insert: {
    id: string;
    avatar_url?: string | null;
    role?: string | null;
    created_at?: string;
    updated_at?: string;
    first_name?: string | null;
    last_name?: string | null;
  };
  Update: {
    id?: string;
    avatar_url?: string | null;
    role?: string | null;
    created_at?: string;
    updated_at?: string;
    first_name?: string | null;
    last_name?: string | null;
  };
  Relationships: [];
}