"use client";
import { ShoppingCart, User, UtensilsCrossed } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';   // ✅ add this import

export default function NavBar() {
  const router = useRouter();

  return (
    <header className="bg-accent-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[var(--accent-blue)] rounded-lg flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Buybites logo"
                width={50}
                height={50}
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold text-white">Buybites</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="/login" className="text-accent-gray hover:text-accent-orange transition-colors">
              Home
            </a>
            <a href="#" className="text-accent-gray hover:text-accent-orange transition-colors">
              Restaurants
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button 
              onClick={()=> router.push('/login')}
              className="flex items-center gap-2 bg-accent-orange hover:bg-hover-orange text-white px-5 py-2 rounded-lg transition-colors"
            >
              <User className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}