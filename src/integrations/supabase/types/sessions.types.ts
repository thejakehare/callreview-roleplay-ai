import { Json } from './json.types';

interface SessionMetadata {
  start_time_unix_secs?: number;
  call_duration_secs?: number;
  cost?: number;
  feedback?: {
    overall_score?: number | null;
    likes?: number;
    dislikes?: number;
  };
  authorization_method?: string;
  charging?: {
    dev_discount?: boolean;
  };
}

interface SessionAnalysis {
  evaluation_criteria_results?: Record<string, any>;
  data_collection_results?: {
    Topic?: {
      data_collection_id?: string;
      value?: string;
      json_schema?: {
        type?: string;
        description?: string;
      };
      rationale?: string;
    };
  };
  call_successful?: string;
  transcript_summary?: string;
}

export interface SessionsTable {
  Row: {
    id: string;
    user_id: string;
    created_at: string;
    duration: number | null;
    summary: string | null;
    feedback: string | null;
    conversation_id: string | null;
    transcript: string | null;
    agent_id: string | null;
    status: string | null;
    start_time_unix_secs: number | null;
    cost: number | null;
    feedback_score: number | null;
    feedback_likes: number | null;
    feedback_dislikes: number | null;
    authorization_method: string | null;
    dev_discount: boolean | null;
    topic_collection_id: string | null;
    topic_value: string | null;
    topic_schema: Json | null;
    topic_rationale: string | null;
    call_successful: string | null;
    metadata: SessionMetadata | null;
    analysis: SessionAnalysis | null;
  };
  Insert: {
    id?: string;
    user_id: string;
    created_at?: string;
    duration?: number | null;
    summary?: string | null;
    feedback?: string | null;
    conversation_id?: string | null;
    transcript?: string | null;
    agent_id?: string | null;
    status?: string | null;
    start_time_unix_secs?: number | null;
    cost?: number | null;
    feedback_score?: number | null;
    feedback_likes?: number | null;
    feedback_dislikes?: number | null;
    authorization_method?: string | null;
    dev_discount?: boolean | null;
    topic_collection_id?: string | null;
    topic_value?: string | null;
    topic_schema?: Json | null;
    topic_rationale?: string | null;
    call_successful?: string | null;
    metadata?: SessionMetadata | null;
    analysis?: SessionAnalysis | null;
  };
  Update: {
    id?: string;
    user_id?: string;
    created_at?: string;
    duration?: number | null;
    summary?: string | null;
    feedback?: string | null;
    conversation_id?: string | null;
    transcript?: string | null;
    agent_id?: string | null;
    status?: string | null;
    start_time_unix_secs?: number | null;
    cost?: number | null;
    feedback_score?: number | null;
    feedback_likes?: number | null;
    feedback_dislikes?: number | null;
    authorization_method?: string | null;
    dev_discount?: boolean | null;
    topic_collection_id?: string | null;
    topic_value?: string | null;
    topic_schema?: Json | null;
    topic_rationale?: string | null;
    call_successful?: string | null;
    metadata?: SessionMetadata | null;
    analysis?: SessionAnalysis | null;
  };
  Relationships: [];
}