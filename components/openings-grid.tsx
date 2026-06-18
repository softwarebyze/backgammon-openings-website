import { Die } from "@/components/die"
import { MoveAnimation } from "@/components/move-animation"
import { OPENINGS, type Tier } from "@/lib/openings"

const TIER_STYLES: Record<Tier, string> = {
  Excellent: "bg-secondary text-secondary-foreground",
  "Very good": "bg-primary text-primary-foreground",
  Good: "bg-primary/80 text-primary-foreground",
  Average: "bg-muted text-muted-foreground",
  Awkward: "bg-muted text-muted-foreground",
}

export function OpeningsGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {OPENINGS.map((o) => (
        <article
          key={o.id}
          className="flex flex-col rounded-2xl bg-card p-5 text-card-foreground shadow-md"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Die value={o.dice[0]} size={34} />
              <Die value={o.dice[1]} size={34} />
            </div>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${TIER_STYLES[o.tier]}`}
            >
              {o.tier}
            </span>
          </div>
          <h3 className="mt-4 font-heading text-lg font-bold">{o.name}</h3>
          <p className="font-mono text-lg font-bold text-secondary">{o.play}</p>
          <div className="mt-3">
            <MoveAnimation moves={o.moves} compact />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-card-foreground/75">
            {o.explanation}
          </p>
        </article>
      ))}
    </div>
  )
}
