export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0A192F] py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
        <p className="mb-2">
          An independent guide to the Indian Electoral Process.
        </p>
        <p className="text-sm">
          Not affiliated with the Election Commission of India. Always verify official dates and requirements at <a href="https://eci.gov.in" target="_blank" rel="noopener noreferrer" className="text-[#FF9933] hover:underline">eci.gov.in</a>.
        </p>
      </div>
    </footer>
  );
}
