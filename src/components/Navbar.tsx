/**
 * Navbar component.
 *
 * Provides the primary navigation for the application.
 * Features a sticky, glassmorphism-styled header with links
 * to all major sections. Includes a responsive hamburger
 * menu for mobile viewports with full ARIA support for
 * screen readers and keyboard navigation.
 * Integrates Firebase Authentication for Google Sign-In.
 */
"use client";

import Link from "next/link";
import { Vote, Menu, X, LogIn, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  return (
    <nav
      className="bg-[#0A192F] sticky top-0 z-50 w-full border-b border-white/10"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Vote className="h-8 w-8 text-[#FF9933]" aria-hidden="true" />
            <Link
              href="/"
              className="font-bold text-xl tracking-tight text-white flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9933] rounded"
              aria-label="IndiaVotes - Home"
            >
              India<span className="text-[#138808]">Votes</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block" role="navigation" aria-label="Desktop menu">
            <div className="ml-10 flex items-center space-x-8">
              <Link
                href="#timeline"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9933]"
              >
                Election Timeline
              </Link>
              <Link
                href="#guide"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9933]"
              >
                Voter Guide
              </Link>
              <Link
                href="#polling-map"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9933]"
              >
                Find Booth
              </Link>
              <Link
                href="#assistant"
                className="bg-[#138808]/20 text-[#138808] border border-[#138808]/50 hover:bg-[#138808] hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#138808]"
              >
                Ask Assistant
              </Link>

              {/* Auth Button */}
              {!loading && (
                <>
                  {user ? (
                    <div className="flex items-center gap-3">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.displayName || "User avatar"}
                          className="w-8 h-8 rounded-full border-2 border-[#FF9933]"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div
                          className="w-8 h-8 rounded-full bg-[#FF9933] flex items-center justify-center text-white text-sm font-bold"
                          aria-hidden="true"
                        >
                          {(user.displayName || "U")[0].toUpperCase()}
                        </div>
                      )}
                      <button
                        onClick={signOut}
                        className="flex items-center gap-1 text-gray-300 hover:text-white text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9933] rounded px-2 py-1"
                        aria-label="Sign out"
                      >
                        <LogOut className="h-4 w-4" aria-hidden="true" />
                        <span className="hidden lg:inline">Sign Out</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={signInWithGoogle}
                      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9933]"
                      aria-label="Sign in with Google"
                    >
                      <LogIn className="h-4 w-4" aria-hidden="true" />
                      Sign In
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9933]"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-[#0A192F] border-t border-white/10"
          role="navigation"
          aria-label="Mobile menu"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="#timeline"
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9933]"
              onClick={() => setIsOpen(false)}
            >
              Election Timeline
            </Link>
            <Link
              href="#guide"
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9933]"
              onClick={() => setIsOpen(false)}
            >
              Voter Guide
            </Link>
            <Link
              href="#polling-map"
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9933]"
              onClick={() => setIsOpen(false)}
            >
              Find Booth
            </Link>
            <Link
              href="#assistant"
              className="text-[#138808] hover:text-white block px-3 py-2 rounded-md text-base font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#138808]"
              onClick={() => setIsOpen(false)}
            >
              Ask Assistant
            </Link>

            {/* Mobile Auth */}
            {!loading && (
              <div className="border-t border-white/10 pt-3 mt-3">
                {user ? (
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center gap-2">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.displayName || "User avatar"}
                          className="w-7 h-7 rounded-full border border-[#FF9933]"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div
                          className="w-7 h-7 rounded-full bg-[#FF9933] flex items-center justify-center text-white text-xs font-bold"
                          aria-hidden="true"
                        >
                          {(user.displayName || "U")[0].toUpperCase()}
                        </div>
                      )}
                      <span className="text-gray-300 text-sm truncate max-w-[120px]">
                        {user.displayName || "User"}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        signOut();
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-1 text-gray-400 hover:text-white text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9933] rounded px-2 py-1"
                      aria-label="Sign out"
                    >
                      <LogOut className="h-4 w-4" aria-hidden="true" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      signInWithGoogle();
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-2 text-gray-300 hover:text-white w-full px-3 py-2 rounded-md text-base font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9933]"
                    aria-label="Sign in with Google"
                  >
                    <LogIn className="h-5 w-5" aria-hidden="true" />
                    Sign In with Google
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
