"use client";

import Link from "next/link";
import { Vote, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="glass-panel sticky top-0 z-50 w-full border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Vote className="h-8 w-8 text-[#FF9933]" />
            <Link href="/" className="font-bold text-xl tracking-tight text-white flex items-center">
              India<span className="text-[#138808]">Votes</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="#timeline" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Election Timeline
              </Link>
              <Link href="#guide" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Voter Guide
              </Link>
              <Link href="#assistant" className="bg-[#138808]/20 text-[#138808] border border-[#138808]/50 hover:bg-[#138808] hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-all">
                Ask Assistant
              </Link>
            </div>
          </div>
          
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden glass-panel border-t border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="#timeline" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              Election Timeline
            </Link>
            <Link href="#guide" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              Voter Guide
            </Link>
            <Link href="#assistant" className="text-[#138808] hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              Ask Assistant
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
