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
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          age: number | null
          gender: string | null
          interests: string[] | null
          university_id: string | null
          phone: string | null
          verified: boolean
          is_banned: boolean
          created_at: string
          updated_at: string
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      universities: {
        Row: {
          id: string
          name: string
          email_domain: string | null
          created_at: string
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      posts: {
        Row: {
          id: string
          user_id: string
          type: string
          media: Json[] | null
          caption: string | null
          audience: string
          created_at: string
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      posts_like: {
        Row: {
          id: string
          post_id: string
          user_id: string
          created_at: string
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      profile_likes: {
        Row: {
          id: string
          liker_id: string
          liked_id: string
          created_at: string
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      stories: {
        Row: {
          id: string
          user_id: string
          media_url: string
          type: string
          expires_at: string
          created_at: string
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      story_views: {
        Row: {
          id: string
          story_id: string
          viewer_id: string
          created_at: string
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      threads: {
        Row: {
          id: string
          user_a: string
          user_b: string
          status: string
          message_count: number
          created_at: string
          updated_at: string
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      messages: {
        Row: {
          id: string
          thread_id: string
          sender_id: string
          content: string
          created_at: string
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      surprise_queue: {
        Row: {
          id: string
          user_id: string
          status: string
          created_at: string
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      surprise_sessions: {
        Row: {
          id: string
          user_a: string
          user_b: string
          signaling_channel: string | null
          created_at: string
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      surprise_saves: {
        Row: {
          id: string
          user_id: string
          saved_user_id: string
          session_id: string | null
          created_at: string
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      blocks: {
        Row: {
          id: string
          blocker_id: string
          blocked_id: string
          created_at: string
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      reports: {
        Row: {
          id: string
          reporter_id: string
          reported_user_id: string
          context_type: string | null
          reason: string
          status: string
          created_at: string
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          payload: Json | null
          read_at: string | null
          created_at: string
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      analytic_events: {
        Row: {
          id: string
          user_id: string | null
          event_type: string
          payload: Json | null
          created_at: string
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
    }
    Views: {
      matches_view: {
        Row: {
          id: string
          user_a: string
          user_b: string
          status: string
          user_name: string | null
          user_avatar: string | null
          user_uni: string | null
        }
      }
      suggested_matches: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          age: number | null
          university_name: string | null
        }
      }
      active_stories_view: {
        Row: {
          id: string
          user_id: string
          media_url: string
          type: string
          expires_at: string
          created_at: string
        }
      }
    }
    Functions: {
      get_matched_profiles: {
        Args: Record<string, unknown>
        Returns: {
          user_id: string
          full_name: string | null
          avatar_url: string | null
          university_name: string | null
          thread_id: string
        }[]
      }
      get_random_profile: {
        Args: { current_user_id: string }
        Returns: {
          id: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          age: number | null
          university_name: string | null
        }[]
      }
    }
  }
}
