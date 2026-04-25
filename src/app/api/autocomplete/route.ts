import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();
    if (!input || input.length < 2) return NextResponse.json({ suggestions: [] });

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(input)}.json?autocomplete=true&country=us&limit=5&access_token=${token}`;
    const res = await fetch(url);
    if (!res.ok) return NextResponse.json({ suggestions: [] });

    const data = await res.json();
    const suggestions = (data.features ?? []).map((f: Record<string, unknown>) => ({
      description: f.place_name as string,
      placeId: f.id as string,
      lat: (f.center as [number, number])[1],
      lng: (f.center as [number, number])[0],
    }));

    return NextResponse.json({ success: true, suggestions });
  } catch {
    return NextResponse.json({ suggestions: [] });
  }
}
