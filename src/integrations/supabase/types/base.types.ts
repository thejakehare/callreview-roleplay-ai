export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      favorites: FavoritesTable
      profiles: ProfilesTable
      sessions: SessionsTable
    }
    Views: {
      [_ in never]: never
    }
    Functions: DatabaseFunctions
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

interface DatabaseFunctions {
  accept_invitation: {
    Args: {
      invitation_id: string
    }
    Returns: boolean
  }
}

interface FavoritesTable {
  Row: {
    created_at: string
    id: string
    session_id: string
    user_id: string
  }
  Insert: {
    created_at?: string
    id?: string
    session_id: string
    user_id: string
  }
  Update: {
    created_at?: string
    id?: string
    session_id?: string
    user_id?: string
  }
  Relationships: [
    {
      foreignKeyName: "favorites_session_id_fkey"
      columns: ["session_id"]
      isOneToOne: false
      referencedRelation: "sessions"
      referencedColumns: ["id"]
    }
  ]
}

interface ProfilesTable {
  Row: {
    id: string
    avatar_url: string | null
    role: string | null
    created_at: string
    updated_at: string
    first_name: string | null
    last_name: string | null
  }
  Insert: {
    avatar_url?: string | null
    created_at?: string
    first_name?: string | null
    id: string
    last_name?: string | null
    role?: string | null
    updated_at?: string
  }
  Update: {
    avatar_url?: string | null
    created_at?: string
    first_name?: string | null
    id?: string
    last_name?: string | null
    role?: string | null
    updated_at?: string
  }
  Relationships: []
}