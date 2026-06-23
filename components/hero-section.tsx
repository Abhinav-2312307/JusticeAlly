"use client"

import React, { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  BookOpen,
  Clock,
  FileSignature,
  Globe,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
} from "lucide-react"

const QUERY = "Landlord won't return my security deposit."

const RESULTS = [
  {
    icon: ShieldCheck,
    label: "Rights identified",
    detail: "3 protections · Rent Control Act",
    delay: 1600,
    color: "text-[#2d5a3d]",
    bg: "bg-[#c8e6c9]",
  },
  {
    icon: BookOpen,
    label: "Law retrieved",
    detail: "S.21, Transfer of Property Act",
    delay: 2400,
    color: "text-[#6b4a14]",
    bg: "bg-[#f5e9d0]",
  },
  {
    icon: FileSignature,
    label: "Draft ready",
    detail: "Legal notice · Hindi & English",
    delay: 3200,
    color: "text-[#1a3c5e]",
    bg: "bg-[#deeaf5]",
  },
]

// Each popup has a distinct bg so it pops against the parchment hero bg
const POPUPS = [
  {
    id: "lang",
    delay: 3800,
    posClass: "left-0 top-[22%]",
    offsetStyle: { transform: "translateX(calc(-100% - 14px))" } as React.CSSProperties,
    icon: Globe,
    // deep forest green card
    cardBg: "#1e3d2b",
    cardBorder: "#2d5a3d",
    iconBg: "#2d5a3d",
    iconColor: "#a8d5b5",
    labelColor: "#e8f5ec",
    subColor: "#8dc4a0",
    label: "Multilingual",
    sub: "हिन्दी · English · தமிழ் · বাংলা",
  },
  {
    id: "rag",
    delay: 600,
    posClass: "right-3 top-0",
    offsetStyle: { transform: "translateY(calc(-100% - 12px))" } as React.CSSProperties,
    icon: Sparkles,
    // warm amber card
    cardBg: "#3d2a0a",
    cardBorder: "#8a6a2e",
    iconBg: "#5a3d12",
    iconColor: "#f0c96e",
    labelColor: "#fdf0d0",
    subColor: "#c9a05a",
    label: "RAG-powered",
    sub: "500+ verified Indian laws",
  },
  {
    id: "247",
    delay: 4600,
    posClass: "right-3 bottom-0",
    offsetStyle: { transform: "translateY(calc(100% + 12px))" } as React.CSSProperties,
    icon: Clock,
    // deep slate-blue card
    cardBg: "#0f2236",
    cardBorder: "#1a3c5e",
    iconBg: "#1a3c5e",
    iconColor: "#7db8e8",
    labelColor: "#d8ecfa",
    subColor: "#6aa0c8",
    label: "24 / 7 assistance",
    sub: "Always available, anytime",
  },
]

function Popup({
  p,
  visible,
}: {
  p: (typeof POPUPS)[number]
  visible: boolean
}) {
  const Icon = p.icon
  return (
    <div
      className="absolute z-20 hidden w-[152px] rounded-2xl px-3 py-2.5 lg:block"
      style={{
        background: p.cardBg,
        border: `1px solid ${p.cardBorder}`,
        boxShadow: `0 8px 28px rgba(0,0,0,0.22), 0 0 0 1px ${p.cardBorder}22`,
        ...p.offsetStyle,
        // position classes applied via wrapper
        top: p.posClass.includes("top-0") ? 0 : p.posClass.includes("top-[22%]") ? "22%" : undefined,
        bottom: p.posClass.includes("bottom-0") ? 0 : undefined,
        left: p.posClass.includes("left-0") ? 0 : undefined,
        right: p.posClass.includes("right-3") ? "0.75rem" : undefined,
        opacity: visible ? 1 : 0,
        transitionProperty: "opacity, filter",
        transitionDuration: "0.5s",
        transitionTimingFunction: "ease",
        filter: visible ? "blur(0px)" : "blur(2px)",
      }}
    >
      <div className="flex items-start gap-2">
        <span
          className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg"
          style={{ background: p.iconBg }}
        >
          <Icon className="h-3.5 w-3.5" style={{ color: p.iconColor }} />
        </span>
        <div>
          <p className="text-[11.5px] font-semibold leading-tight" style={{ color: p.labelColor }}>
            {p.label}
          </p>
          <p className="mt-0.5 text-[10px] leading-snug" style={{ color: p.subColor }}>
            {p.sub}
          </p>
        </div>
      </div>
    </div>
  )
}

