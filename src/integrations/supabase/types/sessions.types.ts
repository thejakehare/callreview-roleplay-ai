export interface SessionsTable {
  Row: {
    id: string
    user_id: string
    created_at: string
    duration: number | null
    summary: string | null
    feedback: string | null
    conversation_id: string | null
    transcript: string | null
    agent_id: string | null
    status: string | null
    start_time_unix_secs: number | null
    cost: number | null
    feedback_score: number | null
    feedback_likes: number | null
    feedback_dislikes: number | null
    authorization_method: string | null
    dev_discount: boolean | null
    topic_collection_id: string | null
    topic_value: string | null
    topic_schema: Json | null
    topic_rationale: string | null
    call_successful: string | null
  }
  Insert: {
    id?: string
    user_id: string
    created_at?: string
    duration?: number | null
    summary?: string | null
    feedback?: string | null
    conversation_id?: string | null
    transcript?: string | null
    agent_id?: string | null
    status?: string | null
    start_time_unix_secs?: number | null
    cost?: number | null
    feedback_score?: number | null
    feedback_likes?: number | null
    feedback_dislikes?: number | null
    authorization_method?: string | null
    dev_discount?: boolean | null
    topic_collection_id?: string | null
    topic_value?: string | null
    topic_schema?: Json | null
    topic_rationale?: string | null
    call_successful?: string | null
  }
  Update: {
    id?: string
    user_id?: string
    created_at?: string
    duration?: number | null
    summary?: string | null
    feedback?: string | null
    conversation_id?: string | null
    transcript?: string | null
    agent_id?: string | null
    status?: string | null
    start_time_unix_secs?: number | null
    cost?: number | null
    feedback_score?: number | null
    feedback_likes?: number | null
    feedback_dislikes?: number | null
    authorization_method?: string | null
    dev_discount?: boolean | null
    topic_collection_id?: string | null
    topic_value?: string | null
    topic_schema?: Json | null
    topic_rationale?: string | null
    call_successful?: string | null
  }
  Relationships: []
}