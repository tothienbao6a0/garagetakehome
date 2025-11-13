import Image from "next/image";
import { Search } from "lucide-react";

const NAV_LINKS = [
  { label: "Auctions", href: "#" },
  { label: "Appraisal", href: "#" },
  { label: "Sell", href: "#" },
  { label: "Log in", href: "#" },
] as const;

export function Navbar() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo on left */}
          <div className="flex items-center">
            <Image 
              src="/garage-logo.svg" 
              alt="Garage" 
              width={120} 
              height={20} 
              className="h-6 w-auto"
              priority
            />
          </div>
          
          {/* Nav links + Search on right */}
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
              {NAV_LINKS.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="text-base font-medium text-black hover:text-gray-600 transition-colors"
                >
                  {label}
                </a>
              ))}
            </nav>
            
            <SearchInput />
          </div>
        </div>
      </div>
    </header>
  );
}

function SearchInput() {
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Note: Search functionality would redirect to Garage website
    // This is a UI mockup matching Garage's design
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search");
    if (query) {
      window.open(`https://www.withgarage.com/search?q=${encodeURIComponent(query.toString())}`, "_blank");
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <input
        type="text"
        name="search"
        placeholder="Browse listings"
        className="w-60 pl-4 pr-12 py-2 text-base text-gray-600 bg-white border border-gray-300 rounded-full placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300 transition-colors"
        aria-label="Search listings"
      />
      <button 
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Search"
      >
        <Search className="w-5 h-5 text-gray-600" />
      </button>
    </form>
  );
}

