"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

type Service = {
  id: string;
  version: number;
  name: string;
  durationMinutes: number;
  amount: number;
  currency: string;
};

type Slot = {
  startAt: string;
  teamMemberId: string;
  serviceVariationVersion: number;
  durationMinutes: number;
};

type SquareCard = {
  attach(selector: string): Promise<void>;
  tokenize(): Promise<{
    status: string;
    token?: string;
    errors?: Array<{ message?: string }>;
  }>;
  destroy(): Promise<void>;
};

type SquarePayments = {
  card(): Promise<SquareCard>;
};

type SquareSdk = {
  payments(applicationId: string, locationId: string): SquarePayments;
};

declare global {
  interface Window {
    Square?: SquareSdk;
  }
}

const APPLICATION_ID = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID;
const LOCATION_ID = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;
const SQUARE_SDK_URL = "https://web.squarecdn.com/v1/square.js";
const TIME_ZONE = "America/Denver";

let squareSdkPromise: Promise<void> | undefined;

function loadSquareSdk() {
  if (window.Square) return Promise.resolve();
  if (squareSdkPromise) return squareSdkPromise;

  squareSdkPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SQUARE_SDK_URL;
    script.async = true;
    script.onload = () => {
      if (window.Square) resolve();
      else reject(new Error("Square’s secure card form did not load."));
    };
    script.onerror = () =>
      reject(new Error("Could not load Square’s secure card form."));
    document.head.appendChild(script);
  }).catch((error: unknown) => {
    squareSdkPromise = undefined;
    throw error;
  });

  return squareSdkPromise;
}

function priceLabel(service: Service) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: service.currency,
  }).format(service.amount / 100);
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function localDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function errorMessage(data: unknown, fallback: string) {
  if (
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    typeof data.error === "string"
  ) {
    return data.error;
  }
  return fallback;
}

