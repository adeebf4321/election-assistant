/**
 * Footer component.
 *
 * Renders the site-wide footer with a disclaimer that the
 * application is not officially affiliated with the Election
 * Commission of India, and provides a direct link to eci.gov.in.
 */
export default function Footer() {
  return (
    <footer
      className="border-t border-white/10 bg-[#0A192F] py-8 mt-auto"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
        <p className="mb-2">
          An independent guide to the Indian Electoral Process.
        </p>
        <p className="text-sm">
          Not affiliated with the Election Commission of India. Always verify
          official dates and requirements at{" "}
          <a
            href="https://eci.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#FF9933] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9933] rounded"
            aria-label="Visit the official Election Commission of India website"
          >
            eci.gov.in
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
