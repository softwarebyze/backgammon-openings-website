"use client"

import { useMemo, useState } from "react"
import { Die } from "@/components/die"
import { Board } from "@/components/board"
import {
  OPENINGS,
  START_POSITION,
  applyMoves,
  findOpening,
  type Tier,
} from "@/lib/openings"

const TIER_STYLES: Record<Tier, string> = {
  Excellent: "bg-secondary text-secondary-foreground",
  "Very good": "bg-primary text-primary-foreground",
  Good: "bg-primary/80 text-primary-foreground",
  Average: "bg-muted text-muted-foreground",
  Awkward: "bg-muted text-muted-foreground",
}

const CATEGORY_LABEL: Record<string, string> = {
  "Point-making": "Make a point",
  Running: "Run / escape",
  Splitting: "Split",
  Building: "Build",
}

export function RollFinder() {
  const [die1, setDie1] = useState(3)
  const [die2, setDie2] = useState(1)

  const isDoubles = die1 === die2
  const opening = useMemo(() => findOpening(die1, die2), [die1, die2])

  const afterPosition = useMemo(() => {
    if (!opening) return START_POSITION
    return applyMoves(START_POSITION, opening.moves)
  }, [opening])

  const destinations = useMemo(
    () => (opening ? opening.moves.map((m) => m[1]) : []),
    [opening],
  )

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* controls */}
      <div className="rounded-2xl bg-card p-5 text-card-foreground shadow-lg sm:p-6">
        <h3 className="font-heading text-xl font-bold">Set your opening roll</h3>
        <p className="mt-1 text-sm text-card-foreground/70">
          Tap a value for each die. The opening roll can never be doubles.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-4">
          {[
            { val: die1, set: setDie1, label: "First die" },
            { val: die2, set: setDie2, label: "Second die" },
          ].map((d, idx) => (
            <fieldset key={idx} className="rounded-xl bg-background/5 p-3">
              <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-card-foreground/60">
                {d.label}
              </legend>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <Die
                    key={n}
                    value={n}
                    size={48}
                    interactive
                    selected={d.val === n}
                    onClick={() => d.set(n)}
                  />
                ))}
              </div>
            </fieldset>
          ))}
        </div>

        <div className="mt-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-card-foreground/60">
            Or pick a roll
          </p>
          <div className="flex flex-wrap gap-2">
            {OPENINGS.map((o) => {
              const active = !isDoubles && opening?.id === o.id
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => {
                    setDie1(o.dice[0])
                    setDie2(o.dice[1])
                  }}
                  className={`min-h-9 rounded-lg px-2.5 py-1 font-mono text-sm font-bold transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-background/10 text-card-foreground/80 hover:bg-background/20"
                  }`}
                  aria-pressed={active}
                >
                  {o.dice[0]}-{o.dice[1]}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* result */}
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl bg-card p-5 text-card-foreground shadow-lg sm:p-6">
          <div className="flex items-center gap-3">
            <Die value={die1} size={40} />
            <Die value={die2} size={40} />
            <span className="font-mono text-lg font-bold text-card-foreground/50">
              {die1}-{die2}
            </span>
          </div>

          {isDoubles ? (
            <div className="mt-4 rounded-xl bg-secondary/15 p-4">
              <p className="font-heading text-lg font-bold text-secondary">
                That&apos;s doubles.
              </p>
              <p className="mt-1 text-sm text-card-foreground/70">
                On the very first turn both players roll one die and the higher
                number goes first, so the opening roll is always two different
                numbers. Pick two different dice to see the best play.
              </p>
            </div>
          ) : opening ? (
            <div className="mt-4">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${TIER_STYLES[opening.tier]}`}
                >
                  {opening.tier}
                </span>
                <span className="rounded-full bg-background/10 px-2.5 py-0.5 text-xs font-medium text-card-foreground/70">
                  {CATEGORY_LABEL[opening.category]}
                </span>
              </div>
              <h3 className="mt-3 font-heading text-2xl font-bold">
                {opening.name}
              </h3>
              <p className="mt-1 font-mono text-xl font-bold text-secondary">
                {opening.play}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-card-foreground/80">
                {opening.explanation}
              </p>
              {opening.alternative && (
                <p className="mt-3 border-l-2 border-primary pl-3 text-sm leading-relaxed text-card-foreground/70">
                  <span className="font-semibold text-card-foreground">
                    Alternative:{" "}
                  </span>
                  {opening.alternative}
                </p>
              )}
            </div>
          ) : null}
        </div>

        {!isDoubles && opening && (
          <Board
            position={afterPosition}
            highlight={destinations}
            caption="Position after the recommended play (your checkers are red, moving 24 → 1). Highlighted points are where your checkers land."
          />
        )}
      </div>
    </div>
  )
}
