"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { START_POSITION, applyMoves, type Move, type Position } from "@/lib/openings"

// ---- geometry helpers (all values are % of the board box) ----
// Layout matches the static Board: top row = points 13-24, bottom row = 12-1,
// a central bar splits the two halves. The player (red) moves 24 -> 1.
const STEP = 7.5 // width of one point column, in %
const LEFT0 = 5.75 // center x of the first left-half column
const RIGHT0 = 56.75 // center x of the first right-half column
const STACK_STEP = 7 // vertical gap between stacked checkers, in %

function pointMeta(p: number): { cx: number; top: boolean } {
  if (p >= 13 && p <= 18) return { cx: LEFT0 + (p - 13) * STEP, top: true }
  if (p >= 19 && p <= 24) return { cx: RIGHT0 + (p - 19) * STEP, top: true }
  if (p >= 7 && p <= 12) return { cx: LEFT0 + (12 - p) * STEP, top: false }
  return { cx: RIGHT0 + (6 - p) * STEP, top: false } // 1..6
}

function stackY(top: boolean, index: number): number {
  return top ? 6 + index * STACK_STEP : 94 - index * STACK_STEP
}

function clonePosition(pos: Position): Position {
  const out: Position = {}
  for (const k of Object.keys(pos)) out[Number(k)] = { ...pos[Number(k)] }
  return out
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])
  return reduced
}

function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.4 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return { ref, inView }
}

interface Flyer {
  color: "player" | "opponent"
  startX: number
  startY: number
  endX: number
  endY: number
}

function Checker({
  color,
  d,
  style,
}: {
  color: "player" | "opponent"
  d: number
  style?: React.CSSProperties
}) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        width: `${d}%`,
        aspectRatio: "1",
        background:
          color === "player"
            ? "radial-gradient(circle at 35% 30%, oklch(0.62 0.18 30), var(--color-checker-player))"
            : "radial-gradient(circle at 35% 30%, oklch(0.32 0.02 60), var(--color-checker-opponent))",
        boxShadow:
          "inset 0 1px 1px rgba(255,255,255,0.3), 0 1px 2px rgba(0,0,0,0.45)",
        ...style,
      }}
      aria-hidden="true"
    />
  )
}

