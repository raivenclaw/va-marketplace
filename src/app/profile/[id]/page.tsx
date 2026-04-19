import { createServerSupabase } from "@/lib/supabase-server";
import type { Profile, FreelancerService, Review } from "@/lib/supabase-server";
import { Star, MapPin, Clock, Globe, MessageSquare } from "lucide-react";
import Link from "next/link";
import { SendMessageForm } from "./send-message-form";
import { getCurrentUser } from "@/lib/actions";
import { notFound } from "next/navigation";

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

async function getProfile(id: string): Promise<Profile | null> {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from("marketplace_profiles")
    .select("*")
    .eq("id", id)
    .single();

  // Increment view count
  if (data) {
    await supabase
      .from("marketplace_profiles")
      .update({ profile_views: (data.profile_views || 0) + 1 })
      .eq("id", id);
  }

  return data as Profile | null;
}

async function getServices(profileId: string): Promise<FreelancerService[]> {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from("marketplace_services")
    .select("*, category:marketplace_categories(*)")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false });
  return (data as FreelancerService[]) || [];
}

async function getReviews(freelancerId: string): Promise<(Review & { reviewer?: Profile })[]> {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from("marketplace_reviews")
    .select("*")
    .eq("freelancer_id", freelancerId)
    .order("created_at", { ascending: false });

  if (!data) return [];

  // Fetch reviewer profiles
  const reviewerIds = [...new Set(data.map((r) => r.reviewer_id))];
  const { data: reviewers } = await supabase
    .from("marketplace_profiles")
    .select("id, full_name, avatar_url")
    .in("id", reviewerIds);

  const reviewerMap = new Map(reviewers?.map((r) => [r.id, r]) || []);

  return data.map((r) => ({
    ...r,
    reviewer: reviewerMap.get(r.reviewer_id) as Profile | undefined,
  }));
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  const [profile, services, reviews, currentUser] = await Promise.all([
    getProfile(id),
    getServices(id),
    getReviews(id),
    getCurrentUser(),
  ]);

  if (!profile) {
    notFound();
  }

  const isOwn = currentUser?.id === profile.id;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 h-40" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 pb-12">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 bg-indigo-200 rounded-full border-4 border-white shadow-lg flex items-center justify-center shrink-0">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name || ""}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-indigo-600 font-bold text-3xl">
                    {(profile.full_name || "?").charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {profile.full_name || "Anoniem"}
                    </h1>
                    {profile.headline && (
                      <p className="text-gray-600 mt-1">{profile.headline}</p>
                    )}
                  </div>
                  {isOwn && (
                    <Link
                      href="/dashboard/settings"
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      Profiel bewerken
                    </Link>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 mt-4">
                  {profile.location && (
                    <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="w-4 h-4" />
                      {profile.location}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    {profile.availability === "available"
                      ? "Beschikbaar"
                      : profile.availability === "busy"
                      ? "Beperkt beschikbaar"
                      : "Niet beschikbaar"}
                  </span>
                  {profile.languages && profile.languages.length > 0 && (
                    <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                      <Globe className="w-4 h-4" />
                      {profile.languages.join(", ")}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-6 mt-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <span className="font-semibold text-gray-900">
                      {profile.rating_avg > 0
                        ? Number(profile.rating_avg).toFixed(1)
                        : "Nieuw"}
                    </span>
                    <span className="text-sm text-gray-400">
                      ({profile.rating_count} {profile.rating_count === 1 ? "review" : "reviews"})
                    </span>
                  </div>
                  {profile.hourly_rate && (
                    <span className="text-lg font-bold text-indigo-600">
                      {"\u20AC"}{Number(profile.hourly_rate).toFixed(0)}/uur
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bio */}
            {profile.bio && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Over mij</h2>
                <p className="text-gray-600 whitespace-pre-line">{profile.bio}</p>
              </div>
            )}
          </div>
        </div>

        {/* Services */}
        {services.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Diensten</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map((s) => (
                <div
                  key={s.id}
                  className="bg-white rounded-xl border border-gray-200 p-6"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{s.title}</h3>
                      {s.category && (
                        <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full mt-1 inline-block">
                          {(s.category as { name: string }).name}
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-indigo-600">
                        {"\u20AC"}{s.price ? Number(s.price).toFixed(0) : "0"}
                      </span>
                      <span className="text-xs text-gray-400 block">
                        {s.price_type === "hourly" ? "/uur" : s.price_type === "daily" ? "/dag" : "vast"}
                      </span>
                    </div>
                  </div>
                  {s.description && (
                    <p className="text-sm text-gray-600 mt-3">{s.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Reviews ({reviews.length})
          </h2>
          {reviews.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <p className="text-gray-500">Nog geen reviews</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="bg-white rounded-xl border border-gray-200 p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-gray-600 font-semibold text-sm">
                        {(r.reviewer?.full_name || "?").charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {r.reviewer?.full_name || "Anoniem"}
                        </span>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < r.rating
                                  ? "text-amber-500 fill-amber-500"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {r.comment && (
                        <p className="text-gray-600 mt-2">{r.comment}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(r.created_at).toLocaleDateString("nl-NL")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Send Message */}
        {!isOwn && (
          <div className="mt-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
                Stuur een bericht
              </h2>
              {currentUser ? (
                <SendMessageForm receiverId={profile.id} />
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 mb-3">
                    Log in om een bericht te sturen
                  </p>
                  <Link
                    href="/login"
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors inline-block"
                  >
                    Inloggen
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
