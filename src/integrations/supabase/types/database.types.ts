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
      favorites: {
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
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          role: string | null
          updated_at: string
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
      sessions: {
        Row: {
          conversation_id: string | null
          created_at: string
          duration: number | null
          feedback: string | null
          id: string
          summary: string | null
          transcript: string | null
          user_id: string
          metadata: {
            call_duration_secs?: number
          } | null
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string
          duration?: number | null
          feedback?: string | null
          id?: string
          summary?: string | null
          transcript?: string | null
          user_id: string
          metadata?: {
            call_duration_secs?: number
          } | null
        }
        Update: {
          conversation_id?: string | null
          created_at?: string
          duration?: number | null
          feedback?: string | null
          id?: string
          summary?: string | null
          transcript?: string | null
          user_id?: string
          metadata?: {
            call_duration_secs?: number
          } | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_invitation: {
        Args: {
          invitation_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}