import ArrowUpRight from "@/components/ArrowUpRight";

export default function Pricing() {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="relative z-10 overflow-hidden bg-transparent px-6 py-20 text-[#f7f0e4] sm:px-10 sm:py-28 lg:px-16"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,22,15,.72)_0%,rgba(12,22,15,.56)_58%,rgba(12,22,15,.3)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,16,11,.16)_0%,rgba(8,15,10,.48)_100%)]"
      />
      <div className="relative z-10 mx-auto grid w-full max-w-[1280px] gap-8 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.22em] text-[#e2a1a6]">
            Your time, your care
          </p>
          <h2
            id="pricing-heading"
            className="mt-5 max-w-[650px] font-serif text-5xl leading-none tracking-[-.04em] text-[#f7f0e4] sm:text-7xl"
          >
            Choose the session that feels right.
          </h2>
          <p className="mt-6 max-w-[600px] text-base leading-8 text-[#f7f0e4]/90">
            Session options, lengths, and current pricing are listed in the
            online booking portal.
          </p>
        </div>
        <a
          href="#book"
          className="group inline-flex min-h-14 items-center justify-between gap-8 rounded-full bg-[#e2a1a6] px-7 text-xs font-semibold tracking-[.14em] text-[#242a23] transition-colors hover:bg-[#f0b8bc]"
        >
          VIEW SESSIONS & PRICING
          <ArrowUpRight />
        </a>
      </div>
    </section>
  );
}
