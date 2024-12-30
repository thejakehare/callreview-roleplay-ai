import { Json } from './json.types';
import { SessionsTable } from './sessions.types';
import { ProfilesTable } from './profiles.types';
import { FavoritesTable } from './favorites.types';

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