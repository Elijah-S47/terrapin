import ArrowUpRight from "@/components/ArrowUpRight";

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
            Terrapin Massage in Casper, Wyoming.
          </h2>
          <div className="mt-5 max-w-[600px] space-y-2 leading-7 text-[#4c5148]">
            <p>
              Visit Terrapin Massage inside Lifetime Fitness. You do not need
              a gym membership to book a session.
            </p>
            <a
              href="https://maps.google.com/?q=300+Landmark+Dr,+Casper,+WY+82609"
              target="_blank"
              rel="noreferrer"
              className="inline-flex underline decoration-[#9b9d88] underline-offset-4 transition-colors hover:text-[#17201d]"
            >
              300 Landmark Dr
              <br />
              Casper, WY 82609
            </a>
          </div>
        </div>
        <a
          href="#book"
          className="group inline-flex min-h-14 items-center justify-between gap-8 rounded-full border border-[#394438] px-7 text-xs font-semibold tracking-[.14em] text-[#253126] transition-colors hover:bg-[#e7e5d9]"
        >
          APPOINTMENT DETAILS
          <ArrowUpRight />
        </a>
      </div>
    </section>
  );
}
