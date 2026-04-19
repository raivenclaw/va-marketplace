"use server";

import { createServerSupabase } from "./supabase-server";
import { cookies } from "next/headers";

// Auth actions
export async function signUp(formData: FormData) {
  const supabase = createServerSupabase();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("full_name") as string;
  const role = (formData.get("role") as string) || "client";

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (error) {
    return { error: error.message };
  }

  // Update the marketplace profile with role
  if (data.user) {
    await supabase
      .from("marketplace_profiles")
      .update({ role, full_name: fullName })
      .eq("id", data.user.id);
  }

  // Create a session
  const {
    data: session,
    error: signInError,
  } = await supabase.auth.signInWithPassword({ email, password });

  if (signInError) {
    return { error: signInError.message };
  }

  // Store session in cookie
  const cookieStore = await cookies();
  cookieStore.set("sb-access-token", session.session?.access_token || "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  });
  cookieStore.set("sb-refresh-token", session.session?.refresh_token || "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });
  cookieStore.set("sb-user-id", data.user?.id || "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return { success: true, userId: data.user?.id };
}

export async function signIn(formData: FormData) {
  const supabase = createServerSupabase();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  const cookieStore = await cookies();
  cookieStore.set("sb-access-token", data.session?.access_token || "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  cookieStore.set("sb-refresh-token", data.session?.refresh_token || "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  cookieStore.set("sb-user-id", data.user?.id || "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return { success: true, userId: data.user?.id };
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete("sb-access-token");
  cookieStore.delete("sb-refresh-token");
  cookieStore.delete("sb-user-id");
  return { success: true };
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("sb-user-id")?.value;
  if (!userId) return null;

  const supabase = createServerSupabase();
  const { data } = await supabase
    .from("marketplace_profiles")
    .select("*")
    .eq("id", userId)
    .single();

  return data;
}

// Profile actions
export async function updateProfile(formData: FormData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("sb-user-id")?.value;
  if (!userId) return { error: "Not authenticated" };

  const supabase = createServerSupabase();
  const updates: Record<string, unknown> = {};

  const fields = [
    "full_name",
    "bio",
    "headline",
    "role",
    "location",
    "availability",
    "currency",
  ];
  for (const field of fields) {
    const value = formData.get(field);
    if (value !== null) updates[field] = value;
  }

  const hourlyRate = formData.get("hourly_rate");
  if (hourlyRate) updates.hourly_rate = parseFloat(hourlyRate as string);

  const languages = formData.get("languages");
  if (languages) updates.languages = (languages as string).split(",").map((l) => l.trim());

  updates.updated_at = new Date().toISOString();

  const { error } = await supabase
    .from("marketplace_profiles")
    .update(updates)
    .eq("id", userId);

  if (error) return { error: error.message };
  return { success: true };
}

// Service actions
export async function addService(formData: FormData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("sb-user-id")?.value;
  if (!userId) return { error: "Not authenticated" };

  const supabase = createServerSupabase();
  const { error } = await supabase.from("marketplace_services").insert({
    profile_id: userId,
    category_id: parseInt(formData.get("category_id") as string),
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    price: parseFloat(formData.get("price") as string),
    price_type: formData.get("price_type") as string,
  });

  if (error) return { error: error.message };
  return { success: true };
}

export async function deleteService(serviceId: number) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("sb-user-id")?.value;
  if (!userId) return { error: "Not authenticated" };

  const supabase = createServerSupabase();
  const { error } = await supabase
    .from("marketplace_services")
    .delete()
    .eq("id", serviceId)
    .eq("profile_id", userId);

  if (error) return { error: error.message };
  return { success: true };
}

// Message actions
export async function sendMessage(receiverId: string, content: string) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("sb-user-id")?.value;
  if (!userId) return { error: "Not authenticated" };

  const supabase = createServerSupabase();

  // Find or create conversation
  const { data: existingConv } = await supabase
    .from("marketplace_conversations")
    .select("*")
    .or(
      `and(participant_1.eq.${userId},participant_2.eq.${receiverId}),and(participant_1.eq.${receiverId},participant_2.eq.${userId})`
    )
    .single();

  let conversationId: number;

  if (existingConv) {
    conversationId = existingConv.id;
    await supabase
      .from("marketplace_conversations")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", conversationId);
  } else {
    const { data: newConv, error: convError } = await supabase
      .from("marketplace_conversations")
      .insert({
        participant_1: userId,
        participant_2: receiverId,
        last_message_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (convError) return { error: convError.message };
    conversationId = newConv.id;
  }

  const { error } = await supabase.from("marketplace_messages").insert({
    conversation_id: conversationId,
    sender_id: userId,
    receiver_id: receiverId,
    content,
  });

  if (error) return { error: error.message };
  return { success: true };
}

export async function getConversations() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("sb-user-id")?.value;
  if (!userId) return [];

  const supabase = createServerSupabase();
  const { data } = await supabase
    .from("marketplace_conversations")
    .select("*")
    .or(`participant_1.eq.${userId},participant_2.eq.${userId}`)
    .order("last_message_at", { ascending: false });

  return data || [];
}

export async function getMessages(conversationId: number) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("sb-user-id")?.value;
  if (!userId) return [];

  const supabase = createServerSupabase();
  const { data } = await supabase
    .from("marketplace_messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  return data || [];
}

// Review actions
export async function addReview(formData: FormData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("sb-user-id")?.value;
  if (!userId) return { error: "Not authenticated" };

  const supabase = createServerSupabase();
  const freelancerId = formData.get("freelancer_id") as string;
  const rating = parseInt(formData.get("rating") as string);

  const { error } = await supabase.from("marketplace_reviews").insert({
    reviewer_id: userId,
    freelancer_id: freelancerId,
    rating,
    comment: formData.get("comment") as string,
  });

  if (error) return { error: error.message };

  // Update freelancer's average rating
  const { data: reviews } = await supabase
    .from("marketplace_reviews")
    .select("rating")
    .eq("freelancer_id", freelancerId);

  if (reviews && reviews.length > 0) {
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await supabase
      .from("marketplace_profiles")
      .update({
        rating_avg: Math.round(avg * 100) / 100,
        rating_count: reviews.length,
      })
      .eq("id", freelancerId);
  }

  return { success: true };
}
