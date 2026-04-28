/**
 * PollingMap component.
 *
 * Renders an embedded Google Maps iframe centered on India,
 * allowing users to visually explore and search for their
 * nearest Electoral Registration Office or polling booth.
 * Provides direct links to official ECI resources.
 */
"use client";

import { MapPin, ExternalLink } from "lucide-react";

export default function PollingMap() {
  const googleMapsEmbedUrl = `https://www.google.com/maps/embed/v1/search?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || ""}&q=Election+Commission+Office+India&zoom=5&center=20.5937,78.9629`;

  return (
    <section
      id="polling-map"
      className="py-20 bg-[#112240]"
      aria-labelledby="polling-map-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            id="polling-map-heading"
            className="text-3xl md:text-4xl font-bold mb-4 heading-gradient"
          >
            Find Election Offices Near You
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Use Google Maps to explore Election Commission offices and polling
            areas across India.
          </p>
        </div>

        <div className="glass-panel rounded-2xl overflow-hidden border border-white/20">
          {/* Map Header */}
          <div className="bg-[#0A192F] p-4 border-b border-white/10 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#FF9933]/20 p-2 rounded-full" aria-hidden="true">
                <MapPin className="h-6 w-6 text-[#FF9933]" />
              </div>
              <div>
                <h3 className="text-white font-bold">Polling Station Locator</h3>
                <p className="text-xs text-gray-400">
                  Powered by Google Maps
                </p>
              </div>
            </div>
            <a
              href="https://electoralsearch.eci.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#138808] hover:bg-[#138808]/80 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              aria-label="Search your name on the official Electoral Roll website"
            >
              Search Electoral Roll
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          {/* Google Maps Embed */}
          <div className="relative w-full h-[400px] md:h-[500px]">
            <iframe
              title="Google Maps showing Election Commission offices across India"
              src={googleMapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>

          {/* Helpful Links */}
          <div className="bg-[#0A192F] p-4 border-t border-white/10">
            <p className="text-gray-400 text-sm text-center">
              For your exact polling booth, visit the{" "}
              <a
                href="https://electoralsearch.eci.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FF9933] hover:underline font-medium"
              >
                Electoral Search Portal
              </a>{" "}
              or download the{" "}
              <a
                href="https://play.google.com/store/apps/details?id=com.eci.citizen"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FF9933] hover:underline font-medium"
              >
                Voter Helpline App
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
