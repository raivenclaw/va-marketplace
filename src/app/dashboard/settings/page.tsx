"use client";

import { useState, useEffect } from "react";
import { getCurrentUser, updateProfile } from "@/lib/actions";
import { useRouter } from "next/navigation";

interface UserProfile {
  full_name: string | null;
  bio: string | null;
  headline: string | null;
  role: string;
  hourly_rate: number | null;
  location: string | null;
  languages: string[] | null;
  availability: string;
}

export default function SettingsPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const data = await getCurrentUser();
      if (!data) {
        router.push("/login");
        return;
      }
      setUser(data);
      setLoading(false);
    }
    load();
  }, [router]);

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    setMessage("");
    const result = await updateProfile(formData);
    if (result.error) {
      setMessage("Fout: " + result.error);
    } else {
      setMessage("Profiel opgeslagen!");
      router.refresh();
    }
    setSaving(false);
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Laden...</p>
      </div>
    );
  }

  const isFreelancer = user.role === "freelancer" || user.role === "both";

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Instellingen</h1>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Profiel bewerken</h2>

          <form action={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Volledige naam
                </label>
                <input
                  type="text"
                  name="full_name"
                  defaultValue={user.full_name || ""}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  name="bio"
                  rows={4}
                  defaultValue={user.bio || ""}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>

              {isFreelancer && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Headline
                    </label>
                    <input
                      type="text"
                      name="headline"
                      defaultValue={user.headline || ""}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      placeholder="b.v. Ervaren VA | Admin & Boekhouding"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Uurtarief (EUR)
                    </label>
                    <input
                      type="number"
                      name="hourly_rate"
                      step="0.01"
                      min="0"
                      defaultValue={user.hourly_rate || ""}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Locatie</label>
                <input
                  type="text"
                  name="location"
                  defaultValue={user.location || ""}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Talen (komma-gescheiden)
                </label>
                <input
                  type="text"
                  name="languages"
                  defaultValue={user.languages?.join(", ") || ""}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Beschikbaarheid
                </label>
                <select
                  name="availability"
                  defaultValue={user.availability}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                >
                  <option value="available">Beschikbaar</option>
                  <option value="busy">Beperkt beschikbaar</option>
                  <option value="unavailable">Niet beschikbaar</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                <select
                  name="role"
                  defaultValue={user.role}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                >
                  <option value="client">Opdrachtgever</option>
                  <option value="freelancer">Virtuele Assistent</option>
                  <option value="both">Beide</option>
                </select>
              </div>
            </div>

            {message && (
              <div
                className={`mt-4 p-3 rounded-lg text-sm ${
                  message.startsWith("Fout")
                    ? "bg-red-50 border border-red-200 text-red-700"
                    : "bg-green-50 border border-green-200 text-green-700"
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {saving ? "Opslaan..." : "Opslaan"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