export function MoveAnimation({
  moves,
  compact = false,
  showReplay = false,
  className = "",
}: {
  moves: Move[]
  compact?: boolean
  showReplay?: boolean
  className?: string
}) {
  const reduced = usePrefersReducedMotion()
  const { ref, inView } = useInView<HTMLDivElement>()

  const [moved, setMoved] = useState(false)
  const [animate, setAnimate] = useState(false)
  const timers = useRef<number[]>([])

  // Build the resting board (after the play) with destinations decremented by
  // the number of incoming "flying" checkers, plus the flyers themselves.
  const { baseChips, flyers, destinations, overflow } = useMemo(() => {
    const after = applyMoves(START_POSITION, moves)
    const base = clonePosition(after)

    const incoming: Record<number, number> = {}
    for (const [, to] of moves) incoming[to] = (incoming[to] ?? 0) + 1
    for (const dest of Object.keys(incoming).map(Number)) {
      if (base[dest]) {
        base[dest].count -= incoming[dest]
        if (base[dest].count <= 0) delete base[dest]
      }
    }

    // static checkers to render
    type Chip = { key: string; color: "player" | "opponent"; x: number; y: number }
    const baseChips: Chip[] = []
    const overflow: { x: number; y: number; n: number }[] = []
    for (const k of Object.keys(base)) {
      const p = Number(k)
      const { cx, top } = pointMeta(p)
      const { color, count } = base[p]
      const visible = Math.min(count, 5)
      for (let i = 0; i < visible; i++) {
        baseChips.push({ key: `${p}-${i}`, color, x: cx, y: stackY(top, i) })
      }
      if (count > 5) overflow.push({ x: cx, y: stackY(top, 5), n: count - 5 })
    }

    // flyers: travel from origin (top of remaining origin stack) to destination
    const destCounter: Record<number, number> = {}
    const flyers: Flyer[] = moves.map(([from, to]) => {
      const fromMeta = pointMeta(from)
      const toMeta = pointMeta(to)
      const fromIndex = base[from]?.count ?? 0
      const land = (base[to]?.count ?? 0) + (destCounter[to] ?? 0)
      destCounter[to] = (destCounter[to] ?? 0) + 1
      return {
        color: "player",
        startX: fromMeta.cx,
        startY: stackY(fromMeta.top, fromIndex),
        endX: toMeta.cx,
        endY: stackY(toMeta.top, land),
      }
    })

    const destinations = moves.map(([, to]) => to)
    return { baseChips, flyers, overflow, destinations }
  }, [moves])

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => clearTimeout(t))
    timers.current = []
  }, [])

  const runCycle = useCallback(() => {
    clearTimers()
    // reset to origin instantly (no transition)
    setAnimate(false)
    setMoved(false)
    // glide forward
    timers.current.push(
      window.setTimeout(() => {
        setAnimate(true)
        setMoved(true)
      }, 550),
    )
    // hold, then loop
    timers.current.push(window.setTimeout(() => runCycle(), 550 + 850 + 1700))
  }, [clearTimers])

  useEffect(() => {
    if (reduced) {
      // show final position, no motion
      setAnimate(false)
      setMoved(true)
      return
    }
    if (!inView) {
      clearTimers()
      return
    }
    runCycle()
    return clearTimers
  }, [inView, reduced, runCycle, clearTimers])

  const replay = () => {
    if (reduced) return
    runCycle()
  }

  const d = compact ? 6.6 : 6 // checker diameter as % of board width

  // 24 triangles for orientation
  const triangles = []
  for (let p = 1; p <= 24; p++) {
    const { cx, top } = pointMeta(p)
    const light = p % 2 === 0
    triangles.push(
      <div
        key={p}
        className="absolute"
        style={{
          left: `${cx - STEP / 2}%`,
          width: `${STEP}%`,
          top: top ? "0%" : "55%",
          height: "45%",
          background: light
            ? "var(--color-point-light)"
            : "var(--color-point-dark)",
          clipPath: top
            ? "polygon(0 0, 100% 0, 50% 100%)"
            : "polygon(50% 0, 0 100%, 100% 100%)",
          opacity: 0.95,
        }}
        aria-hidden="true"
      />,
    )
  }

  return (
    <div className={className}>
      <div
        ref={ref}
        className="relative overflow-hidden rounded-lg"
        style={{
          aspectRatio: "7 / 5",
          background: "var(--color-board)",
          border: "4px solid var(--color-board-frame)",
        }}
        role="img"
        aria-label="Animated diagram showing the recommended opening play"
      >
        {triangles}

        {/* center bar */}
        <div
          className="absolute top-0 h-full"
          style={{
            left: `${LEFT0 - STEP / 2 + 6 * STEP}%`,
            width: `${RIGHT0 - STEP / 2 - (LEFT0 - STEP / 2 + 6 * STEP)}%`,
            background: "var(--color-bar)",
          }}
          aria-hidden="true"
        />

        {/* travel paths */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {flyers.map((f, i) => (
            <line
              key={i}
              x1={f.startX}
              y1={f.startY}
              x2={f.endX}
              y2={f.endY}
              stroke="var(--color-primary)"
              strokeWidth={0.8}
              strokeDasharray="2 2"
              strokeLinecap="round"
              style={{
                opacity: moved ? 0.55 : 0.15,
                transition: "opacity 0.5s ease",
              }}
            />
          ))}
        </svg>

        {/* destination pulse rings */}
        {destinations.map((p, i) => {
          const { cx, top } = pointMeta(p)
          const y = stackY(top, 0)
          return (
            <div
              key={`pulse-${i}`}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                left: `${cx}%`,
                top: `${y}%`,
                width: `${d * 1.5}%`,
                aspectRatio: "1",
                border: "2px solid var(--color-primary)",
                opacity: moved ? 1 : 0,
                animation: moved ? "pulse 1.6s ease-in-out infinite" : "none",
                transition: "opacity 0.4s ease",
              }}
              aria-hidden="true"
            />
          )
        })}

        {/* static checkers */}
        {baseChips.map((c) => (
          <Checker
            key={c.key}
            color={c.color}
            d={d}
            style={{ left: `${c.x}%`, top: `${c.y}%` }}
          />
        ))}

        {/* overflow counts */}
        {overflow.map((o, i) => (
          <span
            key={`ov-${i}`}
            className="absolute -translate-x-1/2 -translate-y-1/2 font-mono font-bold text-card"
            style={{
              left: `${o.x}%`,
              top: `${o.y}%`,
              fontSize: "clamp(7px, 1.6vw, 11px)",
              zIndex: 15,
            }}
            aria-hidden="true"
          >
            +{o.n}
          </span>
        ))}

        {/* flying checkers */}
        {flyers.map((f, i) => (
          <Checker
            key={`flyer-${i}`}
            color={f.color}
            d={d}
            style={{
              left: `${moved ? f.endX : f.startX}%`,
              top: `${moved ? f.endY : f.startY}%`,
              zIndex: 20,
              boxShadow: moved
                ? "inset 0 1px 1px rgba(255,255,255,0.3), 0 1px 2px rgba(0,0,0,0.45)"
                : "inset 0 1px 1px rgba(255,255,255,0.4), 0 6px 10px rgba(0,0,0,0.4)",
              // NOTE: centering is handled by the Tailwind `-translate-x-1/2
              // -translate-y-1/2` classes (which use the standalone `translate`
              // CSS property in Tailwind v4). The inline transform must ONLY
              // scale — adding translate here double-shifts the checker so it
              // lands off the point.
              transform: `scale(${moved ? 1 : 1.12})`,
              transition: animate
                ? "left 0.85s cubic-bezier(0.34, 1.2, 0.64, 1), top 0.85s cubic-bezier(0.34, 1.2, 0.64, 1), transform 0.85s ease, box-shadow 0.85s ease"
                : "none",
            }}
          />
        ))}
      </div>

      {showReplay && !reduced && (
        <button
          type="button"
          onClick={replay}
          className="mt-2 inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-background/10 px-3 py-1.5 text-xs font-semibold text-card-foreground/80 transition-colors hover:bg-background/20"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          Replay move
        </button>
      )}
    </div>
  )
}
