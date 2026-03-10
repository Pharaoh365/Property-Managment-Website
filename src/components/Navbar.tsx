import { Link, useLocation } from 'react-router-dom';
import { Home, User, Settings, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/src/lib/utils';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Vacancies', href: '/vacancies' },
    { name: 'Military Relocation', href: '/military' },
    { name: 'About', href: '/about' },
  ];

  const portalLinks = [
    { name: 'Tenant Portal', href: '/tenant', color: 'bg-brand-primary text-white' },
    { name: 'Owner Portal', href: '/owner', color: 'bg-white text-brand-ink border border-brand-primary/20' },
    { name: 'Staff', href: '/pm', color: 'bg-brand-ink text-white' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-brand-primary rounded-lg flex items-center justify-center">
                <Home className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-serif font-bold tracking-tight">MKDDY PM</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-brand-primary",
                  location.pathname === link.href ? "text-brand-primary" : "text-gray-600"
                )}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex items-center space-x-3">
              {portalLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    "px-4 py-2 rounded-full text-xs font-semibold transition-all hover:scale-105",
                    link.color
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-brand-primary focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-6 space-y-1 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-4 text-base font-medium text-gray-600 hover:text-brand-primary hover:bg-gray-50 rounded-lg"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 space-y-3">
            {portalLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block w-full text-center px-4 py-3 rounded-xl text-sm font-semibold",
                  link.color
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
