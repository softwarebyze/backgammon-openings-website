"use client"

import { useMemo, useState } from "react"
import { Check, RotateCcw, Sparkles, X } from "lucide-react"
import { Board } from "@/components/board"
import { Die } from "@/components/die"
import { OPENINGS, START_POSITION, applyMoves, type Opening } from "@/lib/openings"

const QUESTION_COUNT = 8

function answerChoices(opening: Opening, index: number) {
  const pool = OPENINGS.filter((candidate) => candidate.id !== opening.id)
  const choices = [opening, pool[(index * 3) % pool.length], pool[(index * 3 + 5) % pool.length], pool[(index * 3 + 9) % pool.length]]
  return choices
}

export function OpeningQuiz() {
  const [round, setRound] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)

  const questions = useMemo(() => {
    return Array.from({ length: QUESTION_COUNT }, (_, index) => OPENINGS[(index * 2 + 1) % OPENINGS.length])
  }, [])
  const opening = questions[round]
  const answered = selected !== null
  const correct = selected === opening.id
  const finished = round >= QUESTION_COUNT

  function choose(id: string) {
    if (answered) return
    setSelected(id)
    if (id === opening.id) {
      setScore((value) => value + 1)
      setStreak((value) => value + 1)
    } else {
      setStreak(0)
    }
  }

  function next() {
    setSelected(null)
    setRound((value) => value + 1)
  }

  function reset() {
    setRound(0)
    setSelected(null)
    setScore(0)
    setStreak(0)
  }

  if (finished) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-xl sm:p-10">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Sparkles aria-hidden="true" />
          </div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Opening practice complete</p>
          <h3 className="font-heading text-3xl font-bold sm:text-4xl">You scored {score} out of {QUESTION_COUNT}</h3>
          <p className="max-w-lg leading-relaxed text-muted-foreground">
            {score >= 7 ? "Sharp work. Your opening instincts are ready for the match."
              : score >= 5 ? "Solid foundation. A few more rounds will make these plays automatic."
              : "Every missed roll is useful practice. Run it back and build the pattern."}
          </p>
          <button type="button" onClick={reset} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            <RotateCcw aria-hidden="true" data-icon="inline-start" /> Play again
          </button>
        </div>
      </div>
    )
  }

  const choices = answerChoices(opening, round)
  const resultPosition = answered ? applyMoves(START_POSITION, opening.moves) : START_POSITION

  return (
    <div className="rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-xl sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Question {round + 1} of {QUESTION_COUNT}</p>
          <div className="mt-3 h-2 w-40 overflow-hidden rounded-full bg-muted sm:w-56" aria-label={`${round} of ${QUESTION_COUNT} questions complete`}>
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(round / QUESTION_COUNT) * 100}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm font-semibold">
          <span>Score <strong className="text-primary">{score}</strong></span>
          <span>Streak <strong className="text-primary">{streak}</strong></span>
        </div>
      </div>

      <div className="grid gap-6 pt-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:items-center">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center gap-3 rounded-xl bg-background/60 p-4 sm:justify-start">
            <Die value={opening.dice[0]} size={58} />
            <span className="font-heading text-2xl text-muted-foreground">+</span>
            <Die value={opening.dice[1]} size={58} />
            <span className="ml-2 text-sm text-muted-foreground">Your opening roll</span>
          </div>
          <Board position={resultPosition} highlight={answered ? opening.moves.map((move) => move[1]) : []} caption={answered ? `Best play: ${opening.play}` : "Study the starting position, then choose the best play."} />
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Your move</p>
            <h3 className="mt-2 font-heading text-2xl font-bold leading-tight">Which play is best for this roll?</h3>
          </div>
          <div className="grid gap-3" role="group" aria-label="Opening play choices">
            {choices.map((choice) => {
              const isSelected = selected === choice.id
              const isAnswer = answered && choice.id === opening.id
              const isWrong = answered && isSelected && !isAnswer
              return (
                <button key={choice.id} type="button" onClick={() => choose(choice.id)} aria-pressed={isSelected} className={`flex min-h-16 items-center justify-between gap-3 rounded-xl border p-4 text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${isAnswer ? "border-primary bg-primary/15" : isWrong ? "border-secondary bg-secondary/15" : "border-border bg-background/45 hover:border-primary/70 hover:bg-primary/5"}`}>
                  <span>
                    <span className="block font-mono text-base font-bold">{choice.play}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">{choice.name}</span>
                  </span>
                  {isAnswer && <Check aria-label="Correct answer" className="text-primary" />}
                  {isWrong && <X aria-label="Incorrect answer" className="text-secondary" />}
                </button>
              )
            })}
          </div>
          {answered && (
            <div className={`rounded-xl border p-4 ${correct ? "border-primary/50 bg-primary/10" : "border-secondary/50 bg-secondary/10"}`} role="status">
              <p className="font-semibold">{correct ? "Correct — great read." : `Not quite. The best play is ${opening.play}.`}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{opening.explanation}</p>
              <button type="button" onClick={next} className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-primary px-4 font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">{round === QUESTION_COUNT - 1 ? "See results" : "Next roll"}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
