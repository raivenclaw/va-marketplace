import Link from "next/link";
import { getCurrentUser } from "@/lib/actions";
import { UserMenu } from "./user-menu";

export async function Navbar() {
  const user = await getCurrentUser();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">VA</span>
              </div>
              <span className="font-bold text-xl text-gray-900">
                Marketplace
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/browse"
                className="text-gray-600 hover:text-indigo-600 text-sm font-medium transition-colors"
              >
                Zoek een VA
              </Link>
              <Link
                href="/browse"
                className="text-gray-600 hover:text-indigo-600 text-sm font-medium transition-colors"
              >
                Categorieën
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <UserMenu userName={user.full_name || "Gebruiker"} userRole={user.role} />
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-indigo-600 text-sm font-medium transition-colors"
                >
                  Inloggen
                </Link>
                <Link
                  href="/signup"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Aanmelden
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
