import Image from "next/image";

export default function Testimonials() {
  return (
    <section
      id="client-words"
      aria-labelledby="testimonials-heading"
      className="bg-[#e7e5d9] px-6 py-24 text-[#17201d] sm:px-10 sm:py-32 lg:px-16"
    >
      <div className="mx-auto grid max-w-[1000px] items-center gap-10 md:grid-cols-[.8fr_1.2fr] md:gap-16">
        <div className="mx-auto w-full max-w-[360px]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[48%_48%_12px_12px] bg-[#d7d4c8]">
            <Image
              src="/images/crystal-still.jpg"
              alt="Crystal Still, owner and massage therapist at Terrapin Massage"
              fill
              sizes="(max-width: 768px) 90vw, 360px"
              className="object-cover object-center"
            />
          </div>
          <p className="mt-4 text-center text-xs font-semibold uppercase tracking-[.18em] text-[#777a65]">
            Crystal Still · Owner &amp; Massage Therapist
          </p>
        </div>
        <div className="text-center md:text-left">
          <p className="text-xs font-semibold uppercase tracking-[.22em] text-[#777a65]">
            A note from the studio
          </p>
          <h2
            id="testimonials-heading"
            className="mt-5 font-serif text-5xl leading-none tracking-[-.04em] sm:text-7xl"
          >
            Your experience matters.
          </h2>
          <p className="mx-auto mt-7 max-w-[640px] text-base leading-8 text-[#4c5148] sm:text-lg md:mx-0">
            Client stories will be shared here as Terrapin gathers feedback
            with permission. In the meantime, reach out or book a session to
            see if this approach feels right for you.
          </p>
        </div>
      </div>
    </section>
  );
}
