import { RollFinder } from "@/components/roll-finder"
import { OpeningsGrid } from "@/components/openings-grid"
import { Theory } from "@/components/theory"
import { Die } from "@/components/die"

export default function Page() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <header className="border-b border-border/60">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <span className="font-heading text-lg font-bold tracking-tight">
            Backgammon<span className="text-primary"> Openings</span>
          </span>
          <div className="hidden gap-6 text-sm font-medium text-muted-foreground sm:flex">
            <a href="#finder" className="transition-colors hover:text-foreground">
              Roll Finder
            </a>
            <a href="#openings" className="transition-colors hover:text-foreground">
              All Openings
            </a>
            <a href="#theory" className="transition-colors hover:text-foreground">
              Theory
            </a>
          </div>
        </nav>

        <div className="mx-auto max-w-6xl px-4 pb-14 pt-10 sm:px-6 sm:pt-16">
          <div className="flex items-center gap-2">
            <Die value={3} size={40} />
            <Die value={1} size={40} />
          </div>
          <h1 className="mt-6 max-w-3xl text-balance font-heading text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
            Master every backgammon opening roll.
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Learn the modern theory behind the first move, then enter any roll
            to see the best play laid out on the board — with the reasoning and
            the leading alternatives.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#finder"
              className="inline-flex min-h-11 items-center rounded-xl bg-primary px-5 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Try the Roll Finder
            </a>
            <a
              href="#theory"
              className="inline-flex min-h-11 items-center rounded-xl border border-border px-5 font-semibold text-foreground transition-colors hover:bg-card hover:text-card-foreground"
            >
              Learn the theory
            </a>
          </div>
        </div>
      </header>

      {/* Roll Finder */}
      <section id="finder" className="mx-auto max-w-6xl scroll-mt-6 px-4 py-14 sm:px-6 sm:py-20">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Roll Finder
          </p>
          <h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">
            What should I play?
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
            Enter the two dice you rolled and get the recommended opening play,
            shown directly on the board.
          </p>
        </div>
        <RollFinder />
      </section>

      {/* All openings */}
      <section
        id="openings"
        className="scroll-mt-6 border-y border-border/60 bg-board-frame/30 px-4 py-14 sm:px-6 sm:py-20"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Reference
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">
              All 15 opening rolls
            </h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
              The complete catalogue of opening plays, ranked from the powerful
              point-makers down to the awkward small rolls.
            </p>
          </div>
          <OpeningsGrid />
        </div>
      </section>

      {/* Theory */}
      <section id="theory" className="mx-auto max-w-6xl scroll-mt-6 px-4 py-14 sm:px-6 sm:py-20">
        <Theory />
      </section>

      <footer className="border-t border-border/60 px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-1 text-center text-sm text-muted-foreground">
          <p>
            Best plays reflect modern neural-network rollout consensus. Position
            and matchups can shift the right answer.
          </p>
          <p>Built for backgammon students. Roll well.</p>
        </div>
      </footer>
    </main>
  )
}
