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
  permissions: {
    Tables: {
      membership_role_access: {
        Row: {
          can_delete: boolean
          can_insert: boolean
          can_select: boolean
          can_update: boolean
          id: number
          role: Database["permissions"]["Enums"]["membership_role"]
          security_id: string
        }
        Insert: {
          can_delete?: boolean
          can_insert?: boolean
          can_select?: boolean
          can_update?: boolean
          id?: never
          role: Database["permissions"]["Enums"]["membership_role"]
          security_id: string
        }
        Update: {
          can_delete?: boolean
          can_insert?: boolean
          can_select?: boolean
          can_update?: boolean
          id?: never
          role?: Database["permissions"]["Enums"]["membership_role"]
          security_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "membership_role_access_security_id_fkey"
            columns: ["security_id"]
            isOneToOne: false
            referencedRelation: "row_level_security"
            referencedColumns: ["id"]
          },
        ]
      }
      row_level_security: {
        Row: {
          authenticated_delete: Database["permissions"]["Enums"]["row_level_access"]
          authenticated_insert: Database["permissions"]["Enums"]["row_level_access"]
          authenticated_select: Database["permissions"]["Enums"]["row_level_access"]
          authenticated_update: Database["permissions"]["Enums"]["row_level_access"]
          id: string
          inherited_fk: string | null
          inherited_from: string | null
          inherited_pk: string | null
          membership_fk: string | null
          membership_pk: string | null
          membership_role_column: string | null
          membership_table: string | null
          membership_user_fk: string | null
          owner_column: string | null
          public_delete: Database["permissions"]["Enums"]["row_level_access"]
          public_insert: Database["permissions"]["Enums"]["row_level_access"]
          public_select: Database["permissions"]["Enums"]["row_level_access"]
          public_update: Database["permissions"]["Enums"]["row_level_access"]
          schema_name: string
          table_name: string
        }
        Insert: {
          authenticated_delete?: Database["permissions"]["Enums"]["row_level_access"]
          authenticated_insert?: Database["permissions"]["Enums"]["row_level_access"]
          authenticated_select?: Database["permissions"]["Enums"]["row_level_access"]
          authenticated_update?: Database["permissions"]["Enums"]["row_level_access"]
          id?: string
          inherited_fk?: string | null
          inherited_from?: string | null
          inherited_pk?: string | null
          membership_fk?: string | null
          membership_pk?: string | null
          membership_role_column?: string | null
          membership_table?: string | null
          membership_user_fk?: string | null
          owner_column?: string | null
          public_delete?: Database["permissions"]["Enums"]["row_level_access"]
          public_insert?: Database["permissions"]["Enums"]["row_level_access"]
          public_select?: Database["permissions"]["Enums"]["row_level_access"]
          public_update?: Database["permissions"]["Enums"]["row_level_access"]
          schema_name?: string
          table_name: string
        }
        Update: {
          authenticated_delete?: Database["permissions"]["Enums"]["row_level_access"]
          authenticated_insert?: Database["permissions"]["Enums"]["row_level_access"]
          authenticated_select?: Database["permissions"]["Enums"]["row_level_access"]
          authenticated_update?: Database["permissions"]["Enums"]["row_level_access"]
          id?: string
          inherited_fk?: string | null
          inherited_from?: string | null
          inherited_pk?: string | null
          membership_fk?: string | null
          membership_pk?: string | null
          membership_role_column?: string | null
          membership_table?: string | null
          membership_user_fk?: string | null
          owner_column?: string | null
          public_delete?: Database["permissions"]["Enums"]["row_level_access"]
          public_insert?: Database["permissions"]["Enums"]["row_level_access"]
          public_select?: Database["permissions"]["Enums"]["row_level_access"]
          public_update?: Database["permissions"]["Enums"]["row_level_access"]
          schema_name?: string
          table_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "row_level_security_inherited_from_fkey"
            columns: ["inherited_from"]
            isOneToOne: false
            referencedRelation: "row_level_security"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      _check_record_access: {
        Args: {
          p_operation: string
          p_record: Json
          p_schema_name: string
          p_table_name: string
        }
        Returns: boolean
      }
      can_delete_record: {
        Args: { p_record: Json; p_schema_name: string; p_table_name: string }
        Returns: boolean
      }
      can_insert_record: {
        Args: { p_record: Json; p_schema_name: string; p_table_name: string }
        Returns: boolean
      }
      can_read_record: {
        Args: { p_record: Json; p_schema_name: string; p_table_name: string }
        Returns: boolean
      }
      can_update_record: {
        Args: { p_record: Json; p_schema_name: string; p_table_name: string }
        Returns: boolean
      }
      verify_crud_permission: {
        Args: {
          p_crud_access: Database["permissions"]["Enums"]["crud_access"]
          p_role: Database["permissions"]["Enums"]["user_role"]
          p_table: string
        }
        Returns: boolean
      }
    }
    Enums: {
      crud_access: "create" | "read" | "update" | "delete"
      membership_role: "viewer" | "editor" | "admin"
      row_level_access:
        | "none"
        | "public"
        | "authenticated"
        | "private"
        | "membership"
        | "inherited"
      user_role: "admin" | "editor" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      accommodation: {
        Row: {
          check_in_date: string
          check_out_date: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          last_modified_at: string | null
          last_modified_by: string | null
          name: string
          status: Database["public"]["Enums"]["transaction_status"]
          stay_duration_days: number | null
          trip_id: string
          trip_transaction_id: string | null
        }
        Insert: {
          check_in_date: string
          check_out_date: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          last_modified_at?: string | null
          last_modified_by?: string | null
          name: string
          status?: Database["public"]["Enums"]["transaction_status"]
          stay_duration_days?: number | null
          trip_id: string
          trip_transaction_id?: string | null
        }
        Update: {
          check_in_date?: string
          check_out_date?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          last_modified_at?: string | null
          last_modified_by?: string | null
          name?: string
          status?: Database["public"]["Enums"]["transaction_status"]
          stay_duration_days?: number | null
          trip_id?: string
          trip_transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accommodation_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trip"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accommodation_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "v_trip_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accommodation_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "v_trip_financial_summary"
            referencedColumns: ["trip_id"]
          },
          {
            foreignKeyName: "accommodation_trip_transaction_id_fkey"
            columns: ["trip_transaction_id"]
            isOneToOne: true
            referencedRelation: "trip_transaction"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accommodation_trip_transaction_id_fkey"
            columns: ["trip_transaction_id"]
            isOneToOne: true
            referencedRelation: "v_trip_accommodation_summary"
            referencedColumns: ["trip_transaction_id"]
          },
          {
            foreignKeyName: "accommodation_trip_transaction_id_fkey"
            columns: ["trip_transaction_id"]
            isOneToOne: true
            referencedRelation: "v_trip_travel_summary"
            referencedColumns: ["trip_transaction_id"]
          },
        ]
      }
      accommodation_unit: {
        Row: {
          accommodation_id: string
          assigned_participants: number
          capacity: number | null
          created_at: string
          created_by: string | null
          id: string
          last_modified_at: string | null
          last_modified_by: string | null
          name: string
        }
        Insert: {
          accommodation_id: string
          assigned_participants?: number
          capacity?: number | null
          created_at?: string
          created_by?: string | null
          id?: string
          last_modified_at?: string | null
          last_modified_by?: string | null
          name: string
        }
        Update: {
          accommodation_id?: string
          assigned_participants?: number
          capacity?: number | null
          created_at?: string
          created_by?: string | null
          id?: string
          last_modified_at?: string | null
          last_modified_by?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "accommodation_unit_accommodation_id_fkey"
            columns: ["accommodation_id"]
            isOneToOne: false
            referencedRelation: "accommodation"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accommodation_unit_accommodation_id_fkey"
            columns: ["accommodation_id"]
            isOneToOne: false
            referencedRelation: "v_trip_accommodation_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      accommodation_unit_assignment: {
        Row: {
          accommodation_unit_id: string
          created_at: string
          created_by: string | null
          last_modified_at: string | null
          last_modified_by: string | null
          trip_participant_id: string
        }
        Insert: {
          accommodation_unit_id: string
          created_at?: string
          created_by?: string | null
          last_modified_at?: string | null
          last_modified_by?: string | null
          trip_participant_id: string
        }
        Update: {
          accommodation_unit_id?: string
          created_at?: string
          created_by?: string | null
          last_modified_at?: string | null
          last_modified_by?: string | null
          trip_participant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "accommodation_unit_assignment_accommodation_unit_id_fkey"
            columns: ["accommodation_unit_id"]
            isOneToOne: false
            referencedRelation: "accommodation_unit"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accommodation_unit_assignment_trip_participant_id_fkey"
            columns: ["trip_participant_id"]
            isOneToOne: false
            referencedRelation: "trip_participant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accommodation_unit_assignment_trip_participant_id_fkey"
            columns: ["trip_participant_id"]
            isOneToOne: false
            referencedRelation: "v_trip_participant_details"
            referencedColumns: ["id"]
          },
        ]
      }
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
            foreignKeyName: "balance_borrower_id_fkey"
            columns: ["borrower_id"]
            isOneToOne: false
            referencedRelation: "v_trip_participant_details"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "balance_lender_id_fkey"
            columns: ["lender_id"]
            isOneToOne: false
            referencedRelation: "UserInfo"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "balance_lender_id_fkey"
            columns: ["lender_id"]
            isOneToOne: false
            referencedRelation: "v_trip_participant_details"
            referencedColumns: ["user_id"]
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
          {
            foreignKeyName: "consumed_drink_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_trip_participant_details"
            referencedColumns: ["user_id"]
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
          {
            foreignKeyName: "group_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "v_trip_participant_details"
            referencedColumns: ["user_id"]
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
            foreignKeyName: "group_balance_borrower_id_fkey"
            columns: ["borrower_id"]
            isOneToOne: false
            referencedRelation: "v_group_member_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_balance_borrower_id_fkey"
            columns: ["borrower_id"]
            isOneToOne: false
            referencedRelation: "v_trip_participant_details"
            referencedColumns: ["group_member_id"]
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
          {
            foreignKeyName: "group_balance_lender_id_fkey"
            columns: ["lender_id"]
            isOneToOne: false
            referencedRelation: "v_group_member_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_balance_lender_id_fkey"
            columns: ["lender_id"]
            isOneToOne: false
            referencedRelation: "v_trip_participant_details"
            referencedColumns: ["group_member_id"]
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
            foreignKeyName: "group_invitation_group_member_id_fkey"
            columns: ["group_member_id"]
            isOneToOne: false
            referencedRelation: "v_group_member_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_invitation_group_member_id_fkey"
            columns: ["group_member_id"]
            isOneToOne: false
            referencedRelation: "v_trip_participant_details"
            referencedColumns: ["group_member_id"]
          },
          {
            foreignKeyName: "group_invitation_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "UserInfo"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "group_invitation_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_trip_participant_details"
            referencedColumns: ["user_id"]
          },
        ]
      }
      group_member: {
        Row: {
          added_at: string | null
          assigned_at: string | null
          group_id: string
          id: string
          nickname: string
          removed_at: string | null
          role: Database["permissions"]["Enums"]["membership_role"]
          status: Database["public"]["Enums"]["acc_group_user_status"] | null
          user_id: string | null
        }
        Insert: {
          added_at?: string | null
          assigned_at?: string | null
          group_id: string
          id?: string
          nickname: string
          removed_at?: string | null
          role?: Database["permissions"]["Enums"]["membership_role"]
          status?: Database["public"]["Enums"]["acc_group_user_status"] | null
          user_id?: string | null
        }
        Update: {
          added_at?: string | null
          assigned_at?: string | null
          group_id?: string
          id?: string
          nickname?: string
          removed_at?: string | null
          role?: Database["permissions"]["Enums"]["membership_role"]
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
          {
            foreignKeyName: "group_member_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_trip_participant_details"
            referencedColumns: ["user_id"]
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
          {
            foreignKeyName: "TextDocument_author_fkey1"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "v_trip_participant_details"
            referencedColumns: ["user_id"]
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
            foreignKeyName: "TextDocumentComment_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "v_trip_participant_details"
            referencedColumns: ["user_id"]
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
          {
            foreignKeyName: "transaction_paid_by_fkey"
            columns: ["paid_by_id"]
            isOneToOne: false
            referencedRelation: "v_group_member_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_paid_by_fkey"
            columns: ["paid_by_id"]
            isOneToOne: false
            referencedRelation: "v_trip_participant_details"
            referencedColumns: ["group_member_id"]
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
            foreignKeyName: "transaction_split_borrower_id_fkey"
            columns: ["borrower_id"]
            isOneToOne: false
            referencedRelation: "v_group_member_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_split_borrower_id_fkey"
            columns: ["borrower_id"]
            isOneToOne: false
            referencedRelation: "v_trip_participant_details"
            referencedColumns: ["group_member_id"]
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
          slug: string
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
          slug: string
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
          slug?: string
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
          is_confirmed: boolean | null
          is_declined: boolean | null
          is_tentative: boolean | null
          last_modified_at: string | null
          last_modified_by: string | null
          role: Database["permissions"]["Enums"]["user_role"]
          status: Database["public"]["Enums"]["trip_participant_status"]
          trip_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          group_member_id: string
          id?: string
          is_confirmed?: boolean | null
          is_declined?: boolean | null
          is_tentative?: boolean | null
          last_modified_at?: string | null
          last_modified_by?: string | null
          role?: Database["permissions"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["trip_participant_status"]
          trip_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          group_member_id?: string
          id?: string
          is_confirmed?: boolean | null
          is_declined?: boolean | null
          is_tentative?: boolean | null
          last_modified_at?: string | null
          last_modified_by?: string | null
          role?: Database["permissions"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["trip_participant_status"]
          trip_id?: string
          user_id?: string | null
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
            foreignKeyName: "trip_participant_group_member_id_fkey"
            columns: ["group_member_id"]
            isOneToOne: false
            referencedRelation: "v_group_member_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_participant_group_member_id_fkey"
            columns: ["group_member_id"]
            isOneToOne: false
            referencedRelation: "v_trip_participant_details"
            referencedColumns: ["group_member_id"]
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
          {
            foreignKeyName: "trip_participant_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "UserInfo"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "trip_participant_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_trip_participant_details"
            referencedColumns: ["user_id"]
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
          related_record_id: string | null
          related_record_type: string | null
          split_type: Database["public"]["Enums"]["acc_transaction_split_type"]
          status: Database["public"]["Enums"]["transaction_status"]
          total_amount: number | null
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
          related_record_id?: string | null
          related_record_type?: string | null
          split_type?: Database["public"]["Enums"]["acc_transaction_split_type"]
          status?: Database["public"]["Enums"]["transaction_status"]
          total_amount?: number | null
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
          related_record_id?: string | null
          related_record_type?: string | null
          split_type?: Database["public"]["Enums"]["acc_transaction_split_type"]
          status?: Database["public"]["Enums"]["transaction_status"]
          total_amount?: number | null
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
      trip_travel: {
        Row: {
          capacity: number | null
          created_at: string
          created_by: string | null
          description: string | null
          destination: string | null
          duration: number | null
          estimated_arrival: string | null
          estimated_departure: string | null
          id: string
          last_modified_at: string | null
          last_modified_by: string | null
          mode_of_transport: Database["public"]["Enums"]["transportation_type"]
          name: string | null
          origin: string
          status: Database["public"]["Enums"]["transaction_status"]
          trip_id: string
          trip_transaction_id: string | null
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          destination?: string | null
          duration?: number | null
          estimated_arrival?: string | null
          estimated_departure?: string | null
          id?: string
          last_modified_at?: string | null
          last_modified_by?: string | null
          mode_of_transport?: Database["public"]["Enums"]["transportation_type"]
          name?: string | null
          origin: string
          status?: Database["public"]["Enums"]["transaction_status"]
          trip_id: string
          trip_transaction_id?: string | null
        }
        Update: {
          capacity?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          destination?: string | null
          duration?: number | null
          estimated_arrival?: string | null
          estimated_departure?: string | null
          id?: string
          last_modified_at?: string | null
          last_modified_by?: string | null
          mode_of_transport?: Database["public"]["Enums"]["transportation_type"]
          name?: string | null
          origin?: string
          status?: Database["public"]["Enums"]["transaction_status"]
          trip_id?: string
          trip_transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trip_travel_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trip"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_travel_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "v_trip_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_travel_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "v_trip_financial_summary"
            referencedColumns: ["trip_id"]
          },
          {
            foreignKeyName: "trip_travel_trip_transaction_id_fkey"
            columns: ["trip_transaction_id"]
            isOneToOne: true
            referencedRelation: "trip_transaction"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_travel_trip_transaction_id_fkey"
            columns: ["trip_transaction_id"]
            isOneToOne: true
            referencedRelation: "v_trip_accommodation_summary"
            referencedColumns: ["trip_transaction_id"]
          },
          {
            foreignKeyName: "trip_travel_trip_transaction_id_fkey"
            columns: ["trip_transaction_id"]
            isOneToOne: true
            referencedRelation: "v_trip_travel_summary"
            referencedColumns: ["trip_transaction_id"]
          },
        ]
      }
      trip_travel_assignment: {
        Row: {
          created_at: string
          created_by: string | null
          last_modified_at: string | null
          last_modified_by: string | null
          trip_participant_id: string
          trip_travel_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          last_modified_at?: string | null
          last_modified_by?: string | null
          trip_participant_id?: string
          trip_travel_id?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          last_modified_at?: string | null
          last_modified_by?: string | null
          trip_participant_id?: string
          trip_travel_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_travel_assignment_trip_participant_id_fkey"
            columns: ["trip_participant_id"]
            isOneToOne: false
            referencedRelation: "trip_participant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_travel_assignment_trip_participant_id_fkey"
            columns: ["trip_participant_id"]
            isOneToOne: false
            referencedRelation: "v_trip_participant_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_travel_assignment_trip_travel_id_fkey"
            columns: ["trip_travel_id"]
            isOneToOne: false
            referencedRelation: "trip_travel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_travel_assignment_trip_travel_id_fkey"
            columns: ["trip_travel_id"]
            isOneToOne: false
            referencedRelation: "v_trip_travel_summary"
            referencedColumns: ["id"]
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
          {
            foreignKeyName: "user_notification_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_trip_participant_details"
            referencedColumns: ["user_id"]
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
            foreignKeyName: "UserScore_gameId_fkey"
            columns: ["gameId"]
            isOneToOne: false
            referencedRelation: "GameScore"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "UserScore_userId_fkey1"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "UserInfo"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "UserScore_userId_fkey1"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "v_trip_participant_details"
            referencedColumns: ["user_id"]
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
            foreignKeyName: "transaction_paid_by_fkey"
            columns: ["lender_id"]
            isOneToOne: false
            referencedRelation: "v_group_member_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_paid_by_fkey"
            columns: ["lender_id"]
            isOneToOne: false
            referencedRelation: "v_trip_participant_details"
            referencedColumns: ["group_member_id"]
          },
          {
            foreignKeyName: "transaction_split_borrower_id_fkey"
            columns: ["borrower_id"]
            isOneToOne: false
            referencedRelation: "group_member"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_split_borrower_id_fkey"
            columns: ["borrower_id"]
            isOneToOne: false
            referencedRelation: "v_group_member_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_split_borrower_id_fkey"
            columns: ["borrower_id"]
            isOneToOne: false
            referencedRelation: "v_trip_participant_details"
            referencedColumns: ["group_member_id"]
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
            foreignKeyName: "group_invitation_group_member_id_fkey"
            columns: ["group_member_id"]
            isOneToOne: false
            referencedRelation: "v_group_member_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_invitation_group_member_id_fkey"
            columns: ["group_member_id"]
            isOneToOne: false
            referencedRelation: "v_trip_participant_details"
            referencedColumns: ["group_member_id"]
          },
          {
            foreignKeyName: "group_invitation_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "UserInfo"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "group_invitation_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_trip_participant_details"
            referencedColumns: ["user_id"]
          },
        ]
      }
      v_group_member_details: {
        Row: {
          added_at: string | null
          assigned_at: string | null
          group_id: string | null
          id: string | null
          nickname: string | null
          removed_at: string | null
          status: Database["public"]["Enums"]["acc_group_user_status"] | null
          user: Json | null
          user_id: string | null
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
          {
            foreignKeyName: "group_member_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_trip_participant_details"
            referencedColumns: ["user_id"]
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
            foreignKeyName: "group_member_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_trip_participant_details"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "group_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "UserInfo"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "group_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "v_trip_participant_details"
            referencedColumns: ["user_id"]
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
      v_trip_accommodation_summary: {
        Row: {
          accommodation_units: Json[] | null
          check_in_date: string | null
          check_out_date: string | null
          currency_iso_code: string | null
          description: string | null
          id: string | null
          name: string | null
          status: Database["public"]["Enums"]["transaction_status"] | null
          stay_duration_days: number | null
          total_amount: number | null
          trip_id: string | null
          trip_transaction_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accommodation_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trip"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accommodation_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "v_trip_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accommodation_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "v_trip_financial_summary"
            referencedColumns: ["trip_id"]
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
          slug: string | null
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
          financials_by_category: Json | null
          participants: Json | null
          trip_currency: string | null
          trip_id: string | null
        }
        Relationships: []
      }
      v_trip_participant_details: {
        Row: {
          avatar_url: string | null
          first_name: string | null
          group_member_id: string | null
          group_member_status:
            | Database["public"]["Enums"]["acc_group_user_status"]
            | null
          id: string | null
          is_confirmed: boolean | null
          is_declined: boolean | null
          is_tentative: boolean | null
          last_name: string | null
          nickname: string | null
          role: Database["permissions"]["Enums"]["user_role"] | null
          status: Database["public"]["Enums"]["trip_participant_status"] | null
          trip_id: string | null
          user_id: string | null
        }
        Relationships: [
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
      v_trip_timeline: {
        Row: {
          description: string | null
          details: Json[] | null
          end_date: string | null
          id: string | null
          name: string | null
          record_type:
            | Database["public"]["Enums"]["trip_timeline_item_type"]
            | null
          start_date: string | null
          status: Database["public"]["Enums"]["transaction_status"] | null
          trip_id: string | null
          trip_transaction_id: string | null
          type: string | null
        }
        Relationships: []
      }
      v_trip_travel_summary: {
        Row: {
          capacity: number | null
          currency_iso_code: string | null
          description: string | null
          destination: string | null
          duration: number | null
          estimated_arrival: string | null
          estimated_departure: string | null
          id: string | null
          mode_of_transport:
            | Database["public"]["Enums"]["transportation_type"]
            | null
          name: string | null
          origin: string | null
          status: Database["public"]["Enums"]["transaction_status"] | null
          total_amount: number | null
          trip_id: string | null
          trip_transaction_id: string | null
          trip_travel_assignments: Json[] | null
        }
        Relationships: [
          {
            foreignKeyName: "trip_travel_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trip"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_travel_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "v_trip_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_travel_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "v_trip_financial_summary"
            referencedColumns: ["trip_id"]
          },
        ]
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
      accommodation_unit_assignment_set: {
        Args: { p_accommodation_unit_id: string; p_trip_participant_id: string }
        Returns: undefined
      }
      associate_trip_transaction: {
        Args: {
          p_related_record_id: string
          p_related_record_type: string
          p_transaction_status: Database["public"]["Enums"]["transaction_status"]
          p_trip_transaction_id: string
        }
        Returns: undefined
      }
      count_accommodation_assignments: {
        Args: { p_accommodation_id: string }
        Returns: number
      }
      db_set_audit_mechanism: {
        Args: { p_schema: string; p_table: string }
        Returns: undefined
      }
      send_notification: {
        Args: { p_details: Json; p_title: string; p_user_id: string }
        Returns: undefined
      }
      slugify: { Args: { value: string }; Returns: string }
      trip_insert_owner_participant: {
        Args: { p_group_id: string; p_trip_id: string }
        Returns: string
      }
      trip_transaction_calculate_total: {
        Args: {
          p_calculation_type: Database["public"]["Enums"]["trip_transaction_calculation_type"]
          p_trip_id: string
          p_unit_amount: number
        }
        Returns: number
      }
      trip_travel_make_transaction_split: {
        Args: { p_trip_travel_id: string }
        Returns: Json
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
      transportation_type:
        | "tram"
        | "subway"
        | "rail"
        | "bus"
        | "ferry"
        | "lift"
        | "car"
        | "airplane"
      trip_feed_item_type: "post" | "announcement"
      trip_participant_role: "admin" | "member" | "owner"
      trip_participant_status:
        | "invited"
        | "declined"
        | "confirmed"
        | "tentative"
      trip_status: "proposed" | "confirmed" | "cancelled" | "past"
      trip_timeline_item_type: "accommodation" | "travel"
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
  permissions: {
    Enums: {
      crud_access: ["create", "read", "update", "delete"],
      membership_role: ["viewer", "editor", "admin"],
      row_level_access: [
        "none",
        "public",
        "authenticated",
        "private",
        "membership",
        "inherited",
      ],
      user_role: ["admin", "editor", "viewer"],
    },
  },
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
      transportation_type: [
        "tram",
        "subway",
        "rail",
        "bus",
        "ferry",
        "lift",
        "car",
        "airplane",
      ],
      trip_feed_item_type: ["post", "announcement"],
      trip_participant_role: ["admin", "member", "owner"],
      trip_participant_status: [
        "invited",
        "declined",
        "confirmed",
        "tentative",
      ],
      trip_status: ["proposed", "confirmed", "cancelled", "past"],
      trip_timeline_item_type: ["accommodation", "travel"],
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
