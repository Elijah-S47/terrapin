export default function SiteFooter() {
  return (
    <footer className="bg-[#172119] px-6 py-10 text-[#f7f0e4] sm:px-10 lg:px-16">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <a
            href="#top"
            className="font-serif text-3xl tracking-[.04em] transition-colors hover:text-[#e2a1a6]"
          >
            TERRAPIN
          </a>
          <p className="mt-2 text-sm text-[#f7f0e4]/65">
            Massage · Casper, Wyoming
          </p>
        </div>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#f7f0e4]/80">
          <a href="#explore" className="transition-colors hover:text-white">
            Services
          </a>
          <a href="#about" className="transition-colors hover:text-white">
            About
          </a>
          <a href="#location" className="transition-colors hover:text-white">
            Location
          </a>
          <a
            href="#book"
            className="transition-colors hover:text-white"
          >
            Book
          </a>
        </nav>
      </div>
      <div className="mx-auto mt-8 max-w-[1280px] border-t border-[#f7f0e4]/15 pt-5 text-xs text-[#f7f0e4]/50">
        At Nature&apos;s Pace.
      </div>
    </footer>
  );
}
