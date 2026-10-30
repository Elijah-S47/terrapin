export default function Location() {
  return (
    <section
      id="location"
      aria-labelledby="location-heading"
      className="bg-[#f8f5ee] px-6 py-20 text-[#17201d] sm:px-10 sm:py-28 lg:px-16"
    >
      <div className="mx-auto grid max-w-[1280px] gap-8 border-y border-[#c9c8bb] py-10 md:grid-cols-[1fr_auto] md:items-center md:py-14">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.22em] text-[#777a65]">
            Find your way here
          </p>
          <h2
            id="location-heading"
            className="mt-4 font-serif text-5xl leading-none tracking-[-.04em] sm:text-6xl"
          >
            Rooted in Casper, Wyoming.
          </h2>
          <p className="mt-5 max-w-[600px] leading-7 text-[#4c5148]">
            Check the booking page for available appointments and current
            location details.
          </p>
        </div>
        <a
          href="#book"
          className="inline-flex min-h-14 items-center justify-between gap-8 rounded-full border border-[#394438] px-7 text-xs font-semibold tracking-[.14em] text-[#253126] transition-colors hover:bg-[#e7e5d9]"
        >
          APPOINTMENT DETAILS
          <span aria-hidden="true" className="text-lg">
            &nearr;
          </span>
        </a>
      </div>
    </section>
  );
}
