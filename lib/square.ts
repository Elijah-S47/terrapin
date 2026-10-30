import { randomUUID } from "node:crypto";

type SquareError = {
  category?: string;
  code?: string;
  detail?: string;
};

export class SquareApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly errors: SquareError[],
  ) {
    super(message);
    this.name = "SquareApiError";
  }
}

export type ServiceVariation = {
  id: string;
  version: number;
  name: string;
  durationMinutes: number;
  amount: number;
  currency: string;
};

type CatalogVariation = {
  id: string;
  version?: number;
  is_deleted?: boolean;
  item_variation_data?: {
    name?: string;
    service_duration?: number;
    price_money?: { amount?: number; currency?: string };
  };
};

type CatalogObject = {
  type: string;
  id: string;
  version?: number;
  is_deleted?: boolean;
  item_data?: {
    name?: string;
    product_type?: string;
    variations?: CatalogVariation[];
  };
};

type CatalogResponse = {
  objects?: CatalogObject[];
  cursor?: string;
};

type Availability = {
  start_at?: string;
  appointment_segments?: Array<{
    team_member_id?: string;
    service_variation_id?: string;
    service_variation_version?: number;
    duration_minutes?: number;
  }>;
};

const SQUARE_API_VERSION = "2025-02-20";

export function getSquareConfig() {
  const environment = process.env.SQUARE_ENVIRONMENT;
  const accessToken = process.env.SQUARE_ACCESS_TOKEN;
  const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;

  if (
    (environment !== "sandbox" && environment !== "production") ||
    !accessToken ||
    !locationId
  ) {
    throw new Error("Square server configuration is incomplete.");
  }

  return {
    accessToken,
    locationId,
    baseUrl:
      environment === "sandbox"
        ? "https://connect.squareupsandbox.com/v2"
        : "https://connect.squareup.com/v2",
  };
}

export async function squareRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const config = getSquareConfig();
  const response = await fetch(`${config.baseUrl}/${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${config.accessToken}`,
      "Square-Version": SQUARE_API_VERSION,
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });

  let result: unknown;
  try {
    result = await response.json();
  } catch {
    result = {};
  }

  if (!response.ok) {
    const errors =
      typeof result === "object" &&
      result !== null &&
      "errors" in result &&
      Array.isArray(result.errors)
        ? (result.errors as SquareError[])
        : [];
    console.error("Square API request failed", {
      path,
      status: response.status,
      codes: errors.map((error) => error.code),
    });
    throw new SquareApiError("Square request failed.", response.status, errors);
  }

  return result as T;
}

export async function getServiceVariations(): Promise<ServiceVariation[]> {
  const objects: CatalogObject[] = [];
  let cursor: string | undefined;
  let pages = 0;

  do {
    const query = new URLSearchParams({ types: "ITEM,ITEM_VARIATION" });
    if (cursor) query.set("cursor", cursor);
    const page = await squareRequest<CatalogResponse>(
      `catalog/list?${query.toString()}`,
    );
    objects.push(...(page.objects ?? []));
    cursor = page.cursor;
    pages += 1;
  } while (cursor && pages < 10);

  const services: ServiceVariation[] = [];
  for (const item of objects) {
    if (item.type !== "ITEM" || item.is_deleted || !item.item_data?.name) {
      continue;
    }

    for (const variation of item.item_data.variations ?? []) {
      const data = variation.item_variation_data;
      const duration = data?.service_duration;
      const price = data?.price_money;
      if (
        variation.is_deleted ||
        !variation.id ||
        !variation.version ||
        !duration ||
        !price?.amount ||
        !price.currency
      ) {
        continue;
      }

      services.push({
        id: variation.id,
        version: variation.version,
        name: item.item_data.name,
        durationMinutes: Math.round(duration / 60_000),
        amount: price.amount,
        currency: price.currency,
      });
    }
  }

  return services.sort(
    (a, b) =>
      a.name.localeCompare(b.name) || a.durationMinutes - b.durationMinutes,
  );
}

function isCalendarDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function shiftCalendarDate(date: string, days: number) {
  const [year, month, day] = date.split("-").map(Number);
  const shifted = new Date(Date.UTC(year, month - 1, day + days));
  return shifted.toISOString().slice(0, 10);
}

function localMidnightAsUtc(date: string, timeZone: string) {
  const [year, month, day] = date.split("-").map(Number);
  const targetWallTime = Date.UTC(year, month - 1, day);
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  const parts = Object.fromEntries(
    formatter
      .formatToParts(new Date(targetWallTime))
      .map((part) => [part.type, part.value]),
  );
  const representedWallTime = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  );
  return new Date(targetWallTime - (representedWallTime - targetWallTime));
}

function dateInTimeZone(value: string, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(value));
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export type AvailableSlot = {
  startAt: string;
  teamMemberId: string;
  serviceVariationVersion: number;
  durationMinutes: number;
};

export async function getAvailableSlots(
  serviceVariationId: string,
  date: string,
): Promise<AvailableSlot[]> {
  if (!isCalendarDate(date)) {
    throw new Error("Choose a valid appointment date.");
  }

  const { locationId } = getSquareConfig();
  const locationResponse = await squareRequest<{
    location?: { timezone?: string };
  }>(`locations/${locationId}`);
  const timeZone = locationResponse.location?.timezone;
  if (!timeZone) throw new Error("Square location has no timezone configured.");

  const now = new Date();
  const today = dateInTimeZone(now.toISOString(), timeZone);
  const dayStart = localMidnightAsUtc(date, timeZone);
  const startAt =
    date === today
      ? new Date(now.getTime() + 60_000)
      : dayStart;
  const endAt = localMidnightAsUtc(shiftCalendarDate(date, 1), timeZone);
  if (startAt >= endAt) return [];

  const search = await squareRequest<{ availabilities?: Availability[] }>(
    "bookings/availability/search",
    {
      method: "POST",
      body: JSON.stringify({
        query: {
          filter: {
            start_at_range: {
              start_at: startAt.toISOString(),
              end_at: endAt.toISOString(),
            },
            location_id: locationId,
            segment_filters: [{ service_variation_id: serviceVariationId }],
          },
        },
      }),
    },
  );

  return (search.availabilities ?? [])
    .filter(
      (availability) =>
        availability.start_at &&
        Date.parse(availability.start_at) > Date.now() &&
        dateInTimeZone(availability.start_at, timeZone) === date,
    )
    .flatMap((availability) => {
      const segment = availability.appointment_segments?.[0];
      if (
        !availability.start_at ||
        !segment?.team_member_id ||
        !segment.service_variation_version ||
        !segment.duration_minutes
      ) {
        return [];
      }
      return [
        {
          startAt: availability.start_at,
          teamMemberId: segment.team_member_id,
          serviceVariationVersion: segment.service_variation_version,
          durationMinutes: segment.duration_minutes,
        },
      ];
    })
    .sort((a, b) => a.startAt.localeCompare(b.startAt));
}

export function squareIdempotencyKey(attemptId: string, action: string) {
  return `${action}-${attemptId}`;
}

export function isUuid(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value,
    )
  );
}

export function validCalendarDate(value: unknown): value is string {
  return typeof value === "string" && isCalendarDate(value);
}

export function parseSquareError(error: unknown) {
  if (error instanceof SquareApiError) {
    return {
      status: error.status,
      codes: error.errors.map((item) => item.code).filter(Boolean),
    };
  }
  return undefined;
}

export { randomUUID };
