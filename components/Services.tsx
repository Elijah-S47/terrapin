const services = [
  {
    number: "01",
    name: "Personalized massage",
    description:
      "A one-on-one session shaped around what your body needs that day, with space to slow down and reset.",
  },
  {
    number: "02",
    name: "Barefoot bodywork",
    description:
      "Ashiatsu-inspired bodywork uses broad, steady pressure to help ease tension and encourage deep relaxation.",
  },
];

export default function Services() {
  return (
    <section
      id="explore"
      aria-labelledby="services-heading"
      className="bg-[#f2eee5] px-6 py-24 text-[#17201d] sm:px-10 sm:py-32 lg:px-16"
    >
      <div className="mx-auto max-w-[1280px]">
        <p className="text-xs font-semibold uppercase tracking-[.22em] text-[#777a65]">
          Find your reset
        </p>
        <div className="mt-5 grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
          <h2
            id="services-heading"
            className="max-w-[520px] font-serif text-5xl leading-[.98] tracking-[-.04em] sm:text-7xl"
          >
            Care that meets you where you are.
          </h2>
          <p className="max-w-[570px] self-end text-base leading-8 text-[#4c5148] sm:text-lg">
            No two days feel quite the same. Start with what you need, and
            explore a session designed to help you feel more at ease in your
            body.
          </p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl bg-[#d7d4c8] md:grid-cols-2">
          {services.map((service) => (
            <article key={service.number} className="bg-[#f8f5ee] p-7 sm:p-10">
              <h3 className="mt-8 font-serif text-3xl sm:text-4xl">
                {service.name}
              </h3>
              <p className="mt-4 max-w-md leading-7 text-[#55594f]">
                {service.description}
              </p>
              <a
                href="#pricing"
                className="mt-8 inline-flex min-h-11 items-center border-b border-[#747a62] text-sm font-semibold text-[#343c31] transition-colors hover:text-[#8b4e56]"
              >
                Explore session details
                <span aria-hidden="true" className="ml-3">
                  &rarr;
                </span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
