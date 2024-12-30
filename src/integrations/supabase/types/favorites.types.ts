export interface FavoritesTable {
  Row: {
    id: string;
    user_id: string;
    session_id: string;
    created_at: string;
  };
  Insert: {
    id?: string;
    user_id: string;
    session_id: string;
    created_at?: string;
  };
  Update: {
    id?: string;
    user_id?: string;
    session_id?: string;
    created_at?: string;
  };
  Relationships: [
    {
      foreignKeyName: "favorites_session_id_fkey";
      columns: ["session_id"];
      isOneToOne: false;
      referencedRelation: "sessions";
      referencedColumns: ["id"];
    }
  ];
}