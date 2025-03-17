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
      admin_access: {
        Row: {
          id: string
          admin_id: string
          accessed_user_id: string
          accessed_at: string
          access_reason: string | null
        }
        Insert: {
          id?: string
          admin_id: string
          accessed_user_id: string
          accessed_at?: string
          access_reason?: string | null
        }
        Update: {
          id?: string
          admin_id?: string
          accessed_user_id?: string
          accessed_at?: string
          access_reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_access_admin_id_fkey"
            columns: ["admin_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_access_accessed_user_id_fkey"
            columns: ["accessed_user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_requests: {
        Row: {
          id: string
          user_id: string
          interests: string[]
          other_interest: string | null
          name: string
          email: string
          youtube_link: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          interests: string[]
          other_interest?: string | null
          name: string
          email: string
          youtube_link: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          interests?: string[]
          other_interest?: string | null
          name?: string
          email?: string
          youtube_link?: string
          status?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_requests_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_secure_identifier: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_by_secure_id: {
        Args: {
          secure_id: string
          admin_id: string
          reason?: string
        }
        Returns: Json
      }
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      version: {
        Args: Record<PropertyKey, never>
        Returns: string
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