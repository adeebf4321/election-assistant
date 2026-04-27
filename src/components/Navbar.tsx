/**
 * Navbar component.
 *
 * Provides the primary navigation for the application.
 * Features a sticky, glassmorphism-styled header with links
 * to all major sections. Includes a responsive hamburger
 * menu for mobile viewports with full ARIA support for
 * screen readers and keyboard navigation.
 */
"use client";

import Link from "next/link";
import { Vote, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      className="glass-panel sticky top-0 z-50 w-full border-b border-white/10"
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
            <div className="ml-10 flex items-baseline space-x-8">
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
          className="md:hidden glass-panel border-t border-white/10"
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
          </div>
        </div>
      )}
    </nav>
  );
}
