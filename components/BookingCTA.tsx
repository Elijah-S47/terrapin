import AppointmentBookingForm from "@/components/AppointmentBookingForm";

export default function BookingCTA() {
  return (
    <section
      id="book"
      aria-labelledby="booking-heading"
      className="relative overflow-hidden bg-transparent px-6 py-20 text-[#f7f0e4] sm:px-10 sm:py-28 lg:px-16"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,22,15,.55)_0%,rgba(12,22,15,.7)_100%)]"
      />
      <div className="relative z-10 mx-auto flex max-w-[1280px] flex-col gap-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.22em] text-[#f0b8bc]">
            Your next step
          </p>
          <h2
            id="booking-heading"
            className="mt-5 max-w-[760px] font-serif text-5xl font-light leading-[.98] tracking-[-.04em] text-[#f7f0e4] sm:text-7xl"
          >
            Make a little space for yourself.
          </h2>
        </div>
        <AppointmentBookingForm />
      </div>
    </section>
  );
}
