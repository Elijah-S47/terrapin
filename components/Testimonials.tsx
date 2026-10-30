export default function Testimonials() {
  return (
    <section
      id="client-words"
      aria-labelledby="testimonials-heading"
      className="bg-[#e7e5d9] px-6 py-24 text-[#17201d] sm:px-10 sm:py-32 lg:px-16"
    >
      <div className="mx-auto max-w-[1000px] text-center">
        <p className="text-xs font-semibold uppercase tracking-[.22em] text-[#777a65]">
          A note from the studio
        </p>
        <h2
          id="testimonials-heading"
          className="mt-5 font-serif text-5xl leading-none tracking-[-.04em] sm:text-7xl"
        >
          Your experience matters.
        </h2>
        <p className="mx-auto mt-7 max-w-[640px] text-base leading-8 text-[#4c5148] sm:text-lg">
          Client stories will be shared here as Terrapin gathers feedback with
          permission. In the meantime, reach out or book a session to see if
          this approach feels right for you.
        </p>
      </div>
    </section>
  );
}
