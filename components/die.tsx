"use client"

const PIPS: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
}

export function Die({
  value,
  size = 44,
  selected = false,
  interactive = false,
  onClick,
}: {
  value: number
  size?: number
  selected?: boolean
  interactive?: boolean
  onClick?: () => void
}) {
  const pips = PIPS[value] ?? []
  const pad = Math.round(size * 0.16)
  const cell = (size - pad * 2) / 3
  const pip = Math.round(cell * 0.62)

  const content = (
    <div
      className="rounded-[22%]"
      style={{
        width: size,
        height: size,
        padding: pad,
        boxSizing: "border-box",
        background:
          "linear-gradient(145deg, oklch(0.97 0.02 80), oklch(0.88 0.03 78))",
        boxShadow: selected
          ? "0 0 0 3px var(--color-primary), inset 0 1px 2px rgba(255,255,255,0.6)"
          : "inset 0 1px 2px rgba(255,255,255,0.6), 0 2px 4px rgba(0,0,0,0.3)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(3, 1fr)",
          width: "100%",
          height: "100%",
        }}
      >
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {pips.includes(i) && (
              <span
                style={{
                  display: "block",
                  width: pip,
                  height: pip,
                  borderRadius: "9999px",
                  background: "oklch(0.28 0.03 44)",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )

  if (interactive) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`Die showing ${value}${selected ? ", selected" : ""}`}
        aria-pressed={selected}
        className="rounded-[22%] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-95"
      >
        {content}
      </button>
    )
  }
  return content
}
