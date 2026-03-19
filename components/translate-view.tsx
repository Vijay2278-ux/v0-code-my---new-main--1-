"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function TranslateView() {
  const { language, t } = useLanguage()
  const [originalLang, setOriginalLang] = useState<typeof language>(language)
  const [targetLang, setTargetLang] = useState<"en" | "hi" | "ta" | "te">("hi")
  const [originalText, setOriginalText] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

 // Keep originalLang synced to global UI language selection (per your request)
  useEffect(() => {
    setOriginalLang(language)
  }, [language])

  const handleTranslate = async () => {
    if (!originalText.trim()) { setError(t("enterOriginal") || "Enter text"); return }
    setLoading(true); setError(""); setTranslatedText("")
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: originalText, source: originalLang, target: targetLang }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || t("translateFailed") || "Translation failed")
      } else {
        setTranslatedText(data.translatedText || data.translated_text || "")
      }
    } catch (err) {
      setError(t("translateFailed") || "Translation failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mt-6">
    <CardHeader>
        <CardTitle>{t("translateTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-3 items-center">
          <label className="text-sm">{t("originalLang")}</label>
          <select
            value={originalLang}
            onChange={(e) => setOriginalLang(e.target.value as any)}
            className="p-2 rounded border"
          >
            {(["en", "hi", "ta", "te"] as const).map((l) => (
              <option key={l} value={l}>
                {l.toUpperCase()}
              </option>
            ))}
          </select>

          <label className="ml-4 text-sm">{t("targetLang")}</label>
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value as any)}
            className="p-2 rounded border"
          >
            {(["en", "hi", "ta", "te"] as const).map((l) => (
              <option key={l} value={l}>
                {l.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="text-sm block mb-1">{t("enterOriginal")}</label>
          <Input value={originalText} onChange={(e) => setOriginalText(e.target.value)} placeholder={t("enterOriginalPlaceholder")} />
        </div>

        <div className="flex gap-2">
          <Button onClick={handleTranslate} disabled={loading || !originalText.trim()}>
            {loading ? t("translating") : t("translate")}
          </Button>
          <Button variant="outline" onClick={() => { setOriginalText(""); setTargetLang("hi"); setTranslatedText(""); setError("") }}>{t("clear")}</Button>
        </div>

        {error && <div className="text-red-600 mt-3">{error}</div>}

        {translatedText && (
          <div className="mt-4">
            <label className="text-sm block mb-1">{t("translate")}</label>
            <textarea value={translatedText} readOnly className="w-full p-2 border rounded" rows={4} />
            <div className="flex gap-2 mt-2">
              <Button onClick={() => navigator.clipboard.writeText(translatedText)}>{t("copy")}</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

















































