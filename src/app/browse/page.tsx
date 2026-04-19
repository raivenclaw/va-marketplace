import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase-server";
import type { Profile, Category } from "@/lib/supabase-server";
import { Star, MapPin, Clock } from "lucide-react";

interface BrowsePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getFreelancers(filters: {
  category?: string;
  search?: string;
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
}): Promise<(Profile & { services?: { category?: Category }[] })[]> {
  const supabase = createServerSupabase();

  let query = supabase
    .from("marketplace_profiles")
    .select("*")
    .in("role", ["freelancer", "both"]);

  if (filters.minPrice) {
    query = query.gte("hourly_rate", parseFloat(filters.minPrice));
  }
  if (filters.maxPrice) {
    query = query.lte("hourly_rate", parseFloat(filters.maxPrice));
  }

  if (filters.sort === "price_asc") {
    query = query.order("hourly_rate", { ascending: true, nullsFirst: false });
  } else if (filters.sort === "price_desc") {
    query = query.order("hourly_rate", { ascending: false });
  } else if (filters.sort === "newest") {
    query = query.order("created_at", { ascending: false });
  } else {
    query = query.order("rating_avg", { ascending: false });
  }

  query = query.limit(24);
  const { data } = await query;

  if (filters.search && data) {
    const term = filters.search.toLowerCase();
    return data.filter(
      (p) =>
        p.full_name?.toLowerCase().includes(term) ||
        p.bio?.toLowerCase().includes(term) ||
        p.headline?.toLowerCase().includes(term)
    );
  }

  return (data as Profile[]) || [];
}

async function getCategories(): Promise<Category[]> {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from("marketplace_categories")
    .select("*")
    .order("name");
  return (data as Category[]) || [];
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const params = await searchParams;
  const category = typeof params.category === "string" ? params.category : undefined;
  const search = typeof params.search === "string" ? params.search : undefined;
  const sort = typeof params.sort === "string" ? params.sort : undefined;
  const minPrice = typeof params.minPrice === "string" ? params.minPrice : undefined;
  const maxPrice = typeof params.maxPrice === "string" ? params.maxPrice : undefined;

  const [freelancers, categories] = await Promise.all([
    getFreelancers({ category, search, sort, minPrice, maxPrice }),
    getCategories(),
  ]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {category
              ? categories.find((c) => c.slug === category)?.name || "Virtuele Assistenten"
              : "Alle Virtuele Assistenten"}
          </h1>
          <p className="text-gray-600 mt-2">
            {freelancers.length} {freelancers.length === 1 ? "resultaat" : "resultaten"} gevonden
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>

              {/* Search */}
              <form className="mb-6">
                <input
                  type="text"
                  name="search"
                  defaultValue={search}
                  placeholder="Zoek op naam of skill..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
                {category && <input type="hidden" name="category" value={category} />}
                {sort && <input type="hidden" name="sort" value={sort} />}
                <button
                  type="submit"
                  className="w-full mt-2 bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Zoeken
                </button>
              </form>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Categorie</h4>
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  <Link
                    href="/browse"
                    className={`block px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      !category ? "bg-indigo-50 text-indigo-700 font-medium" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Alle categorieën
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/browse?category=${cat.slug}${sort ? `&sort=${sort}` : ""}`}
                      className={`block px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        category === cat.slug
                          ? "bg-indigo-50 text-indigo-700 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Sorteren</h4>
                <div className="space-y-1">
                  {[
                    { value: "rating", label: "Beste beoordeeld" },
                    { value: "price_asc", label: "Laagste prijs" },
                    { value: "price_desc", label: "Hoogste prijs" },
                    { value: "newest", label: "Nieuwste" },
                  ].map((s) => (
                    <Link
                      key={s.value}
                      href={`/browse?sort=${s.value}${category ? `&category=${category}` : ""}${search ? `&search=${search}` : ""}`}
                      className={`block px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        sort === s.value || (!sort && s.value === "rating")
                          ? "bg-indigo-50 text-indigo-700 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            {freelancers.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <p className="text-gray-500 text-lg">
                  Geen virtuele assistenten gevonden
                </p>
                <p className="text-gray-400 mt-2">
                  Probeer andere zoekcriteria of{" "}
                  <Link href="/browse" className="text-indigo-600 hover:underline">
                    bekijk alle VAs
                  </Link>
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {freelancers.map((f) => (
                  <Link
                    key={f.id}
                    href={`/profile/${f.id}`}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
                  >
                    <div className="h-16 bg-gradient-to-r from-indigo-500 to-purple-600" />
                    <div className="p-5 -mt-6">
                      <div className="w-12 h-12 bg-indigo-200 rounded-full border-3 border-white flex items-center justify-center mb-3">
                        {f.avatar_url ? (
                          <img
                            src={f.avatar_url}
                            alt={f.full_name || ""}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-indigo-600 font-bold">
                            {(f.full_name || "?").charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {f.full_name || "Anoniem"}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                        {f.headline || "Virtuele assistent"}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {f.location && (
                          <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            <MapPin className="w-3 h-3" />
                            {f.location}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          <Clock className="w-3 h-3" />
                          {f.availability === "available"
                            ? "Beschikbaar"
                            : f.availability === "busy"
                            ? "Beperkt beschikbaar"
                            : "Niet beschikbaar"}
                        </span>
                      </div>

                      {f.languages && f.languages.length > 0 && (
                        <div className="mt-2">
                          <span className="text-xs text-gray-400">
                            {f.languages.join(", ")}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <span className="text-sm font-medium text-gray-900">
                            {f.rating_avg > 0 ? Number(f.rating_avg).toFixed(1) : "Nieuw"}
                          </span>
                          {f.rating_count > 0 && (
                            <span className="text-xs text-gray-400">({f.rating_count})</span>
                          )}
                        </div>
                        {f.hourly_rate && (
                          <span className="text-sm font-semibold text-indigo-600">
                            {"\u20AC"}{Number(f.hourly_rate).toFixed(0)}/uur
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
