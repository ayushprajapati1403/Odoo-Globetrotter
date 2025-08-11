import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          home_city_id: string | null
          currency: string
          preferences: any
          created_at: string
          updated_at: string
          active: boolean
          currency_id: string | null
          photo: string | null
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          home_city_id?: string | null
          currency?: string
          preferences?: any
          created_at?: string
          updated_at?: string
          active?: boolean
          currency_id?: string | null
          photo?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          home_city_id?: string | null
          currency?: string
          preferences?: any
          created_at?: string
          updated_at?: string
          active?: boolean
          currency_id?: string | null
          photo?: string | null
        }
      }
      cities: {
        Row: {
          id: string
          name: string
          country: string | null
          iso_country_code: string | null
          lat: number | null
          lng: number | null
          population: number | null
          cost_index: number
          avg_daily_hotel: number | null
          popularity_score: number
          metadata: any
          created_at: string
          updated_at: string
          tsv: any
        }
        Insert: {
          id?: string
          name: string
          country?: string | null
          iso_country_code?: string | null
          lat?: number | null
          lng?: number | null
          population?: number | null
          cost_index?: number
          avg_daily_hotel?: number | null
          popularity_score?: number
          metadata?: any
          created_at?: string
          updated_at?: string
          tsv?: any
        }
        Update: {
          id?: string
          name?: string
          country?: string | null
          iso_country_code?: string | null
          lat?: number | null
          lng?: number | null
          population?: number | null
          cost_index?: number
          avg_daily_hotel?: number | null
          popularity_score?: number
          metadata?: any
          created_at?: string
          updated_at?: string
          tsv?: any
        }
      }
      trips: {
        Row: {
          id: string
          user_id: string | null
          name: string
          description: string | null
          start_date: string | null
          end_date: string | null
          is_public: boolean
          cover_photo_url: string | null
          currency: string
          total_estimated_cost: number | null
          metadata: any
          created_at: string
          updated_at: string
          deleted: boolean
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          description?: string | null
          start_date?: string | null
          end_date?: string | null
          is_public?: boolean
          cover_photo_url?: string | null
          currency?: string
          total_estimated_cost?: number | null
          metadata?: any
          created_at?: string
          updated_at?: string
          deleted?: boolean
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          description?: string | null
          start_date?: string | null
          end_date?: string | null
          is_public?: boolean
          cover_photo_url?: string | null
          currency?: string
          total_estimated_cost?: number | null
          metadata?: any
          created_at?: string
          updated_at?: string
          deleted?: boolean
        }
      }
      trip_stops: {
        Row: {
          id: string
          trip_id: string | null
          seq: number
          city_id: string | null
          start_date: string | null
          end_date: string | null
          local_transport_cost: number | null
          accommodation_estimate: number | null
          notes: string | null
          metadata: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          trip_id?: string | null
          seq: number
          city_id?: string | null
          start_date?: string | null
          end_date?: string | null
          local_transport_cost?: number | null
          accommodation_estimate?: number | null
          notes?: string | null
          metadata?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          trip_id?: string | null
          seq?: number
          city_id?: string | null
          start_date?: string | null
          end_date?: string | null
          local_transport_cost?: number | null
          accommodation_estimate?: number | null
          notes?: string | null
          metadata?: any
          created_at?: string
          updated_at?: string
        }
      }
      activities: {
        Row: {
          id: string
          city_id: string | null
          name: string
          description: string | null
          category: string | null
          cost: number | null
          duration_minutes: number | null
          vendor: string | null
          metadata: any
          created_at: string
          updated_at: string
          deleted: boolean
        }
        Insert: {
          id?: string
          city_id?: string | null
          name: string
          description?: string | null
          category?: string | null
          cost?: number | null
          duration_minutes?: number | null
          vendor?: string | null
          metadata?: any
          created_at?: string
          updated_at?: string
          deleted?: boolean
        }
        Update: {
          id?: string
          city_id?: string | null
          name?: string
          description?: string | null
          category?: string | null
          cost?: number | null
          duration_minutes?: number | null
          vendor?: string | null
          metadata?: any
          created_at?: string
          updated_at?: string
          deleted?: boolean
        }
      }
      trip_activities: {
        Row: {
          id: string
          trip_stop_id: string | null
          activity_id: string | null
          name: string
          scheduled_date: string | null
          start_time: string | null
          duration_minutes: number | null
          cost: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          trip_stop_id?: string | null
          activity_id?: string | null
          name: string
          scheduled_date?: string | null
          start_time?: string | null
          duration_minutes?: number | null
          cost?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          trip_stop_id?: string | null
          activity_id?: string | null
          name?: string
          scheduled_date?: string | null
          start_time?: string | null
          duration_minutes?: number | null
          cost?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      accommodations: {
        Row: {
          id: string
          city_id: string | null
          provider: string | null
          name: string | null
          price_per_night: number | null
          currency: string
          metadata: any
          created_at: string
        }
        Insert: {
          id?: string
          city_id?: string | null
          provider?: string | null
          name?: string | null
          price_per_night?: number | null
          currency?: string
          metadata?: any
          created_at?: string
        }
        Update: {
          id?: string
          city_id?: string | null
          provider?: string | null
          name?: string | null
          price_per_night?: number | null
          currency?: string
          metadata?: any
          created_at?: string
        }
      }
      transport_costs: {
        Row: {
          id: string
          from_city_id: string | null
          to_city_id: string | null
          mode: string
          avg_cost: number | null
          avg_duration_minutes: number | null
          provider: string | null
          metadata: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          from_city_id?: string | null
          to_city_id?: string | null
          mode: string
          avg_cost?: number | null
          avg_duration_minutes?: number | null
          provider?: string | null
          metadata?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          from_city_id?: string | null
          to_city_id?: string | null
          mode?: string
          avg_cost?: number | null
          avg_duration_minutes?: number | null
          provider?: string | null
          metadata?: any
          created_at?: string
          updated_at?: string
        }
      }
      currencies: {
        Row: {
          id: string
          code: string
          name: string
          symbol: string | null
          exchange_rate_to_usd: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          name: string
          symbol?: string | null
          exchange_rate_to_usd?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          name?: string
          symbol?: string | null
          exchange_rate_to_usd?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      shared_links: {
        Row: {
          id: string
          trip_id: string | null
          token: string
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          trip_id?: string | null
          token: string
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          trip_id?: string | null
          token?: string
          expires_at?: string | null
          created_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          entity_type: string
          entity_id: string | null
          action: string
          performed_by: string | null
          payload: any
          created_at: string
        }
        Insert: {
          id?: string
          entity_type: string
          entity_id?: string | null
          action: string
          performed_by?: string | null
          payload?: any
          created_at?: string
        }
        Update: {
          id?: string
          entity_type?: string
          entity_id?: string | null
          action?: string
          performed_by?: string | null
          payload?: any
          created_at?: string
        }
      }
    }
  }
}
