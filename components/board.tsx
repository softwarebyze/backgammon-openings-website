import type { Position } from "@/lib/openings"

// Layout: single-player view, player moves 24 -> 1, home board bottom-right.
const TOP_POINTS = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
const BOTTOM_POINTS = [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]

function Checker({ color }: { color: "player" | "opponent" }) {
  return (
    <div
      className="rounded-full ring-1 shadow-sm"
      style={{
        width: "clamp(14px, 4.4vw, 26px)",
        height: "clamp(14px, 4.4vw, 26px)",
        background:
          color === "player"
            ? "radial-gradient(circle at 35% 30%, oklch(0.62 0.18 30), var(--color-checker-player))"
            : "radial-gradient(circle at 35% 30%, oklch(0.32 0.02 60), var(--color-checker-opponent))",
        boxShadow: "inset 0 1px 1px rgba(255,255,255,0.25), 0 1px 2px rgba(0,0,0,0.4)",
      }}
      aria-hidden="true"
    />
  )
}

function Point({
  index,
  top,
  data,
  highlight,
}: {
  index: number
  top: boolean
  data?: { color: "player" | "opponent"; count: number }
  highlight?: boolean
}) {
  // alternate triangle colors
  const light = index % 2 === 0
  const fill = light ? "var(--color-point-light)" : "var(--color-point-dark)"
  const clip = top
    ? "polygon(0 0, 100% 0, 50% 92%)"
    : "polygon(50% 8%, 0 100%, 100% 100%)"

  const count = data?.count ?? 0
  const visible = Math.min(count, 5)

  return (
    <div className="relative flex flex-1 flex-col" style={{ minWidth: 0 }}>
      {/* triangle */}
      <div
        className="absolute inset-0"
        style={{ background: fill, clipPath: clip, opacity: 0.95 }}
        aria-hidden="true"
      />
      {highlight && (
        <div
          className="absolute inset-0"
          style={{
            background: "var(--color-primary)",
            clipPath: clip,
            opacity: 0.55,
            animation: "pulse 1.6s ease-in-out infinite",
          }}
          aria-hidden="true"
        />
      )}
      {/* checkers */}
      <div
        className={`absolute inset-x-0 z-10 flex flex-col items-center gap-0.5 ${
          top ? "top-1" : "bottom-1 flex-col-reverse"
        }`}
      >
        {Array.from({ length: visible }).map((_, i) => (
          <Checker key={i} color={data!.color} />
        ))}
        {count > 5 && (
          <span className="text-[10px] font-bold text-card">+{count - 5}</span>
        )}
      </div>
    </div>
  )
}

export function Board({
  position,
  highlight = [],
  caption,
}: {
  position: Position
  highlight?: number[]
  caption?: string
}) {
  const hl = new Set(highlight)
  return (
    <figure className="w-full">
      <div
        className="rounded-xl p-2 sm:p-3"
        style={{ background: "var(--color-board-frame)" }}
      >
        {/* top numbers (13-24) */}
        <div className="mb-1 flex text-[9px] font-medium text-primary/70 sm:text-[10px]">
          <div className="flex flex-1">
            {TOP_POINTS.slice(0, 6).map((p) => (
              <span key={p} className="flex-1 text-center">
                {p}
              </span>
            ))}
          </div>
          <div className="w-4 shrink-0 sm:w-6" />
          <div className="flex flex-1">
            {TOP_POINTS.slice(6).map((p) => (
              <span key={p} className="flex-1 text-center">
                {p}
              </span>
            ))}
          </div>
        </div>
        <div
          className="flex overflow-hidden rounded-md"
          style={{ background: "var(--color-board)" }}
        >
          {/* left half */}
          <div className="flex flex-1 flex-col">
            <div className="flex h-32 sm:h-40">
              {TOP_POINTS.slice(0, 6).map((p) => (
                <Point key={p} index={p} top data={position[p]} highlight={hl.has(p)} />
              ))}
            </div>
            <div className="flex h-32 sm:h-40">
              {BOTTOM_POINTS.slice(0, 6).map((p) => (
                <Point key={p} index={p} top={false} data={position[p]} highlight={hl.has(p)} />
              ))}
            </div>
          </div>
          {/* bar */}
          <div className="w-4 shrink-0 sm:w-6" style={{ background: "var(--color-bar)" }} />
          {/* right half */}
          <div className="flex flex-1 flex-col">
            <div className="flex h-32 sm:h-40">
              {TOP_POINTS.slice(6).map((p) => (
                <Point key={p} index={p} top data={position[p]} highlight={hl.has(p)} />
              ))}
            </div>
            <div className="flex h-32 sm:h-40">
              {BOTTOM_POINTS.slice(6).map((p) => (
                <Point key={p} index={p} top={false} data={position[p]} highlight={hl.has(p)} />
              ))}
            </div>
          </div>
        </div>
        {/* bottom numbers (1-12) */}
        <div className="mt-1 flex text-[9px] font-medium text-primary/70 sm:text-[10px]">
          <div className="flex flex-1">
            {BOTTOM_POINTS.slice(0, 6).map((p) => (
              <span key={p} className="flex-1 text-center">
                {p}
              </span>
            ))}
          </div>
          <div className="w-4 shrink-0 sm:w-6" />
          <div className="flex flex-1">
            {BOTTOM_POINTS.slice(6).map((p) => (
              <span key={p} className="flex-1 text-center">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-xs text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
