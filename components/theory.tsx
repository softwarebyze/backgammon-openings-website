import { Board } from "@/components/board"
import { START_POSITION, PRINCIPLES, GLOSSARY } from "@/lib/openings"

export function Theory() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
      <div>
        <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
          The theory of the opening
        </h2>
        <p className="mt-4 max-w-prose leading-relaxed text-muted-foreground">
          Backgammon begins from the same fixed position every game, so the
          best response to each of the 15 possible opening rolls has been
          studied exhaustively — first by intuition, then by neural-network
          rollouts. Almost every opening play comes down to a few competing
          ideas: <span className="text-foreground">making a point</span>,{" "}
          <span className="text-foreground">bringing down builders</span>,{" "}
          <span className="text-foreground">splitting the back checkers</span>,
          and <span className="text-foreground">running to safety</span>.
        </p>

        <dl className="mt-6 grid gap-4">
          {PRINCIPLES.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl bg-card p-5 text-card-foreground shadow-md"
            >
              <dt className="font-heading text-lg font-bold">{p.title}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-card-foreground/80">
                {p.body}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="lg:sticky lg:top-6">
        <h3 className="font-heading text-xl font-bold text-foreground">
          The starting position
        </h3>
        <p className="mb-3 mt-1 text-sm text-muted-foreground">
          Your checkers (red) travel from the 24-point around to your home
          board (points 1–6). Your opponent moves the opposite way.
        </p>
        <Board
          position={START_POSITION}
          caption="Every game starts here. You are the red checkers, moving 24 → 1."
        />

        <div className="mt-6 rounded-2xl bg-card p-5 text-card-foreground shadow-md">
          <h3 className="font-heading text-lg font-bold">Glossary</h3>
          <dl className="mt-3 grid gap-3">
            {GLOSSARY.map((g) => (
              <div key={g.term}>
                <dt className="text-sm font-bold text-secondary">{g.term}</dt>
                <dd className="text-sm leading-relaxed text-card-foreground/75">
                  {g.def}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
