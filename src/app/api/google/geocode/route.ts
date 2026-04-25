import { type NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "Missing Google Maps API key" }, { status: 500 });
  }

  const address = request.nextUrl.searchParams.get("address");
  if (!address) {
    return Response.json({ error: "Missing address" }, { status: 400 });
  }

  const params = new URLSearchParams({ address, key: apiKey });
  const upstream = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?${params.toString()}`, {
    cache: "no-store",
  });

  if (!upstream.ok) {
    return Response.json({ error: "Geocode request failed" }, { status: upstream.status });
  }

  const data = await upstream.json();
  const location = data?.results?.[0]?.geometry?.location;

  return Response.json({
    latitude: typeof location?.lat === "number" ? location.lat : null,
    longitude: typeof location?.lng === "number" ? location.lng : null,
  });
}