function AIPanel() {
  const [typedQuery, setTypedQuery] = useState("")
  const [visibleResults, setVisibleResults] = useState<number[]>([])
  const [thinking, setThinking] = useState(false)
  const [dots, setDots] = useState(".")
  const [visiblePopups, setVisiblePopups] = useState<string[]>([])
  const rafRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    let i = 0
    const TYPE_SPEED = 40
    function typeNext() {
      if (i <= QUERY.length) {
        setTypedQuery(QUERY.slice(0, i))
        i++
        rafRef.current = setTimeout(typeNext, TYPE_SPEED)
      } else {
        setThinking(true)
      }
    }
    const start = setTimeout(typeNext, 500)
    return () => {
      clearTimeout(start)
      if (rafRef.current) clearTimeout(rafRef.current)
    }
  }, [])

  useEffect(() => {
    if (!thinking) return
    const id = setInterval(() => setDots((d) => (d.length >= 3 ? "." : d + ".")), 420)
    return () => clearInterval(id)
  }, [thinking])

  useEffect(() => {
    const timers = RESULTS.map((r, idx) =>
      setTimeout(() => {
        setVisibleResults((prev) => [...prev, idx])
        if (idx === RESULTS.length - 1) setThinking(false)
      }, r.delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    const timers = POPUPS.map((p) =>
      setTimeout(() => setVisiblePopups((prev) => [...prev, p.id]), p.delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="relative w-full max-w-[360px]">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-16 rounded-full"
        style={{
          background: "radial-gradient(ellipse at 55% 45%, rgba(60,120,70,0.12) 0%, transparent 65%)",
        }}
      />

      {/* Popups */}
      {POPUPS.map((p) => (
        <Popup key={p.id} p={p} visible={visiblePopups.includes(p.id)} />
      ))}

      {/* Main panel */}
      <div
        className="relative overflow-hidden rounded-3xl p-5"
        style={{
          background: "rgba(255,252,246,0.82)",
          border: "1px solid rgba(60,120,70,0.22)",
          backdropFilter: "blur(14px)",
          boxShadow: "0 24px 60px rgba(30,61,43,0.12), 0 1px 0 rgba(255,255,255,0.7) inset",
        }}
      >
        {/* Window chrome */}
        <div className="mb-4 flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#f0ad84]" />
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#e8c97a]" />
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#87c08a]" />
          <span className="ml-3 text-xs font-medium tracking-wide text-muted-foreground">
            Legal Assistant
          </span>
        </div>

        {/* User query bubble */}
        <div className="mb-4 flex justify-end">
          <div
            className="max-w-[90%] rounded-2xl rounded-br-sm px-4 py-3 text-sm leading-relaxed"
            style={{
              background: "hsl(143 24% 24%)",
              color: "hsl(39 46% 98%)",
              minHeight: "2.8rem",
            }}
          >
            {typedQuery}
            {typedQuery.length < QUERY.length && (
              <span className="ml-0.5 inline-block h-3.5 w-px animate-pulse bg-current align-middle" />
            )}
          </div>
        </div>

        {/* Thinking indicator */}
        {thinking && (
          <div className="mb-3 flex items-center gap-2 pl-0.5">
            <Sparkles className="h-3.5 w-3.5 text-[#8a6a2e]" />
            <span className="text-xs text-muted-foreground">Analysing{dots}</span>
          </div>
        )}

        {/* Result cards */}
        <div className="space-y-2.5">
          {RESULTS.map((r, idx) => {
            const Icon = r.icon
            const visible = visibleResults.includes(idx)
            return (
              <div
                key={idx}
                className="flex items-center gap-3 rounded-xl px-3.5 py-3 transition-all duration-500"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(5px)",
                  background: "rgba(255,255,255,0.65)",
                  border: "1px solid rgba(60,120,70,0.14)",
                }}
              >
                <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg ${r.bg}`}>
                  <Icon className={`h-3.5 w-3.5 ${r.color}`} />
                </span>
                <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                  <p className="text-[13px] font-semibold text-foreground">{r.label}</p>
                  <p className="whitespace-nowrap text-[11px] text-muted-foreground">{r.detail}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Hero ────────────────────────────────────────────────────────────────────

export function HeroSection({ isSignedIn = false }: { isSignedIn?: boolean }) {
  const assistantHref = isSignedIn ? "/tools/legal-assistant" : "/login?next=%2Ftools%2Flegal-assistant"

  return (
    <div className="px-4 pt-5 pb-4 sm:px-6 lg:px-8">
      <section
        className="relative flex flex-col overflow-hidden rounded-[2rem]"
        aria-label="Hero"
        style={{
          background: "linear-gradient(150deg, hsl(38 55% 94%) 0%, hsl(120 18% 90%) 100%)",
          border: "1.5px solid hsl(143 35% 28%)",
          boxShadow:
            "0 0 0 1px hsl(143 30% 72% / 0.25), 0 4px 32px rgba(45,90,61,0.10), inset 0 1px 0 rgba(255,255,255,0.7)",
          minHeight: "82vh",
        }}
      >
        {/* Top glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[2rem]"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 70% 40% at 40% -5%, rgba(187,148,87,0.14) 0%, transparent 55%),
              radial-gradient(ellipse 50% 45% at 85% 80%, rgba(45,90,61,0.09) 0%, transparent 55%)
            `,
          }}
        />

        {/* Green grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[2rem]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(45,90,61,0.09) 1px, transparent 1px),
              linear-gradient(90deg, rgba(45,90,61,0.09) 1px, transparent 1px)
            `,
            backgroundSize: "44px 44px",
            maskImage: "linear-gradient(to bottom, black 0%, black 55%, transparent 90%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-1 items-center px-7 py-10 sm:px-10 lg:px-14 lg:py-0">
          <div className="grid w-full items-center gap-8 lg:grid-cols-2 lg:gap-6">

            {/* LEFT */}
            <div className="max-w-[520px]">
              <h1
                className="font-display font-semibold leading-[1.06] text-foreground"
                style={{ fontSize: "clamp(2.2rem, 4vw, 3.4rem)" }}
              >
                When life gets complicated,{" "}
                <br className="hidden sm:block" />
                finding{" "}
                <span
                  style={{
                    color: "hsl(143 44% 22%)",
                    textDecorationLine: "underline",
                    textDecorationColor: "hsl(35 64% 68%)",
                    textDecorationThickness: "3px",
                    textUnderlineOffset: "6px",
                  }}
                >
                  legal help
                </span>{" "}
                shouldn't be.
              </h1>

              <p
                className="mt-6 leading-[1.75] text-muted-foreground"
                style={{ fontSize: "clamp(1rem, 1.3vw, 1.125rem)" }}
              >
                Know your rights.{" "}
                <span className="text-foreground/70">Understand your options.</span>{" "}
                <span className="text-foreground/50">Take action.</span>
              </p>

              {/* Feature pills */}
              <div className="mt-7 flex flex-wrap gap-2">
                {[
                  { icon: MessageSquareText, label: "AI Legal Chat" },
                  { icon: FileSignature, label: "Draft Studio" },
                  { icon: BookOpen, label: "Document Q&A" },
                ].map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium backdrop-blur-sm"
                    style={{
                      background: "rgba(255,255,255,0.6)",
                      border: "1px solid rgba(45,90,61,0.2)",
                      color: "hsl(28 22% 28%)",
                    }}
                  >
                    <Icon className="h-3.5 w-3.5" style={{ color: "hsl(143 24% 30%)" }} />
                    {label}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div className="mt-9 flex flex-wrap gap-3">
                <Button asChild size="lg" className="gap-2 text-[15px]">
                  <Link href={assistantHref}>
                    Talk to Assistant
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="text-[15px] backdrop-blur-sm"
                  style={{
                    background: "rgba(255,255,255,0.55)",
                    borderColor: "rgba(45,90,61,0.3)",
                  }}
                >
                  <Link href="/resources/legal-library">Explore Rights Library</Link>
                </Button>
              </div>
            </div>

            {/* RIGHT — shifted right with justify-end and a right padding push */}
            <div className="flex justify-center lg:justify-end lg:pr-14">
              <AIPanel />
            </div>

          </div>
        </div>

        {/* Corner accent — bottom left */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-bl-[2rem] opacity-40"
          style={{
            background: "radial-gradient(circle at 0% 100%, hsl(143 30% 72% / 0.45), transparent 65%)",
          }}
        />
      </section>
    </div>
  )
}
