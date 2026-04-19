"use client";

import { useState, useEffect } from "react";
import { updateProfile, addService, getCurrentUser } from "@/lib/actions";
import { useRouter } from "next/navigation";

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState("client");
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const user = await getCurrentUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setRole(user.role || "client");

      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    }
    load();
  }, [router]);

  async function handleProfileSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    const result = await updateProfile(formData);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else if (role === "freelancer" || role === "both") {
      setStep(2);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  async function handleServiceSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    const result = await addService(formData);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="flex justify-center gap-2 mb-4">
            <div className={`w-3 h-3 rounded-full ${step >= 1 ? "bg-indigo-600" : "bg-gray-300"}`} />
            {(role === "freelancer" || role === "both") && (
              <div className={`w-3 h-3 rounded-full ${step >= 2 ? "bg-indigo-600" : "bg-gray-300"}`} />
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {step === 1 ? "Vertel ons over jezelf" : "Voeg je eerste dienst toe"}
          </h1>
          <p className="text-gray-600 mt-2">
            {step === 1 ? "Vul je profiel aan" : "Welke diensten bied je aan?"}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          {step === 1 ? (
            <form action={handleProfileSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    name="bio"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    placeholder="Vertel iets over jezelf..."
                  />
                </div>
                {(role === "freelancer" || role === "both") && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
                      <input
                        type="text"
                        name="headline"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        placeholder="b.v. Ervaren VA | Admin & Boekhouding"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Uurtarief (EUR)</label>
                      <input
                        type="number"
                        name="hourly_rate"
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        placeholder="25.00"
                      />
                    </div>
                  </>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Locatie</label>
                  <input
                    type="text"
                    name="location"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    placeholder="b.v. Amsterdam, Nederland"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Talen (komma-gescheiden)
                  </label>
                  <input
                    type="text"
                    name="languages"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    placeholder="Nederlands, Engels"
                    defaultValue="Nederlands"
                  />
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Opslaan..." : role === "client" ? "Voltooien" : "Volgende"}
              </button>
            </form>
          ) : (
            <form action={handleServiceSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categorie</label>
                  <select
                    name="category_id"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  >
                    <option value="">Kies een categorie</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titel</label>
                  <input
                    type="text"
                    name="title"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    placeholder="b.v. Administratieve ondersteuning"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Beschrijving</label>
                  <textarea
                    name="description"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    placeholder="Beschrijf je dienst..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prijs (EUR)</label>
                    <input
                      type="number"
                      name="price"
                      step="0.01"
                      min="0"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      placeholder="25.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prijstype</label>
                    <select
                      name="price_type"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    >
                      <option value="hourly">Per uur</option>
                      <option value="fixed">Vast bedrag</option>
                      <option value="daily">Per dag</option>
                    </select>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    router.push("/dashboard");
                    router.refresh();
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Overslaan
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {loading ? "Opslaan..." : "Voltooien"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
