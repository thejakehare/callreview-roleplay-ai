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
            start_time_unix_secs?: number
            call_duration_secs?: number
            cost?: number
            feedback?: {
              overall_score?: number | null
              likes?: number
              dislikes?: number
            }
            authorization_method?: string
            charging?: {
              dev_discount?: boolean
            }
          } | null
          analysis: {
            evaluation_criteria_results?: Record<string, any>
            data_collection_results?: {
              Topic?: {
                data_collection_id?: string
                value?: string
                json_schema?: {
                  type?: string
                  description?: string
                }
                rationale?: string
              }
            }
            call_successful?: string
            transcript_summary?: string
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
            start_time_unix_secs?: number
            call_duration_secs?: number
            cost?: number
            feedback?: {
              overall_score?: number | null
              likes?: number
              dislikes?: number
            }
            authorization_method?: string
            charging?: {
              dev_discount?: boolean
            }
          } | null
          analysis?: {
            evaluation_criteria_results?: Record<string, any>
            data_collection_results?: {
              Topic?: {
                data_collection_id?: string
                value?: string
                json_schema?: {
                  type?: string
                  description?: string
                }
                rationale?: string
              }
            }
            call_successful?: string
            transcript_summary?: string
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
            start_time_unix_secs?: number
            call_duration_secs?: number
            cost?: number
            feedback?: {
              overall_score?: number | null
              likes?: number
              dislikes?: number
            }
            authorization_method?: string
            charging?: {
              dev_discount?: boolean
            }
          } | null
          analysis?: {
            evaluation_criteria_results?: Record<string, any>
            data_collection_results?: {
              Topic?: {
                data_collection_id?: string
                value?: string
                json_schema?: {
                  type?: string
                  description?: string
                }
                rationale?: string
              }
            }
            call_successful?: string
            transcript_summary?: string
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