export default function AppointmentBookingForm() {
  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState(() => localDateString(new Date()));
  const [availabilityResult, setAvailabilityResult] = useState<{
    key: string;
    slots: Slot[];
    error?: string;
  } | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [loadingServices, setLoadingServices] = useState(true);
  const [error, setError] = useState("");
  const [sdkError, setSdkError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cardReady, setCardReady] = useState(false);
  const [confirmed, setConfirmed] = useState("");
  const [today] = useState(() => localDateString(new Date()));
  const cardElement = useRef<SquareCard | null>(null);

  const selectedService = services.find((service) => service.id === serviceId);
  const availabilityKey = `${serviceId}:${date}`;
  const currentAvailability =
    availabilityResult?.key === availabilityKey ? availabilityResult : null;
  const slots = currentAvailability?.slots ?? [];
  const loadingSlots = Boolean(serviceId && date && !currentAvailability);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/square/services", { signal: controller.signal })
      .then(async (response) => {
        const data = (await response.json()) as Service[] | { error?: string };
        if (!response.ok || !Array.isArray(data)) {
          throw new Error(errorMessage(data, "Could not load services."));
        }
        setServices(data);
        if (data[0]) setServiceId(data[0].id);
      })
      .catch((cause: unknown) => {
        if (!controller.signal.aborted) {
          setError(
            cause instanceof Error
              ? cause.message
              : "Could not load current services.",
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingServices(false);
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!serviceId || !date) return;

    const controller = new AbortController();

    fetch(
      `/api/square/availability?serviceVariationId=${encodeURIComponent(serviceId)}&date=${encodeURIComponent(date)}`,
      { signal: controller.signal },
    )
      .then(async (response) => {
        const data = (await response.json()) as Slot[] | { error?: string };
        if (!response.ok || !Array.isArray(data)) {
          throw new Error(errorMessage(data, "Could not load available times."));
        }
        setAvailabilityResult({ key: availabilityKey, slots: data });
      })
      .catch((cause: unknown) => {
        if (!controller.signal.aborted) {
          setAvailabilityResult({
            key: availabilityKey,
            slots: [],
            error:
              cause instanceof Error
                ? cause.message
                : "Could not load available times.",
          });
        }
      })

    return () => controller.abort();
  }, [serviceId, date, availabilityKey]);

  useEffect(() => {
    if (!selectedSlot || !APPLICATION_ID || !LOCATION_ID) return;
    const applicationId = APPLICATION_ID;
    const locationId = LOCATION_ID;
    let disposed = false;
    let attachedCard: SquareCard | undefined;

    async function setupCard() {
      try {
        setSdkError("");
        await loadSquareSdk();
        if (disposed || !window.Square) return;
        const payments = window.Square.payments(applicationId, locationId);
        attachedCard = await payments.card();
        if (disposed) {
          await attachedCard.destroy();
          return;
        }
        await attachedCard.attach("#square-card-container");
        cardElement.current = attachedCard;
        setCardReady(true);
      } catch (cause) {
        if (!disposed) {
          setSdkError(
            cause instanceof Error
              ? cause.message
              : "Could not prepare Square’s secure card form.",
          );
        }
      }
    }

    void setupCard();
    return () => {
      disposed = true;
      cardElement.current = null;
      setCardReady(false);
      if (attachedCard) void attachedCard.destroy();
    };
  }, [selectedSlot]);

  async function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedService || !selectedSlot || !cardElement.current) {
      setError(
        sdkError ||
          "Choose a service and time, then wait for the secure card form to load.",
      );
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const tokenized = await cardElement.current.tokenize();
      if (tokenized.status !== "OK" || !tokenized.token) {
        throw new Error(
          tokenized.errors?.map((item) => item.message).filter(Boolean).join(" ") ||
            "Please check your card details and try again.",
        );
      }

      const formData = new FormData(event.currentTarget);
      const response = await fetch("/api/square/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attemptId: crypto.randomUUID(),
          serviceVariationId: selectedService.id,
          date,
          startAt: selectedSlot.startAt,
          teamMemberId: selectedSlot.teamMemberId,
          sourceId: tokenized.token,
          firstName: formData.get("firstName"),
          lastName: formData.get("lastName"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          note: formData.get("note"),
          cancellationPolicyAccepted:
            formData.get("cancellationPolicyAccepted") === "on",
          cardOnFileAccepted: formData.get("cardOnFileAccepted") === "on",
          futureCardConsent: formData.get("futureCardConsent") === "on",
        }),
      });
      const result = (await response.json()) as
        | { bookingId: string; startAt: string }
        | { error?: string };
      if (!response.ok || !("bookingId" in result)) {
        throw new Error(
          errorMessage(result, "We couldn’t complete the booking."),
        );
      }
      setConfirmed(
        `Your ${selectedService.name} appointment is confirmed for ${new Intl.DateTimeFormat(
          "en-US",
          {
            dateStyle: "full",
            timeStyle: "short",
            timeZone: TIME_ZONE,
          },
        ).format(new Date(result.startAt))}.`,
      );
      setSelectedSlot(null);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "We couldn’t complete the booking. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full rounded-2xl bg-[#f8f5ee] p-5 text-[#17201d] shadow-[0_20px_70px_rgba(47,37,29,.12)] sm:p-8 lg:p-10">
      {confirmed ? (
        <div
          role="status"
          className="mx-auto max-w-2xl rounded-xl border border-[#899177]/40 bg-white p-8 text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#747c61]">
            You&apos;re booked
          </p>
          <h3 className="mt-4 font-serif text-4xl">Thank you.</h3>
          <p className="mt-4 leading-7">{confirmed}</p>
          <p className="mt-3 text-sm text-[#62665b]">
            Square will send your appointment confirmation to your email.
          </p>
        </div>
      ) : (
        <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#747c61]">
              01 / Choose your session
            </p>
            <h3 className="mt-3 font-serif text-4xl leading-none sm:text-5xl">
              Find a time for you.
            </h3>

            {loadingServices ? (
              <p className="mt-8 text-sm text-[#62665b]">Loading services…</p>
            ) : services.length === 0 ? (
              <p className="mt-8 text-sm text-[#62665b]">
                No bookable services were returned by Square.
              </p>
            ) : (
              <fieldset className="mt-8">
                <legend className="mb-3 text-sm font-semibold">Service</legend>
                <div className="grid gap-2">
                  {services.map((service) => (
                    <label
                      key={service.id}
                      className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-4 transition-colors ${
                        serviceId === service.id
                          ? "border-[#657052] bg-[#e9e9dc]"
                          : "border-[#d9d7cc] bg-white hover:border-[#9b9d88]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="service"
                        value={service.id}
                        checked={serviceId === service.id}
                        onChange={() => {
                          setServiceId(service.id);
                          setSelectedSlot(null);
                          setConfirmed("");
                          setError("");
                        }}
                        className="sr-only"
                      />
                      <span>
                        <span className="block font-semibold">{service.name}</span>
                        <span className="mt-1 block text-sm text-[#62665b]">
                          {service.durationMinutes} min
                        </span>
                      </span>
                      <span className="shrink-0 font-semibold">
                        {priceLabel(service)}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            <div className="mt-8">
              <label htmlFor="appointment-date" className="text-sm font-semibold">
                Date
              </label>
              <input
                id="appointment-date"
                type="date"
                min={today}
                value={date}
                onChange={(event) => {
                  setDate(event.target.value);
                  setSelectedSlot(null);
                  setConfirmed("");
                  setError("");
                }}
                className="mt-2 block min-h-12 w-full rounded-lg border border-[#d9d7cc] bg-white px-4 text-base"
              />
            </div>

            <div className="mt-8">
              <p className="text-sm font-semibold">Available times</p>
              {loadingSlots ? (
                <p className="mt-3 text-sm text-[#62665b]">Checking Square…</p>
              ) : currentAvailability?.error ? (
                <p role="alert" className="mt-3 text-sm text-[#8b3d42]">
                  {currentAvailability.error}
                </p>
              ) : slots.length === 0 ? (
                <p className="mt-3 text-sm text-[#62665b]">
                  No available times for this date. Try another day.
                </p>
              ) : (
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {slots.map((slot) => (
                    <button
                      key={`${slot.startAt}-${slot.teamMemberId}`}
                      type="button"
                      aria-pressed={selectedSlot?.startAt === slot.startAt}
                      onClick={() => {
                        setSelectedSlot(slot);
                        setConfirmed("");
                        setError("");
                      }}
                      className={`min-h-12 rounded-lg border px-3 text-sm font-semibold transition-colors ${
                        selectedSlot?.startAt === slot.startAt
                          ? "border-[#394438] bg-[#394438] text-white"
                          : "border-[#d9d7cc] bg-white hover:border-[#657052]"
                      }`}
                    >
                      {formatTime(slot.startAt)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:border-l lg:border-[#d9d7cc] lg:pl-10">
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#747c61]">
              02 / Your details
            </p>
            <h3 className="mt-3 font-serif text-4xl leading-none sm:text-5xl">
              {selectedSlot ? "Complete your booking." : "Choose a time to continue."}
            </h3>

            {selectedSlot && selectedService && (
              <form className="mt-7 space-y-5" onSubmit={submitBooking}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-medium">
                    First name
                    <input
                      name="firstName"
                      autoComplete="given-name"
                      required
                      maxLength={100}
                      className="mt-2 min-h-12 w-full rounded-lg border border-[#d9d7cc] bg-white px-3"
                    />
                  </label>
                  <label className="text-sm font-medium">
                    Last name
                    <input
                      name="lastName"
                      autoComplete="family-name"
                      required
                      maxLength={100}
                      className="mt-2 min-h-12 w-full rounded-lg border border-[#d9d7cc] bg-white px-3"
                    />
                  </label>
                </div>

                <label className="block text-sm font-medium">
                  Email
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={254}
                    className="mt-2 min-h-12 w-full rounded-lg border border-[#d9d7cc] bg-white px-3"
                  />
                </label>

                <label className="block text-sm font-medium">
                  Phone
                  <input
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    maxLength={32}
                    placeholder="+1 (307) 555-0123"
                    className="mt-2 min-h-12 w-full rounded-lg border border-[#d9d7cc] bg-white px-3"
                  />
                </label>

                <label className="block text-sm font-medium">
                  Note for the therapist (optional)
                  <textarea
                    name="note"
                    rows={2}
                    maxLength={500}
                    className="mt-2 w-full rounded-lg border border-[#d9d7cc] bg-white p-3"
                  />
                </label>

                <div>
                  <p className="text-sm font-semibold">Card on file</p>
                  <p className="mt-1 text-sm leading-6 text-[#62665b]">
                    A card is required to book. Square securely collects your
                    card details; your card is not charged now.
                  </p>
                  <div
                    id="square-card-container"
                    className="mt-3 min-h-[48px] rounded-lg border border-[#d9d7cc] bg-white p-3"
                  />
                  {sdkError && (
                    <p role="alert" className="mt-2 text-sm text-[#8b3d42]">
                      {sdkError}
                    </p>
                  )}
                  {!APPLICATION_ID || !LOCATION_ID ? (
                    <p role="alert" className="mt-2 text-sm text-[#8b3d42]">
                      Square&apos;s public application settings are missing.
                    </p>
                  ) : null}
                </div>

                <div className="space-y-4 rounded-xl bg-[#eeece3] p-4 text-sm leading-6">
                  <p>
                    Please cancel or reschedule by 12:00 p.m. Mountain Time on
                    the day before your appointment. A late cancellation may
                    result in a fee of 50% of the service price (
                    {priceLabel({
                      ...selectedService,
                      amount: Math.round(selectedService.amount / 2),
                    })}
                    ).
                  </p>
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      name="cancellationPolicyAccepted"
                      required
                      className="mt-1 size-4 accent-[#394438]"
                    />
                    <span>I have read and agree to the cancellation policy.</span>
                  </label>
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      name="cardOnFileAccepted"
                      required
                      className="mt-1 size-4 accent-[#394438]"
                    />
                    <span>
                      I authorize Terrapin Massage to securely store this card
                      with Square for this appointment and charge an applicable
                      late-cancellation fee under the policy above.
                    </span>
                  </label>
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      name="futureCardConsent"
                      className="mt-1 size-4 accent-[#394438]"
                    />
                    <span>
                      I also authorize this card to be saved for future
                      purchases.
                    </span>
                  </label>
                </div>

                {error && (
                  <p role="alert" className="rounded-lg bg-[#f7e5e2] p-3 text-sm text-[#7d3035]">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting || !!sdkError || !cardReady}
                  className="flex min-h-14 w-full items-center justify-between rounded-full bg-[#394438] px-6 text-xs font-semibold tracking-[.12em] text-white transition-colors hover:bg-[#59644d] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting
                    ? "SECURELY SUBMITTING…"
                    : `BOOK ${priceLabel(selectedService)}`}
                  <span aria-hidden="true" className="text-lg">
                    &nearr;
                  </span>
                </button>
                <p className="text-center text-xs text-[#62665b]">
                  Your card information is handled securely by Square.
                </p>
              </form>
            )}
          </div>
        </div>
      )}

      {!confirmed && error && !selectedSlot && (
        <p role="alert" className="mx-auto mt-6 max-w-[1180px] text-sm text-[#7d3035]">
          {error}
        </p>
      )}
    </div>
  );
}
