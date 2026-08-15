/**
 * Hand-written Supabase Database type, matching supabase/migrations/*.sql
 * exactly. In a normal workflow this would be generated with
 * `supabase gen types typescript` against the live project; that wasn't
 * reachable from this environment, so it's maintained by hand instead —
 * keep it in sync with the migrations when either changes.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Timestamps = { created_at: string; updated_at: string };

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: { id: string; name: string; slug: string } & Timestamps;
        Insert: { id?: string; name: string; slug: string; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["organizations"]["Insert"]>;
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          first_name: string | null;
          last_name: string | null;
          avatar_url: string | null;
        } & Timestamps;
        Insert: {
          id: string;
          first_name?: string | null;
          last_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      organization_memberships: {
        Row: {
          id: string;
          organization_id: string;
          user_id: string;
          role: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          user_id: string;
          role?: string;
          status?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["organization_memberships"]["Insert"]>;
        Relationships: [];
      };
      roles: {
        Row: { id: string; key: string; name: string; created_at: string };
        Insert: { id?: string; key: string; name: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["roles"]["Insert"]>;
        Relationships: [];
      };
      permissions: {
        Row: { id: string; key: string; description: string };
        Insert: { id?: string; key: string; description: string };
        Update: Partial<Database["public"]["Tables"]["permissions"]["Insert"]>;
        Relationships: [];
      };
      role_permissions: {
        Row: { role_key: string; permission_id: string };
        Insert: { role_key: string; permission_id: string };
        Update: Partial<Database["public"]["Tables"]["role_permissions"]["Insert"]>;
        Relationships: [];
      };
      companies: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          website: string | null;
          industry: string | null;
          employee_count: number | null;
          headquarters: string | null;
          description: string | null;
          status: string;
          created_by: string | null;
        } & Timestamps;
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          website?: string | null;
          industry?: string | null;
          employee_count?: number | null;
          headquarters?: string | null;
          description?: string | null;
          status?: string;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["companies"]["Insert"]>;
        Relationships: [];
      };
      contacts: {
        Row: {
          id: string;
          organization_id: string;
          company_id: string | null;
          first_name: string;
          last_name: string;
          title: string | null;
          email: string | null;
          phone: string | null;
          linkedin_url: string | null;
          notes: string | null;
          created_by: string | null;
        } & Timestamps;
        Insert: {
          id?: string;
          organization_id: string;
          company_id?: string | null;
          first_name: string;
          last_name: string;
          title?: string | null;
          email?: string | null;
          phone?: string | null;
          linkedin_url?: string | null;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["contacts"]["Insert"]>;
        Relationships: [];
      };
      clients: {
        Row: {
          id: string;
          organization_id: string;
          company_id: string;
          status: string;
          owner_user_id: string | null;
          fee_type: string;
          fee_percentage: number | null;
          payment_terms_days: number;
          notes: string | null;
        } & Timestamps;
        Insert: {
          id?: string;
          organization_id: string;
          company_id: string;
          status?: string;
          owner_user_id?: string | null;
          fee_type?: string;
          fee_percentage?: number | null;
          payment_terms_days?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["clients"]["Insert"]>;
        Relationships: [];
      };
      jobs: {
        Row: {
          id: string;
          organization_id: string;
          client_id: string | null;
          company_id: string | null;
          title: string;
          department: string | null;
          location: string | null;
          workplace_type: string;
          employment_type: string;
          description: string | null;
          requirements: string | null;
          preferred_qualifications: string | null;
          salary_min: number | null;
          salary_max: number | null;
          currency: string;
          fee_percentage: number | null;
          status: string;
          priority: string;
          owner_user_id: string | null;
          opened_at: string | null;
          target_fill_date: string | null;
          closed_at: string | null;
        } & Timestamps;
        Insert: {
          id?: string;
          organization_id: string;
          client_id?: string | null;
          company_id?: string | null;
          title: string;
          department?: string | null;
          location?: string | null;
          workplace_type?: string;
          employment_type?: string;
          description?: string | null;
          requirements?: string | null;
          preferred_qualifications?: string | null;
          salary_min?: number | null;
          salary_max?: number | null;
          currency?: string;
          fee_percentage?: number | null;
          status?: string;
          priority?: string;
          owner_user_id?: string | null;
          opened_at?: string | null;
          target_fill_date?: string | null;
          closed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["jobs"]["Insert"]>;
        Relationships: [];
      };
      candidates: {
        Row: {
          id: string;
          organization_id: string;
          first_name: string;
          last_name: string;
          email: string | null;
          phone: string | null;
          location: string | null;
          current_title: string | null;
          current_company: string | null;
          linkedin_url: string | null;
          years_experience: number | null;
          salary_expectation: number | null;
          currency: string;
          summary: string | null;
          skills: string[];
          source: string | null;
          status: string;
          created_by: string | null;
        } & Timestamps;
        Insert: {
          id?: string;
          organization_id: string;
          first_name: string;
          last_name: string;
          email?: string | null;
          phone?: string | null;
          location?: string | null;
          current_title?: string | null;
          current_company?: string | null;
          linkedin_url?: string | null;
          years_experience?: number | null;
          salary_expectation?: number | null;
          currency?: string;
          summary?: string | null;
          skills?: string[];
          source?: string | null;
          status?: string;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["candidates"]["Insert"]>;
        Relationships: [];
      };
      applications: {
        Row: {
          id: string;
          organization_id: string;
          job_id: string;
          candidate_id: string;
          stage: string;
          status: string;
          match_score: number | null;
          owner_user_id: string | null;
          source: string | null;
        } & Timestamps;
        Insert: {
          id?: string;
          organization_id: string;
          job_id: string;
          candidate_id: string;
          stage?: string;
          status?: string;
          match_score?: number | null;
          owner_user_id?: string | null;
          source?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["applications"]["Insert"]>;
        Relationships: [];
      };
      submissions: {
        Row: {
          id: string;
          organization_id: string;
          application_id: string;
          candidate_id: string;
          job_id: string;
          submitted_by: string | null;
          summary: string | null;
          submitted_at: string | null;
          status: string;
        } & Timestamps;
        Insert: {
          id?: string;
          organization_id: string;
          application_id: string;
          candidate_id: string;
          job_id: string;
          submitted_by?: string | null;
          summary?: string | null;
          submitted_at?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["submissions"]["Insert"]>;
        Relationships: [];
      };
      interviews: {
        Row: {
          id: string;
          organization_id: string;
          application_id: string;
          candidate_id: string;
          job_id: string;
          type: string | null;
          scheduled_at: string | null;
          duration_minutes: number | null;
          location_or_link: string | null;
          status: string;
          feedback: string | null;
        } & Timestamps;
        Insert: {
          id?: string;
          organization_id: string;
          application_id: string;
          candidate_id: string;
          job_id: string;
          type?: string | null;
          scheduled_at?: string | null;
          duration_minutes?: number | null;
          location_or_link?: string | null;
          status?: string;
          feedback?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["interviews"]["Insert"]>;
        Relationships: [];
      };
      placements: {
        Row: {
          id: string;
          organization_id: string;
          application_id: string;
          candidate_id: string;
          job_id: string;
          client_id: string | null;
          start_date: string | null;
          salary: number | null;
          fee_amount: number | null;
          status: string;
        } & Timestamps;
        Insert: {
          id?: string;
          organization_id: string;
          application_id: string;
          candidate_id: string;
          job_id: string;
          client_id?: string | null;
          start_date?: string | null;
          salary?: number | null;
          fee_amount?: number | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["placements"]["Insert"]>;
        Relationships: [];
      };
      tasks: {
        Row: {
          id: string;
          organization_id: string;
          title: string;
          description: string | null;
          status: string;
          priority: string;
          assigned_user_id: string | null;
          related_entity_type: string | null;
          related_entity_id: string | null;
          due_at: string | null;
        } & Timestamps;
        Insert: {
          id?: string;
          organization_id: string;
          title: string;
          description?: string | null;
          status?: string;
          priority?: string;
          assigned_user_id?: string | null;
          related_entity_type?: string | null;
          related_entity_id?: string | null;
          due_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["tasks"]["Insert"]>;
        Relationships: [];
      };
      agents: {
        Row: {
          id: string;
          organization_id: string;
          agent_key: string;
          name: string;
          role: string;
          department: string;
          status: string;
          autonomy_level: number;
          health: number;
          system_prompt_version: string | null;
          configuration: Json;
        } & Timestamps;
        Insert: {
          id?: string;
          organization_id: string;
          agent_key: string;
          name: string;
          role: string;
          department: string;
          status?: string;
          autonomy_level?: number;
          health?: number;
          system_prompt_version?: string | null;
          configuration?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["agents"]["Insert"]>;
        Relationships: [];
      };
      agent_tasks: {
        Row: {
          id: string;
          organization_id: string;
          agent_id: string;
          task_type: string;
          status: string;
          priority: string;
          input: Json;
          output: Json | null;
          related_entity_type: string | null;
          related_entity_id: string | null;
          created_by_user_id: string | null;
          started_at: string | null;
          completed_at: string | null;
          failed_at: string | null;
          error_message: string | null;
        } & Timestamps;
        Insert: {
          id?: string;
          organization_id: string;
          agent_id: string;
          task_type: string;
          status?: string;
          priority?: string;
          input?: Json;
          output?: Json | null;
          related_entity_type?: string | null;
          related_entity_id?: string | null;
          created_by_user_id?: string | null;
          started_at?: string | null;
          completed_at?: string | null;
          failed_at?: string | null;
          error_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["agent_tasks"]["Insert"]>;
        Relationships: [];
      };
      agent_events: {
        Row: {
          id: string;
          organization_id: string;
          agent_id: string | null;
          agent_task_id: string | null;
          event_type: string;
          severity: string;
          message: string;
          payload: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          agent_id?: string | null;
          agent_task_id?: string | null;
          event_type: string;
          severity?: string;
          message: string;
          payload?: Json;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["agent_events"]["Insert"]>;
        Relationships: [];
      };
      approvals: {
        Row: {
          id: string;
          organization_id: string;
          agent_id: string | null;
          agent_task_id: string | null;
          action_type: string;
          status: string;
          risk_level: string;
          reason: string | null;
          payload: Json;
          requested_at: string;
          decided_at: string | null;
          decided_by_user_id: string | null;
          decision_notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          agent_id?: string | null;
          agent_task_id?: string | null;
          action_type: string;
          status?: string;
          risk_level?: string;
          reason?: string | null;
          payload?: Json;
          requested_at?: string;
          decided_at?: string | null;
          decided_by_user_id?: string | null;
          decision_notes?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["approvals"]["Insert"]>;
        Relationships: [];
      };
      candidate_matches: {
        Row: {
          id: string;
          organization_id: string;
          job_id: string;
          candidate_id: string;
          overall_score: number;
          skills_score: number | null;
          experience_score: number | null;
          location_score: number | null;
          compensation_score: number | null;
          domain_score: number | null;
          ai_score: number | null;
          reasoning: Json | null;
        } & Timestamps;
        Insert: {
          id?: string;
          organization_id: string;
          job_id: string;
          candidate_id: string;
          overall_score: number;
          skills_score?: number | null;
          experience_score?: number | null;
          location_score?: number | null;
          compensation_score?: number | null;
          domain_score?: number | null;
          ai_score?: number | null;
          reasoning?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["candidate_matches"]["Insert"]>;
        Relationships: [];
      };
      audit_logs: {
        Row: {
          id: string;
          organization_id: string;
          actor_type: string;
          actor_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          before_data: Json | null;
          after_data: Json | null;
          source: string | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          actor_type: string;
          actor_id?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          before_data?: Json | null;
          after_data?: Json | null;
          source?: string | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["audit_logs"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      user_organization_ids: {
        Args: Record<string, never>;
        Returns: string[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
