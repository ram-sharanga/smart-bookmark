import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "No URL provided" }, { status: 400 });
  }

  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; BookmarkBot/1.0)",
      },
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    const html = await response.text();

    // Extract <title> tag
    const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = match ? match[1].trim().replace(/\s+/g, " ") : null;

    // Extract og:title as fallback
    const ogMatch = html.match(
      /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i
    );
    const ogTitle = ogMatch ? ogMatch[1].trim() : null;

    return NextResponse.json({ title: ogTitle || title || null });
  } catch {
    return NextResponse.json({ title: null });
  }
}