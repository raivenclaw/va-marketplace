import { getCurrentUser } from "@/lib/actions";
import { createServerSupabase } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Star, Eye, MessageSquare, Settings, Plus, Trash2 } from "lucide-react";
import { DeleteServiceButton } from "./delete-service-button";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const supabase = createServerSupabase();

  // Fetch services if freelancer
  const isFreelancer = user.role === "freelancer" || user.role === "both";
  let services: Array<{
    id: number;
    title: string;
    price: number | null;
    price_type: string;
    category: { name: string } | null;
  }> = [];

  if (isFreelancer) {
    const { data } = await supabase
      .from("marketplace_services")
      .select("*, category:marketplace_categories(name)")
      .eq("profile_id", user.id)
      .order("created_at", { ascending: false });
    services = data || [];
  }

  // Fetch reviews
  const { data: reviews } = await supabase
    .from("marketplace_reviews")
    .select("*")
    .eq("freelancer_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  // Fetch message count
  const { count: messageCount } = await supabase
    .from("marketplace_conversations")
    .select("*", { count: "exact", head: true })
    .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-indigo-200 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 font-bold text-2xl">
                  {(user.full_name || "?").charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {user.full_name || "Welkom"}
                </h1>
                <p className="text-gray-500 text-sm">
                  {user.role === "freelancer"
                    ? "Virtuele Assistent"
                    : user.role === "both"
                    ? "Opdrachtgever & VA"
                    : "Opdrachtgever"}
                </p>
                {user.headline && (
                  <p className="text-gray-600 text-sm mt-1">{user.headline}</p>
                )}
              </div>
            </div>
            <Link
              href="/dashboard/settings"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
            >
              <Settings className="w-4 h-4" />
              Bewerken
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <Eye className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
              <p className="text-2xl font-bold text-gray-900">{user.profile_views || 0}</p>
              <p className="text-xs text-gray-500">Profielweergaven</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <MessageSquare className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <p className="text-2xl font-bold text-gray-900">{messageCount || 0}</p>
              <p className="text-xs text-gray-500">Gesprekken</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <Star className="w-5 h-5 text-amber-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-gray-900">
                {user.rating_avg > 0 ? Number(user.rating_avg).toFixed(1) : "-"}
              </p>
              <p className="text-xs text-gray-500">Beoordeling</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <Star className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <p className="text-2xl font-bold text-gray-900">{user.rating_count || 0}</p>
              <p className="text-xs text-gray-500">Reviews</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Services */}
          {isFreelancer && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Mijn Diensten</h2>
                <Link
                  href="/onboarding"
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Toevoegen
                </Link>
              </div>
              {services.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  Je hebt nog geen diensten.{" "}
                  <Link href="/onboarding" className="text-indigo-600 hover:underline">
                    Voeg je eerste dienst toe
                  </Link>
                </p>
              ) : (
                <div className="space-y-3">
                  {services.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{s.title}</p>
                        {s.category && (
                          <p className="text-xs text-gray-500">{(s.category as { name: string }).name}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-indigo-600">
                          {"\u20AC"}{s.price ? Number(s.price).toFixed(0) : "0"}
                          {s.price_type === "hourly" ? "/uur" : s.price_type === "daily" ? "/dag" : ""}
                        </span>
                        <DeleteServiceButton serviceId={s.id} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Quick Links */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Snelkoppelingen</h2>
            <div className="space-y-3">
              <Link
                href="/dashboard/messages"
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900 text-sm">Berichten</p>
                  <p className="text-xs text-gray-500">{messageCount || 0} gesprekken</p>
                </div>
              </Link>
              <Link
                href={`/profile/${user.id}`}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Eye className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="font-medium text-gray-900 text-sm">Bekijk mijn profiel</p>
                  <p className="text-xs text-gray-500">Zoals anderen het zien</p>
                </div>
              </Link>
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900 text-sm">Instellingen</p>
                  <p className="text-xs text-gray-500">Profiel bewerken</p>
                </div>
              </Link>
              <Link
                href="/browse"
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Star className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="font-medium text-gray-900 text-sm">Browse VAs</p>
                  <p className="text-xs text-gray-500">Ontdek virtuele assistenten</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Reviews */}
          {isFreelancer && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 lg:col-span-2">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recente Reviews</h2>
              {!reviews || reviews.length === 0 ? (
                <p className="text-gray-500 text-sm">Nog geen reviews ontvangen.</p>
              ) : (
                <div className="space-y-3">
                  {reviews.map((r) => (
                    <div key={r.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < r.rating ? "text-amber-500 fill-amber-500" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(r.created_at).toLocaleDateString("nl-NL")}
                        </span>
                      </div>
                      {r.comment && <p className="text-sm text-gray-600">{r.comment}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
