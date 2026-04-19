import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase-server";
import type { Category, Profile } from "@/lib/supabase-server";
import {
  Search,
  Users,
  MessageSquare,
  Rocket,
  Star,
  Shield,
  Clock,
  ArrowRight,
} from "lucide-react";

async function getCategories(): Promise<Category[]> {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from("marketplace_categories")
    .select("*")
    .order("id")
    .limit(9);
  return (data as Category[]) || [];
}

async function getFeaturedFreelancers(): Promise<Profile[]> {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from("marketplace_profiles")
    .select("*")
    .in("role", ["freelancer", "both"])
    .eq("availability", "available")
    .order("rating_avg", { ascending: false })
    .limit(4);
  return (data as Profile[]) || [];
}

const categoryIcons: Record<string, string> = {
  clipboard: "📋",
  calculator: "💰",
  "share-2": "📱",
  mail: "📧",
  headphones: "🎧",
  search: "🔍",
  calendar: "📅",
  globe: "🌍",
  "bar-chart-2": "📊",
  "pen-tool": "✍️",
  palette: "🎨",
  monitor: "🌐",
  users: "👥",
  "user-plus": "🤝",
  star: "⭐",
};

export default async function HomePage() {
  const [categories, freelancers] = await Promise.all([
    getCategories(),
    getFeaturedFreelancers(),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Vind de perfecte
              <span className="text-indigo-200"> virtuele assistent</span>
            </h1>
            <p className="text-lg sm:text-xl text-indigo-100 mb-10">
              Het platform voor Nederlandse virtuele assistenten. Betrouwbaar,
              betaalbaar, direct beschikbaar.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <Link
                href="/browse"
                className="flex-1 bg-white text-indigo-700 px-6 py-3 rounded-lg font-semibold text-center hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                Zoek een VA
              </Link>
              <Link
                href="/signup?role=freelancer"
                className="flex-1 bg-indigo-500 text-white px-6 py-3 rounded-lg font-semibold text-center hover:bg-indigo-400 transition-colors border border-indigo-400"
              >
                Word VA op ons platform
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap justify-center gap-8 text-center text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <span className="font-semibold text-gray-900">500+</span> VAs
              beschikbaar
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              <span className="font-semibold text-gray-900">4.8</span>{" "}
              gemiddelde beoordeling
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-gray-900">100%</span> veilig
              platform
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Gemiddeld{" "}
              <span className="font-semibold text-gray-900">2 uur</span>{" "}
              responstijd
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">
            Hoe het werkt
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            In drie eenvoudige stappen vind je de perfecte virtuele assistent
            voor jouw bedrijf.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                title: "1. Zoek",
                desc: "Browse VAs op categorie, beschikbaarheid en tarief. Filter op taal, ervaring en specialisatie.",
                color: "bg-indigo-100 text-indigo-600",
              },
              {
                icon: MessageSquare,
                title: "2. Verbind",
                desc: "Neem direct contact op met je favoriete VA. Bespreek je wensen en maak afspraken.",
                color: "bg-blue-100 text-blue-600",
              },
              {
                icon: Rocket,
                title: "3. Start",
                desc: "Begin direct met samenwerken. Betaal veilig via het platform en bouw een langdurige relatie op.",
                color: "bg-green-100 text-green-600",
              },
            ].map((step) => (
              <div
                key={step.title}
                className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div
                  className={`w-14 h-14 ${step.color} rounded-xl flex items-center justify-center mx-auto mb-5`}
                >
                  <step.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-gray-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Populaire categorieën
              </h2>
              <p className="text-gray-600 mt-2">
                Ontdek de meest gevraagde diensten
              </p>
            </div>
            <Link
              href="/browse"
              className="hidden sm:flex items-center gap-1 text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
            >
              Bekijk alle
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/browse?category=${cat.slug}`}
                className="bg-white rounded-xl p-5 border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all text-center group"
              >
                <span className="text-3xl mb-3 block">
                  {categoryIcons[cat.icon || ""] || "📌"}
                </span>
                <h3 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors text-sm">
                  {cat.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Freelancers */}
      {freelancers.length > 0 && (
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">
              Uitgelichte Virtuele Assistenten
            </h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Ontdek top-rated VAs die direct beschikbaar zijn
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {freelancers.map((f) => (
                <Link
                  key={f.id}
                  href={`/profile/${f.id}`}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  <div className="h-20 bg-gradient-to-r from-indigo-500 to-purple-600" />
                  <div className="p-5 -mt-8">
                    <div className="w-16 h-16 bg-indigo-200 rounded-full border-4 border-white flex items-center justify-center mb-3">
                      {f.avatar_url ? (
                        <img
                          src={f.avatar_url}
                          alt={f.full_name || ""}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-indigo-600 font-bold text-xl">
                          {(f.full_name || "?").charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {f.full_name || "Anoniem"}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {f.headline || f.bio || "Virtuele assistent"}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="text-sm font-medium text-gray-900">
                          {f.rating_avg > 0
                            ? Number(f.rating_avg).toFixed(1)
                            : "Nieuw"}
                        </span>
                        {f.rating_count > 0 && (
                          <span className="text-xs text-gray-400">
                            ({f.rating_count})
                          </span>
                        )}
                      </div>
                      {f.hourly_rate && (
                        <span className="text-sm font-semibold text-indigo-600">
                          {"\u20AC"}
                          {Number(f.hourly_rate).toFixed(0)}/uur
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Value Propositions */}
      <section className="bg-indigo-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 border border-indigo-100">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Voor Opdrachtgevers
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">&#10003;</span>
                  Gecontroleerde VAs
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">&#10003;</span>
                  Veilige betaling
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">&#10003;</span>
                  Geen abonnement nodig
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">&#10003;</span>
                  Direct contact opnemen
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-8 border border-indigo-100">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Voor VAs
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">&#10003;</span>
                  Gratis aanmelden
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">&#10003;</span>
                  Lage commissie (10%)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">&#10003;</span>
                  Meer Nederlandse klanten
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">&#10003;</span>
                  Eigen profiel pagina
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-8 border border-indigo-100">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Platform Garantie
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">&#10003;</span>
                  Escrow betaling
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">&#10003;</span>
                  Review systeem
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">&#10003;</span>
                  Klantenondersteuning
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">&#10003;</span>
                  Geschillenoplossing
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Trustpilot Placeholder */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
            <p className="text-gray-500 text-sm mb-2">
              Beoordeeld door onze gebruikers
            </p>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-6 h-6 text-green-500 fill-green-500"
                />
              ))}
            </div>
            <p className="text-gray-700 font-medium">
              Trustpilot widget wordt hier getoond
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Trustpilot integratie beschikbaar na activatie
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-700 py-16 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Begin vandaag</h2>
          <p className="text-indigo-100 mb-8 text-lg">
            Sluit je aan bij het snelst groeiende platform voor virtuele
            assistenten in Nederland.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-white text-indigo-700 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
            >
              Zoek een VA
            </Link>
            <Link
              href="/signup?role=freelancer"
              className="bg-indigo-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-400 transition-colors border border-indigo-400"
            >
              Word VA
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
