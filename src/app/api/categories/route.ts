import { createServerSupabase } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("marketplace_categories")
    .select("*")
    .order("id");

  if (error) {
    return NextResponse.json([], { status: 500 });
  }

  return NextResponse.json(data);
}
