import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">VA</span>
              </div>
              <span className="font-bold text-lg text-white">Marketplace</span>
            </div>
            <p className="text-sm text-gray-400">
              Het platform voor Nederlandse virtuele assistenten. Betrouwbaar,
              betaalbaar, direct beschikbaar.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Voor Opdrachtgevers</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/browse" className="hover:text-white transition-colors">
                  Zoek een VA
                </Link>
              </li>
              <li>
                <Link href="/browse" className="hover:text-white transition-colors">
                  Categorieën
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-white transition-colors">
                  Account aanmaken
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Voor Freelancers</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/signup" className="hover:text-white transition-colors">
                  Word VA op ons platform
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Over ons
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Privacybeleid
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Algemene voorwaarden
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-gray-500 text-center">
          &copy; {new Date().getFullYear()} VA Marketplace. Alle rechten
          voorbehouden.
        </div>
      </div>
    </footer>
  );
}
