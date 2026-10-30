import AppointmentBookingForm from "@/components/AppointmentBookingForm";

export default function BookingCTA() {
  return (
    <section
      id="book"
      aria-labelledby="booking-heading"
      className="bg-[#d9a1a1] px-6 py-20 text-[#20251f] sm:px-10 sm:py-28 lg:px-16"
    >
      <div className="mx-auto flex max-w-[1280px] flex-col gap-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.22em] text-[#4f5144]">
            Your next step
          </p>
          <h2
            id="booking-heading"
            className="mt-5 max-w-[760px] font-serif text-5xl leading-[.98] tracking-[-.04em] sm:text-7xl"
          >
            Make a little space for yourself.
          </h2>
        </div>
        <AppointmentBookingForm />
      </div>
    </section>
  );
}
