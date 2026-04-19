"use client";

import Link from "next/link";
import { useState } from "react";
import { signUp } from "@/lib/actions";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SignUpForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get("role") || "client";

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    const result = await signUp(formData);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/onboarding");
      router.refresh();
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account aanmaken</h1>
          <p className="text-gray-600 mt-2">
            Begin als opdrachtgever of virtuele assistent
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          {/* Google OAuth placeholder */}
          <button
            disabled
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors mb-6 opacity-50 cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Aanmelden met Google (binnenkort)
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">of met e-mail</span>
            </div>
          </div>

          <form action={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Volledige naam
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                  placeholder="Je volledige naam"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-mailadres
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                  placeholder="je@email.nl"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Wachtwoord
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                  placeholder="Minimaal 6 tekens"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ik ben een
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="relative">
                    <input
                      type="radio"
                      name="role"
                      value="client"
                      defaultChecked={defaultRole === "client"}
                      className="peer sr-only"
                    />
                    <div className="border-2 border-gray-200 rounded-lg p-4 text-center cursor-pointer peer-checked:border-indigo-600 peer-checked:bg-indigo-50 transition-all">
                      <div className="text-2xl mb-1">🏢</div>
                      <div className="font-medium text-sm text-gray-900">Opdrachtgever</div>
                      <div className="text-xs text-gray-500">Ik zoek een VA</div>
                    </div>
                  </label>
                  <label className="relative">
                    <input
                      type="radio"
                      name="role"
                      value="freelancer"
                      defaultChecked={defaultRole === "freelancer"}
                      className="peer sr-only"
                    />
                    <div className="border-2 border-gray-200 rounded-lg p-4 text-center cursor-pointer peer-checked:border-indigo-600 peer-checked:bg-indigo-50 transition-all">
                      <div className="text-2xl mb-1">💼</div>
                      <div className="font-medium text-sm text-gray-900">Virtuele Assistent</div>
                      <div className="text-xs text-gray-500">Ik bied diensten aan</div>
                    </div>
                  </label>
                </div>
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
              {loading ? "Account aanmaken..." : "Account aanmaken"}
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-4 text-center">
            Door je aan te melden ga je akkoord met onze algemene voorwaarden en
            privacybeleid.
          </p>
        </div>

        <p className="text-center mt-6 text-sm text-gray-600">
          Al een account?{" "}
          <Link href="/login" className="text-indigo-600 font-medium hover:text-indigo-700">
            Inloggen
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center">Laden...</div>}>
      <SignUpForm />
    </Suspense>
  );
}
