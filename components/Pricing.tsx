export default function Pricing() {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="bg-[#e7e5d9] px-6 py-20 text-[#17201d] sm:px-10 sm:py-28 lg:px-16"
    >
      <div className="mx-auto grid max-w-[1280px] gap-8 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.22em] text-[#777a65]">
            Your time, your care
          </p>
          <h2
            id="pricing-heading"
            className="mt-5 max-w-[650px] font-serif text-5xl leading-none tracking-[-.04em] sm:text-7xl"
          >
            Choose the session that feels right.
          </h2>
          <p className="mt-6 max-w-[600px] text-base leading-8 text-[#4c5148]">
            Session options, lengths, and current pricing are listed in the
            online booking portal.
          </p>
        </div>
        <a
          href="#book"
          className="inline-flex min-h-14 items-center justify-between gap-8 rounded-full bg-[#394438] px-7 text-xs font-semibold tracking-[.14em] text-[#f7f0e4] transition-colors hover:bg-[#59644d]"
        >
          VIEW SESSIONS & PRICING
          <span aria-hidden="true" className="text-lg">
            &nearr;
          </span>
        </a>
      </div>
    </section>
  );
}
