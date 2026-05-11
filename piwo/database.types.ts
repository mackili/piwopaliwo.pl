export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      balance: {
        Row: {
          borrower_id: string
          created_at: string
          currency_balance: Json
          lender_id: string
        }
        Insert: {
          borrower_id: string
          created_at?: string
          currency_balance?: Json
          lender_id: string
        }
        Update: {
          borrower_id?: string
          created_at?: string
          currency_balance?: Json
          lender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "balance_borrower_id_fkey"
            columns: ["borrower_id"]
            isOneToOne: false
            referencedRelation: "UserInfo"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "balance_lender_id_fkey"
            columns: ["lender_id"]
            isOneToOne: false
            referencedRelation: "UserInfo"
            referencedColumns: ["userId"]
          },
        ]
      }
      consumed_drink: {
        Row: {
          created_at: string
          drank_at: string
          drink_type: Database["public"]["Enums"]["DrinkType"]
          id: string
          quantity: number
          user_id: string
        }
        Insert: {
          created_at?: string
          drank_at: string
          drink_type?: Database["public"]["Enums"]["DrinkType"]
          id?: string
          quantity: number
          user_id: string
        }
        Update: {
          created_at?: string
          drank_at?: string
          drink_type?: Database["public"]["Enums"]["DrinkType"]
          id?: string
          quantity?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "consumed_drink_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "UserInfo"
            referencedColumns: ["userId"]
          },
        ]
      }
      GameScore: {
        Row: {
          createdAt: string
          finishedAt: string | null
          id: string
          name: string
          ownerId: string
          status: string
        }
        Insert: {
          createdAt?: string
          finishedAt?: string | null
          id?: string
          name: string
          ownerId: string
          status?: string
        }
        Update: {
          createdAt?: string
          finishedAt?: string | null
          id?: string
          name?: string
          ownerId?: string
          status?: string
        }
        Relationships: []
      }
      group: {
        Row: {
          archived_at: string | null
          created_at: string
          currencies: Json
          description: string | null
          id: string
          name: string
          owner_id: string
          thumbnail_url: string | null
        }
        Insert: {
          archived_at?: string | null
          created_at?: string
          currencies?: Json
          description?: string | null
          id?: string
          name: string
          owner_id?: string
          thumbnail_url?: string | null
        }
        Update: {
          archived_at?: string | null
          created_at?: string
          currencies?: Json
          description?: string | null
          id?: string
          name?: string
          owner_id?: string
          thumbnail_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "UserInfo"
            referencedColumns: ["userId"]
          },
        ]
      }
      group_balance: {
        Row: {
          borrower_id: string
          currency_balance: Json
          group_id: string
          lender_id: string
          updated_at: string
        }
        Insert: {
          borrower_id: string
          currency_balance?: Json
          group_id: string
          lender_id: string
          updated_at?: string
        }
        Update: {
          borrower_id?: string
          currency_balance?: Json
          group_id?: string
          lender_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_balance_borrower_id_fkey"
            columns: ["borrower_id"]
            isOneToOne: false
            referencedRelation: "group_member"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_balance_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "group"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_balance_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "v_group_membership"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_balance_lender_id_fkey"
            columns: ["lender_id"]
            isOneToOne: false
            referencedRelation: "group_member"
            referencedColumns: ["id"]
          },
        ]
      }
      group_invitation: {
        Row: {
          accepted_at: string | null
          created_at: string
          group_id: string
          group_member_id: string
          rejected_at: string | null
          user_id: string
        }
        Insert: {
          accepted_at?: string | null
          created_at: string
          group_id: string
          group_member_id: string
          rejected_at?: string | null
          user_id: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          group_id?: string
          group_member_id?: string
          rejected_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_invitation_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "group"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_invitation_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "v_group_membership"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_invitation_group_member_id_fkey"
            columns: ["group_member_id"]
            isOneToOne: false
            referencedRelation: "group_member"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_invitation_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "UserInfo"
            referencedColumns: ["userId"]
          },
        ]
      }
      group_member: {
        Row: {
          added_at: string
          assigned_at: string | null
          group_id: string
          id: string
          nickname: string
          removed_at: string | null
          status: Database["public"]["Enums"]["acc_group_user_status"] | null
          user_id: string | null
        }
        Insert: {
          added_at: string
          assigned_at?: string | null
          group_id: string
          id?: string
          nickname: string
          removed_at?: string | null
          status?: Database["public"]["Enums"]["acc_group_user_status"] | null
          user_id?: string | null
        }
        Update: {
          added_at?: string
          assigned_at?: string | null
          group_id?: string
          id?: string
          nickname?: string
          removed_at?: string | null
          status?: Database["public"]["Enums"]["acc_group_user_status"] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_member_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "group"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_member_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "v_group_membership"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_member_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "UserInfo"
            referencedColumns: ["userId"]
          },
        ]
      }
      piwo_paliwo_member: {
        Row: {
          bio: string | null
          education: string[] | null
          fav_beer: string | null
          first_name: string
          id: string
          image_url: string | null
          location: string | null
          nickname: string | null
          user_id: string | null
        }
        Insert: {
          bio?: string | null
          education?: string[] | null
          fav_beer?: string | null
          first_name: string
          id?: string
          image_url?: string | null
          location?: string | null
          nickname?: string | null
          user_id?: string | null
        }
        Update: {
          bio?: string | null
          education?: string[] | null
          fav_beer?: string | null
          first_name?: string
          id?: string
          image_url?: string | null
          location?: string | null
          nickname?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "piwo_paliwo_member_bio_fkey"
            columns: ["bio"]
            isOneToOne: false
            referencedRelation: "TextDocument"
            referencedColumns: ["id"]
          },
        ]
      }
      TextDocument: {
        Row: {
          access: Database["public"]["Enums"]["TextDocumentAccess"]
          author: string
          banner_url: string | null
          created_at: string
          document_type:
            | Database["public"]["Enums"]["text_document_type"]
            | null
          id: string
          markdown: string | null
          status: Database["public"]["Enums"]["TextDocumentStatus"]
          thumbnail_url: string | null
          title: string | null
        }
        Insert: {
          access?: Database["public"]["Enums"]["TextDocumentAccess"]
          author?: string
          banner_url?: string | null
          created_at?: string
          document_type?:
            | Database["public"]["Enums"]["text_document_type"]
            | null
          id?: string
          markdown?: string | null
          status?: Database["public"]["Enums"]["TextDocumentStatus"]
          thumbnail_url?: string | null
          title?: string | null
        }
        Update: {
          access?: Database["public"]["Enums"]["TextDocumentAccess"]
          author?: string
          banner_url?: string | null
          created_at?: string
          document_type?:
            | Database["public"]["Enums"]["text_document_type"]
            | null
          id?: string
          markdown?: string | null
          status?: Database["public"]["Enums"]["TextDocumentStatus"]
          thumbnail_url?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "TextDocument_author_fkey1"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "UserInfo"
            referencedColumns: ["userId"]
          },
        ]
      }
      TextDocumentComment: {
        Row: {
          author_id: string
          id: string
          responding_to_comment_id: string | null
          text: string | null
          text_document_id: string
          time: string
        }
        Insert: {
          author_id: string
          id?: string
          responding_to_comment_id?: string | null
          text?: string | null
          text_document_id: string
          time?: string
        }
        Update: {
          author_id?: string
          id?: string
          responding_to_comment_id?: string | null
          text?: string | null
          text_document_id?: string
          time?: string
        }
        Relationships: [
          {
            foreignKeyName: "TextDocumentComment_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "UserInfo"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "TextDocumentComment_responding_to_comment_id_fkey"
            columns: ["responding_to_comment_id"]
            isOneToOne: false
            referencedRelation: "TextDocumentComment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "TextDocumentComment_text_document_id_fkey"
            columns: ["text_document_id"]
            isOneToOne: false
            referencedRelation: "TextDocument"
            referencedColumns: ["id"]
          },
        ]
      }
      transaction: {
        Row: {
          amount: number
          created_at: string
          currency_iso_code: string
          description: string | null
          group_id: string
          id: string
          paid_by_id: string
          split_type: Database["public"]["Enums"]["acc_transaction_split_type"]
        }
        Insert: {
          amount: number
          created_at?: string
          currency_iso_code?: string
          description?: string | null
          group_id: string
          id?: string
          paid_by_id: string
          split_type?: Database["public"]["Enums"]["acc_transaction_split_type"]
        }
        Update: {
          amount?: number
          created_at?: string
          currency_iso_code?: string
          description?: string | null
          group_id?: string
          id?: string
          paid_by_id?: string
          split_type?: Database["public"]["Enums"]["acc_transaction_split_type"]
        }
        Relationships: [
          {
            foreignKeyName: "transaction_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "group"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "v_group_membership"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_paid_by_fkey"
            columns: ["paid_by_id"]
            isOneToOne: false
            referencedRelation: "group_member"
            referencedColumns: ["id"]
          },
        ]
      }
      transaction_split: {
        Row: {
          amount: number
          balance_id: string | null
          borrower_id: string
          created_at: string
          group_id: string
          transaction_id: string
        }
        Insert: {
          amount: number
          balance_id?: string | null
          borrower_id: string
          created_at?: string
          group_id: string
          transaction_id: string
        }
        Update: {
          amount?: number
          balance_id?: string | null
          borrower_id?: string
          created_at?: string
          group_id?: string
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transaction_split_borrower_id_fkey"
            columns: ["borrower_id"]
            isOneToOne: false
            referencedRelation: "group_member"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_split_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "group"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_split_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "v_group_membership"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_split_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transaction"
            referencedColumns: ["id"]
          },
        ]
      }
      trip: {
        Row: {
          created_at: string
          created_by: string | null
          currency_iso_code: string
          description: string | null
          end_date: string
          group_id: string
          id: string
          last_modified_at: string | null
          last_modified_by: string | null
          location: string | null
          name: string
          start_date: string
          status: Database["public"]["Enums"]["trip_status"]
          text_document_id: string | null
          type: Database["public"]["Enums"]["trip_types"]
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          currency_iso_code: string
          description?: string | null
          end_date: string
          group_id: string
          id?: string
          last_modified_at?: string | null
          last_modified_by?: string | null
          location?: string | null
          name: string
          start_date: string
          status?: Database["public"]["Enums"]["trip_status"]
          text_document_id?: string | null
          type?: Database["public"]["Enums"]["trip_types"]
        }
        Update: {
          created_at?: string
          created_by?: string | null
          currency_iso_code?: string
          description?: string | null
          end_date?: string
          group_id?: string
          id?: string
          last_modified_at?: string | null
          last_modified_by?: string | null
          location?: string | null
          name?: string
          start_date?: string
          status?: Database["public"]["Enums"]["trip_status"]
          text_document_id?: string | null
          type?: Database["public"]["Enums"]["trip_types"]
        }
        Relationships: [
          {
            foreignKeyName: "trip_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "group"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "v_group_membership"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_text_document_id_fkey"
            columns: ["text_document_id"]
            isOneToOne: false
            referencedRelation: "TextDocument"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_feed_item: {
        Row: {
          created_at: string
          created_by: string
          id: number
          last_modified_at: string
          last_modified_by: string
          text_document_id: string
          trip_id: string
          type: Database["public"]["Enums"]["trip_feed_item_type"]
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: number
          last_modified_at: string
          last_modified_by: string
          text_document_id: string
          trip_id: string
          type?: Database["public"]["Enums"]["trip_feed_item_type"]
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: number
          last_modified_at?: string
          last_modified_by?: string
          text_document_id?: string
          trip_id?: string
          type?: Database["public"]["Enums"]["trip_feed_item_type"]
        }
        Relationships: [
          {
            foreignKeyName: "trip_feed_item_text_document_id_fkey"
            columns: ["text_document_id"]
            isOneToOne: false
            referencedRelation: "TextDocument"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_feed_item_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trip"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_feed_item_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "v_trip_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_feed_item_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "v_trip_financial_summary"
            referencedColumns: ["trip_id"]
          },
        ]
      }
      trip_participant: {
        Row: {
          created_at: string | null
          created_by: string | null
          group_member_id: string
          id: string
          last_modified_at: string | null
          last_modified_by: string | null
          role: Database["public"]["Enums"]["trip_participant_role"]
          status: Database["public"]["Enums"]["trip_participant_status"]
          trip_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          group_member_id: string
          id?: string
          last_modified_at?: string | null
          last_modified_by?: string | null
          role?: Database["public"]["Enums"]["trip_participant_role"]
          status?: Database["public"]["Enums"]["trip_participant_status"]
          trip_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          group_member_id?: string
          id?: string
          last_modified_at?: string | null
          last_modified_by?: string | null
          role?: Database["public"]["Enums"]["trip_participant_role"]
          status?: Database["public"]["Enums"]["trip_participant_status"]
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_participant_group_member_id_fkey"
            columns: ["group_member_id"]
            isOneToOne: false
            referencedRelation: "group_member"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_participant_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trip"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_participant_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "v_trip_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_participant_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "v_trip_financial_summary"
            referencedColumns: ["trip_id"]
          },
        ]
      }
      trip_transaction: {
        Row: {
          amount: number
          calculation_type: Database["public"]["Enums"]["trip_transaction_calculation_type"]
          category: Database["public"]["Enums"]["trip_transaction_category"]
          created_at: string
          created_by: string | null
          currency_iso_code: string
          description: string
          group_id: string
          id: string
          last_modified_at: string | null
          last_modified_by: string | null
          notes: string | null
          split_type: Database["public"]["Enums"]["acc_transaction_split_type"]
          status: Database["public"]["Enums"]["transaction_status"]
          transaction_split: Json
          trip_id: string
        }
        Insert: {
          amount?: number
          calculation_type?: Database["public"]["Enums"]["trip_transaction_calculation_type"]
          category: Database["public"]["Enums"]["trip_transaction_category"]
          created_at?: string
          created_by?: string | null
          currency_iso_code?: string
          description: string
          group_id: string
          id?: string
          last_modified_at?: string | null
          last_modified_by?: string | null
          notes?: string | null
          split_type?: Database["public"]["Enums"]["acc_transaction_split_type"]
          status?: Database["public"]["Enums"]["transaction_status"]
          transaction_split?: Json
          trip_id: string
        }
        Update: {
          amount?: number
          calculation_type?: Database["public"]["Enums"]["trip_transaction_calculation_type"]
          category?: Database["public"]["Enums"]["trip_transaction_category"]
          created_at?: string
          created_by?: string | null
          currency_iso_code?: string
          description?: string
          group_id?: string
          id?: string
          last_modified_at?: string | null
          last_modified_by?: string | null
          notes?: string | null
          split_type?: Database["public"]["Enums"]["acc_transaction_split_type"]
          status?: Database["public"]["Enums"]["transaction_status"]
          transaction_split?: Json
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_transaction_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "group"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_transaction_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "v_group_membership"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_transaction_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trip"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_transaction_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "v_trip_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_transaction_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "v_trip_financial_summary"
            referencedColumns: ["trip_id"]
          },
        ]
      }
      user_notification: {
        Row: {
          created_at: string
          details: Json | null
          id: number
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at: string
          details?: Json | null
          id?: number
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          details?: Json | null
          id?: number
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_notification_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "UserInfo"
            referencedColumns: ["userId"]
          },
        ]
      }
      UserInfo: {
        Row: {
          avatarUrl: string | null
          firstName: string | null
          lastName: string | null
          userId: string
        }
        Insert: {
          avatarUrl?: string | null
          firstName?: string | null
          lastName?: string | null
          userId: string
        }
        Update: {
          avatarUrl?: string | null
          firstName?: string | null
          lastName?: string | null
          userId?: string
        }
        Relationships: []
      }
      UserScore: {
        Row: {
          createdAt: string
          gameId: string
          history: number[]
          updatedAt: string
          userId: string
        }
        Insert: {
          createdAt?: string
          gameId: string
          history?: number[]
          updatedAt?: string
          userId: string
        }
        Update: {
          createdAt?: string
          gameId?: string
          history?: number[]
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "UserScore_userId_fkey1"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "UserInfo"
            referencedColumns: ["userId"]
          },
        ]
      }
    }
    Views: {
      v_group_balance: {
        Row: {
          borrower: Json | null
          borrower_id: string | null
          currency_balance: Json | null
          group_id: string | null
          lender: Json | null
          lender_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transaction_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "group"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "v_group_membership"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_paid_by_fkey"
            columns: ["lender_id"]
            isOneToOne: false
            referencedRelation: "group_member"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_split_borrower_id_fkey"
            columns: ["borrower_id"]
            isOneToOne: false
            referencedRelation: "group_member"
            referencedColumns: ["id"]
          },
        ]
      }
      v_group_daily_transaction_summary: {
        Row: {
          amount: number | null
          date: string | null
          group_id: string | null
          iso: string | null
          paid_by: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "transaction_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "group"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "v_group_membership"
            referencedColumns: ["id"]
          },
        ]
      }
      v_group_invitation: {
        Row: {
          accepted_at: string | null
          created_at: string | null
          group: Json | null
          group_id: string | null
          group_member: Json | null
          group_member_id: string | null
          rejected_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_invitation_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "group"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_invitation_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "v_group_membership"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_invitation_group_member_id_fkey"
            columns: ["group_member_id"]
            isOneToOne: false
            referencedRelation: "group_member"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_invitation_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "UserInfo"
            referencedColumns: ["userId"]
          },
        ]
      }
      v_group_member_net_balance: {
        Row: {
          group_id: string | null
          iso: string | null
          member: Json | null
          net_amount: number | null
          owed_amount: number | null
          paid_amount: number | null
          status: string | null
        }
        Relationships: []
      }
      v_group_membership: {
        Row: {
          archived_at: string | null
          created_at: string | null
          currencies: Json | null
          description: string | null
          id: string | null
          name: string | null
          owner_id: string | null
          thumbnail_url: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_member_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "UserInfo"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "group_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "UserInfo"
            referencedColumns: ["userId"]
          },
        ]
      }
      v_group_total_spending: {
        Row: {
          amount: number | null
          group_id: string | null
          iso: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transaction_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "group"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "v_group_membership"
            referencedColumns: ["id"]
          },
        ]
      }
      v_trip_details: {
        Row: {
          currency_iso_code: string | null
          description: string | null
          end_date: string | null
          group_id: string | null
          id: string | null
          location: string | null
          name: string | null
          participants: Json | null
          start_date: string | null
          status: Database["public"]["Enums"]["trip_status"] | null
          text_document_id: string | null
          type: Database["public"]["Enums"]["trip_types"] | null
        }
        Relationships: [
          {
            foreignKeyName: "trip_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "group"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "v_group_membership"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_text_document_id_fkey"
            columns: ["text_document_id"]
            isOneToOne: false
            referencedRelation: "TextDocument"
            referencedColumns: ["id"]
          },
        ]
      }
      v_trip_financial_summary: {
        Row: {
          financials: Json | null
          participants: Json | null
          trip_currency: string | null
          trip_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      acc_get_transaction_currency: {
        Args: { p_transaction_id: string }
        Returns: string
      }
      acc_recalc_group_balance_pair: {
        Args: { p_borrower_id: string; p_group_id: string; p_lender_id: string }
        Returns: undefined
      }
      acc_send_invitation: {
        Args: {
          p_group_id: string
          p_group_member_id: string
          p_user_id: string
        }
        Returns: undefined
      }
      acc_update_group_balance: {
        Args: {
          p_amount: number
          p_borrower_id: string
          p_group_id: string
          p_iso_code: string
          p_lender_id: string
        }
        Returns: undefined
      }
      acc_upsert_transaction_with_splits: {
        Args: {
          p_transaction: Database["public"]["Tables"]["transaction"]["Row"]
          p_transaction_splits: Database["public"]["Tables"]["transaction_split"]["Row"][]
        }
        Returns: string
      }
      db_set_audit_mechanism: {
        Args: { p_schema: string; p_table: string }
        Returns: undefined
      }
      is_acc_group_member: { Args: { p_group_id: string }; Returns: boolean }
      is_acc_group_owner: { Args: { p_group_id: string }; Returns: boolean }
      is_trip_admin: { Args: { p_trip_id: string }; Returns: boolean }
      is_trip_creator: { Args: { p_trip_id: string }; Returns: boolean }
      is_trip_participant: { Args: { p_trip_id: string }; Returns: boolean }
      send_notification: {
        Args: { p_details: Json; p_title: string; p_user_id: string }
        Returns: undefined
      }
      trip_insert_owner_participant: {
        Args: { p_group_id: string; p_trip_id: string }
        Returns: string
      }
    }
    Enums: {
      acc_group_user_status: "invited" | "accepted" | "rejected" | "owner"
      acc_transaction_split_type: "equal" | "shares" | "manual" | "percentage"
      DrinkType: "beer"
      text_document_type: "bio" | "blog" | "trip_post" | "trip_description"
      TextDocumentAccess: "open" | "restricted"
      TextDocumentStatus: "draft" | "published" | "unpublished"
      TrackerGameStatus: "paused" | "active" | "finished"
      transaction_status: "idea" | "quoted" | "committed" | "paid"
      trip_feed_item_type: "post" | "announcement"
      trip_participant_role: "admin" | "member" | "owner"
      trip_participant_status:
        | "invited"
        | "declined"
        | "confirmed"
        | "tentative"
      trip_status: "proposed" | "confirmed" | "cancelled" | "past"
      trip_transaction_calculation_type:
        | "group_total"
        | "per_day"
        | "per_participant"
        | "per_participant_per_day"
      trip_transaction_category:
        | "food"
        | "transport"
        | "fuel"
        | "stay"
        | "activity"
        | "other"
      trip_types:
        | "citybreak"
        | "sailing"
        | "skiing"
        | "caravaning"
        | "hiking"
        | "cayaking"
        | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      acc_group_user_status: ["invited", "accepted", "rejected", "owner"],
      acc_transaction_split_type: ["equal", "shares", "manual", "percentage"],
      DrinkType: ["beer"],
      text_document_type: ["bio", "blog", "trip_post", "trip_description"],
      TextDocumentAccess: ["open", "restricted"],
      TextDocumentStatus: ["draft", "published", "unpublished"],
      TrackerGameStatus: ["paused", "active", "finished"],
      transaction_status: ["idea", "quoted", "committed", "paid"],
      trip_feed_item_type: ["post", "announcement"],
      trip_participant_role: ["admin", "member", "owner"],
      trip_participant_status: [
        "invited",
        "declined",
        "confirmed",
        "tentative",
      ],
      trip_status: ["proposed", "confirmed", "cancelled", "past"],
      trip_transaction_calculation_type: [
        "group_total",
        "per_day",
        "per_participant",
        "per_participant_per_day",
      ],
      trip_transaction_category: [
        "food",
        "transport",
        "fuel",
        "stay",
        "activity",
        "other",
      ],
      trip_types: [
        "citybreak",
        "sailing",
        "skiing",
        "caravaning",
        "hiking",
        "cayaking",
        "other",
      ],
    },
  },
} as const
