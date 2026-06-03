export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          created_at?: string;
        };
        Update: {
          email?: string | null;
          full_name?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      tenants: {
        Row: {
          id: string;
          business_name: string;
          business_type: string;
          city: string | null;
          country: string | null;
          timezone: string | null;
          status: string | null;
          plan: string | null;
          owner_user_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_name: string;
          business_type: string;
          city?: string | null;
          country?: string | null;
          timezone?: string | null;
          status?: string | null;
          plan?: string | null;
          owner_user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["tenants"]["Insert"]>;
        Relationships: [];
      };
      tenant_memberships: {
        Row: {
          tenant_id: string;
          user_id: string;
          role: "owner" | "admin" | "staff" | null;
          created_at: string;
        };
        Insert: {
          tenant_id: string;
          user_id: string;
          role: "owner" | "admin" | "staff";
          created_at?: string;
        };
        Update: {
          role?: "owner" | "admin" | "staff";
          created_at?: string;
        };
        Relationships: [];
      };
      tenant_settings: {
        Row: {
          tenant_id: string;
          languages: string[] | null;
          whatsapp_number: string | null;
          vapi_phone_number_id: string | null;
          human_fallback_number: string | null;
          booking_url: string | null;
          tone: string | null;
          greeting: string | null;
          hours: Json | null;
          services: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          tenant_id: string;
          languages?: string[] | null;
          whatsapp_number?: string | null;
          vapi_phone_number_id?: string | null;
          human_fallback_number?: string | null;
          booking_url?: string | null;
          tone?: string | null;
          greeting?: string | null;
          hours?: Json | null;
          services?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["tenant_settings"]["Insert"]>;
        Relationships: [];
      };
      channel_bindings: {
        Row: {
          id: string;
          tenant_id: string | null;
          channel: "voice" | "whatsapp" | null;
          provider: string | null;
          external_id: string | null;
          status: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id?: string | null;
          channel?: "voice" | "whatsapp" | null;
          provider?: string | null;
          external_id?: string | null;
          status?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["channel_bindings"]["Insert"]>;
        Relationships: [];
      };
      catalog_categories: {
        Row: {
          id: string;
          tenant_id: string;
          name: string;
          description: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          name: string;
          description?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["catalog_categories"]["Insert"]>;
        Relationships: [];
      };
      catalog_items: {
        Row: {
          id: string;
          tenant_id: string;
          category_id: string | null;
          item_type: "product" | "service";
          name: string;
          description: string | null;
          price_amount: number | null;
          currency: string;
          image_url: string | null;
          sku: string | null;
          duration_minutes: number | null;
          inventory_quantity: number | null;
          is_active: boolean;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          category_id?: string | null;
          item_type?: "product" | "service";
          name: string;
          description?: string | null;
          price_amount?: number | null;
          currency?: string;
          image_url?: string | null;
          sku?: string | null;
          duration_minutes?: number | null;
          inventory_quantity?: number | null;
          is_active?: boolean;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["catalog_items"]["Insert"]>;
        Relationships: [];
      };
      conversations: {
        Row: {
          id: string;
          tenant_id: string;
          channel_binding_id: string | null;
          channel: "voice" | "whatsapp";
          external_conversation_id: string | null;
          customer_display_name: string | null;
          customer_phone: string | null;
          customer_email: string | null;
          status: "open" | "pending" | "resolved" | "archived";
          intent: "unknown" | "booking" | "sales" | "support" | "handoff";
          assigned_user_id: string | null;
          summary: string | null;
          last_message_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          channel_binding_id?: string | null;
          channel: "voice" | "whatsapp";
          external_conversation_id?: string | null;
          customer_display_name?: string | null;
          customer_phone?: string | null;
          customer_email?: string | null;
          status?: "open" | "pending" | "resolved" | "archived";
          intent?: "unknown" | "booking" | "sales" | "support" | "handoff";
          assigned_user_id?: string | null;
          summary?: string | null;
          last_message_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["conversations"]["Insert"]>;
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          tenant_id: string;
          conversation_id: string;
          sender_type: "customer" | "assistant" | "human" | "system";
          direction: "inbound" | "outbound" | "internal";
          body: string;
          metadata: Json;
          occurred_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          conversation_id: string;
          sender_type: "customer" | "assistant" | "human" | "system";
          direction: "inbound" | "outbound" | "internal";
          body: string;
          metadata?: Json;
          occurred_at?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["messages"]["Insert"]>;
        Relationships: [];
      };
      whatsapp_beta_sessions: {
        Row: {
          id: string;
          tenant_id: string;
          channel_binding_id: string;
          provider: string;
          connection_method: "hosted_auth" | "qr_pairing";
          status:
            | "pending_credentials"
            | "ready_to_connect"
            | "auth_link_ready"
            | "connected"
            | "disconnected"
            | "failed"
            | "paused";
          hosted_auth_url: string | null;
          external_account_id: string | null;
          phone_number: string | null;
          expires_at: string | null;
          last_checked_at: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          channel_binding_id: string;
          provider?: string;
          connection_method?: "hosted_auth" | "qr_pairing";
          status?:
            | "pending_credentials"
            | "ready_to_connect"
            | "auth_link_ready"
            | "connected"
            | "disconnected"
            | "failed"
            | "paused";
          hosted_auth_url?: string | null;
          external_account_id?: string | null;
          phone_number?: string | null;
          expires_at?: string | null;
          last_checked_at?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["whatsapp_beta_sessions"]["Insert"]>;
        Relationships: [];
      };
      voice_beta_sessions: {
        Row: {
          id: string;
          tenant_id: string;
          channel_binding_id: string;
          provider: string;
          status:
            | "pending_credentials"
            | "ready_to_connect"
            | "connected"
            | "failed"
            | "paused";
          assistant_external_id: string | null;
          phone_number_id: string | null;
          phone_number: string | null;
          webhook_url: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          channel_binding_id: string;
          provider?: string;
          status?:
            | "pending_credentials"
            | "ready_to_connect"
            | "connected"
            | "failed"
            | "paused";
          assistant_external_id?: string | null;
          phone_number_id?: string | null;
          phone_number?: string | null;
          webhook_url?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["voice_beta_sessions"]["Insert"]>;
        Relationships: [];
      };
      ai_tool_configs: {
        Row: {
          id: string;
          tenant_id: string;
          tool_key: string;
          name: string;
          status: "draft" | "ready" | "active" | "paused";
          description: string | null;
          config: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          tool_key: string;
          name: string;
          status?: "draft" | "ready" | "active" | "paused";
          description?: string | null;
          config?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["ai_tool_configs"]["Insert"]>;
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          tenant_id: string;
          conversation_id: string | null;
          customer_display_name: string | null;
          customer_phone: string | null;
          customer_email: string | null;
          status:
            | "draft"
            | "pending_payment"
            | "paid"
            | "fulfilled"
            | "cancelled"
            | "refunded";
          currency: string;
          subtotal_amount: number;
          total_amount: number;
          payment_provider: string | null;
          payment_link_url: string | null;
          external_payment_id: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          conversation_id?: string | null;
          customer_display_name?: string | null;
          customer_phone?: string | null;
          customer_email?: string | null;
          status?:
            | "draft"
            | "pending_payment"
            | "paid"
            | "fulfilled"
            | "cancelled"
            | "refunded";
          currency?: string;
          subtotal_amount?: number;
          total_amount?: number;
          payment_provider?: string | null;
          payment_link_url?: string | null;
          external_payment_id?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          tenant_id: string;
          order_id: string;
          catalog_item_id: string | null;
          name: string;
          quantity: number;
          unit_amount: number;
          total_amount: number;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          order_id: string;
          catalog_item_id?: string | null;
          name: string;
          quantity?: number;
          unit_amount?: number;
          total_amount?: number;
          metadata?: Json;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>;
        Relationships: [];
      };
      automation_workflows: {
        Row: {
          id: string;
          tenant_id: string;
          workflow_key: string;
          name: string;
          provider: string;
          status: "draft" | "ready" | "active" | "paused" | "failed";
          trigger_type: string | null;
          external_workflow_id: string | null;
          webhook_url: string | null;
          config: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          workflow_key: string;
          name: string;
          provider?: string;
          status?: "draft" | "ready" | "active" | "paused" | "failed";
          trigger_type?: string | null;
          external_workflow_id?: string | null;
          webhook_url?: string | null;
          config?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["automation_workflows"]["Insert"]>;
        Relationships: [];
      };
      billing_accounts: {
        Row: {
          tenant_id: string;
          provider: string;
          status:
            | "draft"
            | "pending_credentials"
            | "ready"
            | "active"
            | "paused"
            | "cancelled";
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          plan: string;
          billing_email: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          tenant_id: string;
          provider?: string;
          status?:
            | "draft"
            | "pending_credentials"
            | "ready"
            | "active"
            | "paused"
            | "cancelled";
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          plan?: string;
          billing_email?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["billing_accounts"]["Insert"]>;
        Relationships: [];
      };
      booking_sync_configs: {
        Row: {
          id: string;
          tenant_id: string;
          provider: string;
          status: "pending_credentials" | "ready" | "connected" | "paused" | "failed";
          external_user_id: string | null;
          external_event_type_id: string | null;
          booking_url: string | null;
          webhook_url: string | null;
          default_duration_minutes: number | null;
          timezone: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          provider?: string;
          status?: "pending_credentials" | "ready" | "connected" | "paused" | "failed";
          external_user_id?: string | null;
          external_event_type_id?: string | null;
          booking_url?: string | null;
          webhook_url?: string | null;
          default_duration_minutes?: number | null;
          timezone?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["booking_sync_configs"]["Insert"]>;
        Relationships: [];
      };
      booking_records: {
        Row: {
          id: string;
          tenant_id: string;
          booking_sync_config_id: string | null;
          conversation_id: string | null;
          customer_display_name: string | null;
          customer_phone: string | null;
          customer_email: string | null;
          service_name: string | null;
          status:
            | "draft"
            | "pending"
            | "confirmed"
            | "rescheduled"
            | "cancelled"
            | "completed"
            | "no_show";
          starts_at: string | null;
          ends_at: string | null;
          timezone: string | null;
          external_booking_id: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          booking_sync_config_id?: string | null;
          conversation_id?: string | null;
          customer_display_name?: string | null;
          customer_phone?: string | null;
          customer_email?: string | null;
          service_name?: string | null;
          status?:
            | "draft"
            | "pending"
            | "confirmed"
            | "rescheduled"
            | "cancelled"
            | "completed"
            | "no_show";
          starts_at?: string | null;
          ends_at?: string | null;
          timezone?: string | null;
          external_booking_id?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["booking_records"]["Insert"]>;
        Relationships: [];
      };
      official_whatsapp_configs: {
        Row: {
          id: string;
          tenant_id: string;
          channel_binding_id: string;
          provider: string;
          status:
            | "pending_review"
            | "pending_credentials"
            | "ready"
            | "connected"
            | "paused"
            | "failed";
          waba_id: string | null;
          phone_number_id: string | null;
          display_phone_number: string | null;
          business_verification_status: string | null;
          messaging_limit_tier: string | null;
          webhook_url: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          channel_binding_id: string;
          provider?: string;
          status?:
            | "pending_review"
            | "pending_credentials"
            | "ready"
            | "connected"
            | "paused"
            | "failed";
          waba_id?: string | null;
          phone_number_id?: string | null;
          display_phone_number?: string | null;
          business_verification_status?: string | null;
          messaging_limit_tier?: string | null;
          webhook_url?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["official_whatsapp_configs"]["Insert"]>;
        Relationships: [];
      };
      customers: {
        Row: {
          id: string;
          tenant_id: string;
          display_name: string | null;
          phone: string | null;
          email: string | null;
          source: string | null;
          status: "active" | "blocked" | "archived";
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          display_name?: string | null;
          phone?: string | null;
          email?: string | null;
          source?: string | null;
          status?: "active" | "blocked" | "archived";
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["customers"]["Insert"]>;
        Relationships: [];
      };
      consent_records: {
        Row: {
          id: string;
          tenant_id: string;
          customer_id: string | null;
          channel: "whatsapp" | "voice" | "email" | "sms";
          consent_type: string;
          status: "unknown" | "opted_in" | "opted_out" | "revoked";
          source: string | null;
          captured_at: string | null;
          expires_at: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          customer_id?: string | null;
          channel: "whatsapp" | "voice" | "email" | "sms";
          consent_type?: string;
          status?: "unknown" | "opted_in" | "opted_out" | "revoked";
          source?: string | null;
          captured_at?: string | null;
          expires_at?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["consent_records"]["Insert"]>;
        Relationships: [];
      };
      compliance_reviews: {
        Row: {
          id: string;
          tenant_id: string;
          review_type: string;
          status: "pending" | "approved" | "blocked" | "needs_review";
          restricted_category: string | null;
          notes: string | null;
          reviewed_by: string | null;
          reviewed_at: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          review_type?: string;
          status?: "pending" | "approved" | "blocked" | "needs_review";
          restricted_category?: string | null;
          notes?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["compliance_reviews"]["Insert"]>;
        Relationships: [];
      };
      provider_activation_states: {
        Row: {
          id: string;
          tenant_id: string;
          provider_key: string;
          provider_name: string;
          category: string;
          status:
            | "not_configured"
            | "pending_credentials"
            | "ready"
            | "active"
            | "paused"
            | "failed";
          live_enabled: boolean;
          requires_review: boolean;
          checklist: Json;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          provider_key: string;
          provider_name: string;
          category?: string;
          status?:
            | "not_configured"
            | "pending_credentials"
            | "ready"
            | "active"
            | "paused"
            | "failed";
          live_enabled?: boolean;
          requires_review?: boolean;
          checklist?: Json;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["provider_activation_states"]["Insert"]>;
        Relationships: [];
      };
      platform_events: {
        Row: {
          id: string;
          tenant_id: string | null;
          event_type: string;
          severity: "debug" | "info" | "warning" | "error" | "critical";
          source: string | null;
          message: string;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id?: string | null;
          event_type: string;
          severity?: "debug" | "info" | "warning" | "error" | "critical";
          source?: string | null;
          message: string;
          metadata?: Json;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["platform_events"]["Insert"]>;
        Relationships: [];
      };
      webhook_ingest_events: {
        Row: {
          id: string;
          tenant_id: string | null;
          provider: string;
          event_type: string;
          status: string;
          external_account_id: string | null;
          external_conversation_id: string | null;
          external_message_id: string | null;
          payload: Json;
          error_message: string | null;
          processed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id?: string | null;
          provider: string;
          event_type: string;
          status?: string;
          external_account_id?: string | null;
          external_conversation_id?: string | null;
          external_message_id?: string | null;
          payload?: Json;
          error_message?: string | null;
          processed_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["webhook_ingest_events"]["Insert"]>;
        Relationships: [];
      };
      outbound_messages: {
        Row: {
          id: string;
          tenant_id: string;
          conversation_id: string | null;
          customer_id: string | null;
          channel: "whatsapp" | "voice" | "email" | "sms";
          provider: string | null;
          review_status: "draft" | "approved" | "sent" | "failed" | "cancelled";
          body: string;
          recipient_phone: string | null;
          recipient_email: string | null;
          external_message_id: string | null;
          created_by: string | null;
          sent_at: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          conversation_id?: string | null;
          customer_id?: string | null;
          channel: "whatsapp" | "voice" | "email" | "sms";
          provider?: string | null;
          review_status?: "draft" | "approved" | "sent" | "failed" | "cancelled";
          body: string;
          recipient_phone?: string | null;
          recipient_email?: string | null;
          external_message_id?: string | null;
          created_by?: string | null;
          sent_at?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["outbound_messages"]["Insert"]>;
        Relationships: [];
      };
      data_privacy_requests: {
        Row: {
          id: string;
          tenant_id: string;
          request_type:
            | "access"
            | "export"
            | "correction"
            | "deletion"
            | "restriction"
            | "retention_review"
            | "incident";
          status: "open" | "in_review" | "fulfilled" | "rejected" | "cancelled";
          customer_id: string | null;
          subject_contact: string | null;
          subject_display_name: string | null;
          due_at: string | null;
          completed_at: string | null;
          completed_by: string | null;
          notes: string | null;
          resolution_notes: string | null;
          metadata: Json;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          request_type:
            | "access"
            | "export"
            | "correction"
            | "deletion"
            | "restriction"
            | "retention_review"
            | "incident";
          status?: "open" | "in_review" | "fulfilled" | "rejected" | "cancelled";
          customer_id?: string | null;
          subject_contact?: string | null;
          subject_display_name?: string | null;
          due_at?: string | null;
          completed_at?: string | null;
          completed_by?: string | null;
          notes?: string | null;
          resolution_notes?: string | null;
          metadata?: Json;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["data_privacy_requests"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_tenant_member: {
        Args: { target_tenant: string };
        Returns: boolean;
      };
      tenant_member_role: {
        Args: { target_tenant: string };
        Returns: string | null;
      };
      is_tenant_admin: {
        Args: { target_tenant: string };
        Returns: boolean;
      };
      create_tenant_with_owner: {
        Args: {
          p_business_name: string;
          p_business_type: string;
          p_city?: string | null;
          p_country?: string | null;
          p_timezone?: string | null;
          p_language?: string | null;
          p_human_fallback_number?: string | null;
        };
        Returns: string;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Tenant = Database["public"]["Tables"]["tenants"]["Row"];
export type TenantSettings = Database["public"]["Tables"]["tenant_settings"]["Row"];
export type TenantRole = "owner" | "admin" | "staff";
export type CatalogCategory =
  Database["public"]["Tables"]["catalog_categories"]["Row"];
export type CatalogItem = Database["public"]["Tables"]["catalog_items"]["Row"];
export type Conversation =
  Database["public"]["Tables"]["conversations"]["Row"];
export type Message = Database["public"]["Tables"]["messages"]["Row"];
export type ChannelBinding =
  Database["public"]["Tables"]["channel_bindings"]["Row"];
export type WhatsappBetaSession =
  Database["public"]["Tables"]["whatsapp_beta_sessions"]["Row"];
export type VoiceBetaSession =
  Database["public"]["Tables"]["voice_beta_sessions"]["Row"];
export type AiToolConfig =
  Database["public"]["Tables"]["ai_tool_configs"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];
export type AutomationWorkflow =
  Database["public"]["Tables"]["automation_workflows"]["Row"];
export type BillingAccount =
  Database["public"]["Tables"]["billing_accounts"]["Row"];
export type BookingSyncConfig =
  Database["public"]["Tables"]["booking_sync_configs"]["Row"];
export type BookingRecord =
  Database["public"]["Tables"]["booking_records"]["Row"];
export type OfficialWhatsappConfig =
  Database["public"]["Tables"]["official_whatsapp_configs"]["Row"];
export type Customer = Database["public"]["Tables"]["customers"]["Row"];
export type ConsentRecord =
  Database["public"]["Tables"]["consent_records"]["Row"];
export type ComplianceReview =
  Database["public"]["Tables"]["compliance_reviews"]["Row"];
export type ProviderActivationState =
  Database["public"]["Tables"]["provider_activation_states"]["Row"];
export type PlatformEvent =
  Database["public"]["Tables"]["platform_events"]["Row"];
export type WebhookIngestEvent =
  Database["public"]["Tables"]["webhook_ingest_events"]["Row"];
export type OutboundMessage =
  Database["public"]["Tables"]["outbound_messages"]["Row"];
export type DataPrivacyRequest =
  Database["public"]["Tables"]["data_privacy_requests"]["Row"];
