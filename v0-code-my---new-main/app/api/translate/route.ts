import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { q, source, target } = body

    if (!q || !target) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 })
    }

    // Using LibreTranslate public demo endpoint for quick local testing
    const providerUrl = "https://libretranslate.de/translate"

    const resp = await fetch(providerUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q, source: source || "auto", target, format: "text" }),
    })

    const data = await resp.json()
    if (!resp.ok) {
      return NextResponse.json({ error: data.error || "Provider error" }, { status: 502 })
    }

    // LibreTranslate typically returns { translatedText: "..." }
    const translatedText = data.translatedText || data.translated_text || data.translated || ""

    return NextResponse.json({ translatedText })
  } catch (err) {
    // log server-side error
    console.error("/api/translate error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
