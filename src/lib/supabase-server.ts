import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export function createServerSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Types
export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  headline: string | null;
  role: "client" | "freelancer" | "both";
  hourly_rate: number | null;
  currency: string;
  location: string | null;
  languages: string[] | null;
  availability: "available" | "busy" | "unavailable";
  rating_avg: number;
  rating_count: number;
  profile_views: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
}

export interface FreelancerService {
  id: number;
  profile_id: string;
  category_id: number;
  title: string;
  description: string | null;
  price: number | null;
  price_type: "hourly" | "fixed" | "daily";
  created_at: string;
  category?: Category;
}

export interface Review {
  id: number;
  reviewer_id: string;
  freelancer_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer?: Profile;
}

export interface Message {
  id: number;
  conversation_id: number;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

export interface Conversation {
  id: number;
  participant_1: string;
  participant_2: string;
  last_message_at: string;
}
