const steps = [
  {
    number: "01",
    title: "We start by listening",
    description:
      "Share what has been feeling tight, what you hope to get from your visit, and anything that helps you feel comfortable.",
  },
  {
    number: "02",
    title: "Your session is personal",
    description:
      "The approach is tailored to your needs, with communication throughout so you can speak up about pressure or comfort.",
  },
  {
    number: "03",
    title: "During your session",
    description:
      "Appointments follow their scheduled length. Let Crystal know during your session if anything needs adjusting.",
  },
];

export default function WhatToExpect() {
  return (
    <section
      id="what-to-expect"
      aria-labelledby="expect-heading"
      className="bg-[#253126] px-6 py-24 text-[#f7f0e4] sm:px-10 sm:py-32 lg:px-16"
    >
      <div className="mx-auto max-w-[1280px]">
        <p className="text-xs font-semibold uppercase tracking-[.22em] text-[#d9b4a7]">
          A little less unknown
        </p>
        <h2
          id="expect-heading"
          className="mt-5 max-w-[700px] font-serif text-5xl leading-[.98] tracking-[-.04em] sm:text-7xl"
        >
          You can settle in at your own pace.
        </h2>
        <div className="mt-14 grid gap-10 border-t border-[#f7f0e4]/20 pt-8 md:grid-cols-3 md:gap-12">
          {steps.map((step) => (
            <article key={step.number}>
              <p className="text-xs tracking-[.2em] text-[#d9b4a7]">
                {step.number}
              </p>
              <h3 className="mt-5 font-serif text-3xl">{step.title}</h3>
              <p className="mt-4 leading-7 text-[#f7f0e4]/75">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
