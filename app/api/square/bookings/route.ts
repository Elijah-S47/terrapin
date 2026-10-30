import {
  getAvailableSlots,
  getServiceVariations,
  getSquareConfig,
  isUuid,
  parseSquareError,
  squareIdempotencyKey,
  squareRequest,
  validCalendarDate,
} from "@/lib/square";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type BookingRequest = {
  attemptId?: unknown;
  serviceVariationId?: unknown;
  date?: unknown;
  startAt?: unknown;
  teamMemberId?: unknown;
  sourceId?: unknown;
  firstName?: unknown;
  lastName?: unknown;
  email?: unknown;
  phone?: unknown;
  note?: unknown;
  cancellationPolicyAccepted?: unknown;
  cardOnFileAccepted?: unknown;
  futureCardConsent?: unknown;
};

type SquareCustomer = { id: string };
type SquareCard = { id: string };
type SquareBooking = {
  id: string;
  status?: string;
  start_at?: string;
};

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const forwardedHost = request.headers.get("x-forwarded-host");
  const requestHost =
    forwardedHost?.split(",")[0].trim() ||
    request.headers.get("host") ||
    new URL(request.url).host;
  try {
    return new URL(origin).host === requestHost;
  } catch {
    return false;
  }
}

function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (value.trim().startsWith("+") && digits.length >= 9 && digits.length <= 15) {
    return `+${digits}`;
  }
  return "";
}

async function findOrCreateCustomer(input: {
  attemptId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}) {
  const search = await squareRequest<{ customers?: SquareCustomer[] }>(
    "customers/search",
    {
      method: "POST",
      body: JSON.stringify({
        query: {
          filter: { email_address: { exact: input.email } },
        },
        limit: 1,
      }),
    },
  );
  const existing = search.customers?.[0];
  if (existing?.id) return existing.id;

  const created = await squareRequest<{ customer?: SquareCustomer }>(
    "customers",
    {
      method: "POST",
      body: JSON.stringify({
        idempotency_key: squareIdempotencyKey(input.attemptId, "customer"),
        given_name: input.firstName,
        family_name: input.lastName,
        email_address: input.email,
        phone_number: input.phone,
      }),
    },
  );
  if (!created.customer?.id) {
    throw new Error("Square did not return a customer ID.");
  }
  return created.customer.id;
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return Response.json({ error: "Request could not be verified." }, { status: 403 });
  }

  let input: BookingRequest;
  try {
    input = (await request.json()) as BookingRequest;
  } catch {
    return Response.json({ error: "Invalid booking request." }, { status: 400 });
  }

  const attemptId = input.attemptId;
  const serviceVariationId = cleanText(input.serviceVariationId, 100);
  const date = input.date;
  const startAt = cleanText(input.startAt, 64);
  const teamMemberId = cleanText(input.teamMemberId, 100);
  const sourceId = cleanText(input.sourceId, 500);
  const firstName = cleanText(input.firstName, 100);
  const lastName = cleanText(input.lastName, 100);
  const email = cleanText(input.email, 254).toLowerCase();
  const phoneInput = cleanText(input.phone, 32);
  const phone = normalizePhone(phoneInput);
  const note = cleanText(input.note, 500);

  if (
    !isUuid(attemptId) ||
    !serviceVariationId ||
    !validCalendarDate(date) ||
    !startAt ||
    Number.isNaN(Date.parse(startAt)) ||
    !teamMemberId ||
    !sourceId ||
    !firstName ||
    !lastName ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !phone ||
    input.cancellationPolicyAccepted !== true ||
    input.cardOnFileAccepted !== true ||
    typeof input.futureCardConsent !== "boolean"
  ) {
    return Response.json(
      { error: "Complete the required booking details and permissions." },
      { status: 400 },
    );
  }

  try {
    const config = getSquareConfig();
    const services = await getServiceVariations();
    const service = services.find((item) => item.id === serviceVariationId);
    if (!service) {
      return Response.json(
        { error: "That service is no longer available. Please choose another." },
        { status: 409 },
      );
    }

    const availableSlots = await getAvailableSlots(serviceVariationId, date);
    const slot = availableSlots.find(
      (item) =>
        item.startAt === startAt && item.teamMemberId === teamMemberId,
    );
    if (!slot) {
      return Response.json(
        { error: "That time is no longer available. Please choose another." },
        { status: 409 },
      );
    }

    const customerId = await findOrCreateCustomer({
      attemptId,
      firstName,
      lastName,
      email,
      phone,
    });

    const cardResult = await squareRequest<{ card?: SquareCard }>("cards", {
      method: "POST",
      body: JSON.stringify({
        idempotency_key: squareIdempotencyKey(attemptId, "card"),
        source_id: sourceId,
        card: {
          customer_id: customerId,
          cardholder_name: `${firstName} ${lastName}`,
        },
      }),
    });
    const cardId = cardResult.card?.id;
    if (!cardId) throw new Error("Square did not return a saved card ID.");

    const consentNote = [
      `Customer accepted cancellation policy and authorized card-on-file for this appointment at ${new Date().toISOString()}.`,
      `Future purchases card consent: ${input.futureCardConsent ? "yes" : "no"}.`,
      note ? `Customer note: ${note}` : "",
    ]
      .filter(Boolean)
      .join(" ");

    try {
      const bookingResult = await squareRequest<{ booking?: SquareBooking }>(
        "bookings",
        {
          method: "POST",
          body: JSON.stringify({
            idempotency_key: squareIdempotencyKey(attemptId, "booking"),
            booking: {
              start_at: slot.startAt,
              location_id: config.locationId,
              customer_id: customerId,
              seller_note: consentNote,
              appointment_segments: [
                {
                  duration_minutes: service.durationMinutes,
                  service_variation_id: service.id,
                  service_variation_version: service.version,
                  team_member_id: slot.teamMemberId,
                },
              ],
            },
          }),
        },
      );

      if (!bookingResult.booking?.id) {
        throw new Error("Square did not return a booking confirmation.");
      }

      return Response.json(
        {
          bookingId: bookingResult.booking.id,
          startAt: bookingResult.booking.start_at ?? slot.startAt,
        },
        { status: 201, headers: { "Cache-Control": "no-store" } },
      );
    } catch (bookingError) {
      try {
        await squareRequest(`cards/${encodeURIComponent(cardId)}`, {
          method: "DELETE",
        });
      } catch (cleanupError) {
        console.error(
          "Unable to remove card after failed booking",
          parseSquareError(cleanupError) ?? cleanupError,
        );
      }
      throw bookingError;
    }
  } catch (error) {
    const squareError = parseSquareError(error);
    console.error("Unable to complete Square booking", squareError ?? error);
    return Response.json(
      {
        error:
          "We couldn’t complete the booking. No appointment was confirmed. Please try again or contact Terrapin Massage.",
      },
      { status: 502 },
    );
  }
}
