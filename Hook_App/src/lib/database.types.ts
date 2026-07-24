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
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          age: number | null
          gender: string | null
          interested_in: string | null
          interests: string[] | null
          university_id: string | null
          phone: string | null
          verified: boolean
          is_banned: boolean
          created_at: string
        }
        Insert: {
          id?: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          age?: number | null
          gender?: string | null
          interested_in?: string | null
          interests?: string[] | null
          university_id?: string | null
          phone?: string | null
          verified?: boolean
          is_banned?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          age?: number | null
          gender?: string | null
          interested_in?: string | null
          interests?: string[] | null
          university_id?: string | null
          phone?: string | null
          verified?: boolean
          is_banned?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_university_id_fkey"
            columns: ["university_id"]
            referencedRelation: "universities"
            referencedColumns: ["id"]
          }
        ]
      }
      universities: {
        Row: {
          id: string
          name: string
          email_domain: string | null
          badge_label: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email_domain: string
          badge_label?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email_domain?: string
          badge_label?: string | null
          created_at?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          id: string
          user_id: string
          type: "photo" | "video" | "gallery"
          media: Json[]
          caption: string | null
          audience: "everyone" | "matches" | "university"
          created_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          type: "photo" | "video" | "gallery"
          media: Json[]
          caption?: string | null
          audience?: "everyone" | "matches" | "university"
          created_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          type?: "photo" | "video" | "gallery"
          media?: Json[]
          caption?: string | null
          audience?: "everyone" | "matches" | "university"
          created_at?: string
          deleted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      posts_like: {
        Row: {
          post_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          post_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          post_id?: string
          user_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_post_id_fkey"
            columns: ["post_id"]
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profile_likes: {
        Row: {
          liker_id: string
          liked_id: string
          created_at: string
        }
        Insert: {
          liker_id: string
          liked_id: string
          created_at?: string
        }
        Update: {
          liker_id?: string
          liked_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_likes_liker_id_fkey"
            columns: ["liker_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_likes_liked_id_fkey"
            columns: ["liked_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      stories: {
        Row: {
          id: string
          user_id: string
          media_url: string
          type: "photo" | "video"
          created_at: string
          expires_at: string
        }
        Insert: {
          id?: string
          user_id: string
          media_url: string
          type: "photo" | "video"
          created_at?: string
          expires_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          media_url?: string
          type?: "photo" | "video"
          created_at?: string
          expires_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stories_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      story_views: {
        Row: {
          story_id: string
          viewer_id: string
          viewed_at: string
        }
        Insert: {
          story_id: string
          viewer_id: string
          viewed_at?: string
        }
        Update: {
          story_id?: string
          viewer_id?: string
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_views_story_id_fkey"
            columns: ["story_id"]
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "story_views_viewer_id_fkey"
            columns: ["viewer_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      threads: {
        Row: {
          id: string
          user_a: string
          user_b: string
          status: "pending" | "matched"
          initiator_id: string | null
          message_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_a: string
          user_b: string
          status?: "pending" | "matched"
          initiator_id?: string | null
          message_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_a?: string
          user_b?: string
          status?: "pending" | "matched"
          initiator_id?: string | null
          message_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "threads_user_a_fkey"
            columns: ["user_a"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "threads_user_b_fkey"
            columns: ["user_b"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "threads_initiator_id_fkey"
            columns: ["initiator_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      messages: {
        Row: {
          id: string
          thread_id: string
          sender_id: string
          content: string
          created_at: string
          read_at: string | null
        }
        Insert: {
          id?: string
          thread_id: string
          sender_id: string
          content: string
          created_at?: string
          read_at?: string | null
        }
        Update: {
          id?: string
          thread_id?: string
          sender_id?: string
          content?: string
          created_at?: string
          read_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_thread_id_fkey"
            columns: ["thread_id"]
            referencedRelation: "threads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      surprise_queue: {
        Row: {
          id: string
          user_id: string
          status: "waiting" | "in_call"
          joined_at: string
        }
        Insert: {
          id?: string
          user_id: string
          status?: "waiting" | "in_call"
          joined_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          status?: "waiting" | "in_call"
          joined_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "surprise_queue_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      surprise_sessions: {
        Row: {
          id: string
          user_a: string
          user_b: string
          signaling_channel: string | null
          started_at: string
          ended_at: string | null
        }
        Insert: {
          id?: string
          user_a: string
          user_b: string
          signaling_channel?: string | null
          started_at?: string
          ended_at?: string | null
        }
        Update: {
          id?: string
          user_a?: string
          user_b?: string
          signaling_channel?: string | null
          started_at?: string
          ended_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "surprise_sessions_user_a_fkey"
            columns: ["user_a"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "surprise_sessions_user_b_fkey"
            columns: ["user_b"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      surprise_saves: {
        Row: {
          user_id: string
          saved_user_id: string
          session_id: string | null
          created_at: string
        }
        Insert: {
          user_id: string
          saved_user_id: string
          session_id?: string | null
          created_at?: string
        }
        Update: {
          user_id?: string
          saved_user_id?: string
          session_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "surprise_saves_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "surprise_saves_saved_user_id_fkey"
            columns: ["saved_user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "surprise_saves_session_id_fkey"
            columns: ["session_id"]
            referencedRelation: "surprise_sessions"
            referencedColumns: ["id"]
          }
        ]
      }
      blocks: {
        Row: {
          blocker_id: string
          blocked_id: string
          created_at: string
        }
        Insert: {
          blocker_id: string
          blocked_id: string
          created_at?: string
        }
        Update: {
          blocker_id?: string
          blocked_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blocks_blocker_id_fkey"
            columns: ["blocker_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blocks_blocked_id_fkey"
            columns: ["blocked_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      reports: {
        Row: {
          id: string
          reporter_id: string
          reported_user_id: string
          context_type: "post" | "profile" | "surprise_session" | "message"
          context_id: string | null
          reason: string
          status: "open" | "reviewed" | "actioned"
          created_at: string
        }
        Insert: {
          id?: string
          reporter_id: string
          reported_user_id: string
          context_type: "post" | "profile" | "surprise_session" | "message"
          context_id?: string | null
          reason: string
          status?: "open" | "reviewed" | "actioned"
          created_at?: string
        }
        Update: {
          id?: string
          reporter_id?: string
          reported_user_id?: string
          context_type?: "post" | "profile" | "surprise_session" | "message"
          context_id?: string | null
          reason?: string
          status?: "open" | "reviewed" | "actioned"
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_reporter_id_fkey"
            columns: ["reporter_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reported_user_id_fkey"
            columns: ["reported_user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: "new_match" | "new_message" | "story_view" | "like" | "profile_like"
          payload: Json | null
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: "new_match" | "new_message" | "story_view" | "like" | "profile_like"
          payload?: Json | null
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: "new_match" | "new_message" | "story_view" | "like" | "profile_like"
          payload?: Json | null
          read_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      events: {
        Row: {
          id: string
          user_id: string | null
          event_name: string
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          event_name: string
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          event_name?: string
          metadata?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      matches_view: {
        Row: {
          thread_id: string
          user_a: string
          user_b: string
          status: string
          message_count: number
          created_at: string
          updated_at: string
          user_a_username: string | null
          user_a_avatar: string | null
          user_b_username: string | null
          user_b_avatar: string | null
        }
      }
      suggested_matches: {
        Row: {
          id: string
          username: string | null
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          age: number | null
          gender: string | null
          interests: string[] | null
          university_name: string | null
        }
      }
      active_stories_view: {
        Row: {
          id: string
          user_id: string
          media_url: string
          type: string
          created_at: string
          expires_at: string
          username: string | null
          avatar_url: string | null
        }
      }
    }
    Functions: {
      get_matched_profiles: {
        Args: Record<string, never>
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
      not_blocked: {
        Args: { user_a: string; user_b: string }
        Returns: boolean
      }
      log_event: {
        Args: { event_name: string; metadata?: Json }
        Returns: string
      }
    }
    Enums: {
      post_type: "photo" | "video" | "gallery"
      post_audience: "everyone" | "matches" | "university"
      story_type: "photo" | "video"
      thread_status: "pending" | "matched"
      surprise_status: "waiting" | "in_call"
      report_context: "post" | "profile" | "surprise_session" | "message"
      report_status: "open" | "reviewed" | "actioned"
      notification_type: "new_match" | "new_message" | "story_view" | "like" | "profile_like"
    }
  }
}
