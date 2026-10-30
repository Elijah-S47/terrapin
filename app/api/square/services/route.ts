import { getServiceVariations, parseSquareError } from "@/lib/square";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const services = await getServiceVariations();
    return Response.json(services, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    const squareError = parseSquareError(error);
    console.error("Unable to load Square services", squareError ?? error);
    return Response.json(
      { error: "We couldn’t load the current services. Please try again." },
      { status: 502 },
    );
  }
}
