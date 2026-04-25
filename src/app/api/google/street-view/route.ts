import { type NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return new Response("Missing Google Maps API key", { status: 500 });
  }

  const searchParams = request.nextUrl.searchParams;
  const width = searchParams.get("width") ?? "800";
  const height = searchParams.get("height") ?? "500";
  const heading = searchParams.get("heading") ?? "0";
  const pitch = searchParams.get("pitch") ?? "5";
  const fov = searchParams.get("fov") ?? "90";
  const source = searchParams.get("source") ?? "outdoor";
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const address = searchParams.get("address");

  const location = lat && lng ? `${lat},${lng}` : address;
  if (!location) {
    return new Response("Missing location", { status: 400 });
  }

  const upstreamParams = new URLSearchParams({
    size: `${width}x${height}`,
    location,
    heading,
    pitch,
    fov,
    source,
    key: apiKey,
  });

  const upstream = await fetch(`https://maps.googleapis.com/maps/api/streetview?${upstreamParams.toString()}`, {
    cache: "no-store",
  });

  if (!upstream.ok) {
    return new Response("Street View request failed", { status: upstream.status });
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": upstream.headers.get("Content-Type") ?? "image/jpeg",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
