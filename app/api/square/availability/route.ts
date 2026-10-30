import {
  getAvailableSlots,
  parseSquareError,
  validCalendarDate,
} from "@/lib/square";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const search = new URL(request.url).searchParams;
  const serviceVariationId = search.get("serviceVariationId");
  const date = search.get("date");

  if (
    !serviceVariationId ||
    serviceVariationId.length > 100 ||
    !validCalendarDate(date)
  ) {
    return Response.json(
      { error: "Choose a service and a valid date." },
      { status: 400 },
    );
  }

  try {
    const slots = await getAvailableSlots(serviceVariationId, date);
    return Response.json(slots, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    const squareError = parseSquareError(error);
    console.error("Unable to load Square availability", squareError ?? error);
    return Response.json(
      { error: "We couldn’t load available times. Please try again." },
      { status: 502 },
    );
  }
}
