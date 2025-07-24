import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface TrainerApplication {
  id: string;
  full_name: string;
  email: string;
  business_name: string;
  selected_tier: string;
  goals: string;
  instagram_url?: string;
  referral_name?: string;
  preferred_times?: Array<{day: string, time: string}>;
  status: string;
  stripe_link?: string;
  zoom_link?: string;
  created_at: string;
  updated_at: string;
}
