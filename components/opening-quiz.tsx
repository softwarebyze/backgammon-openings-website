"use client"

import { useMemo, useState } from "react"
import { Check, ExternalLink, RotateCcw, Sparkles, X } from "lucide-react"
import { Board } from "@/components/board"
import { Die } from "@/components/die"
import { OPENINGS, START_POSITION, applyMoves, type Opening } from "@/lib/openings"

const QUESTION_COUNT = 8

type Result = { openingId: string; correct: boolean; play: string }

function isLegalMove(position: typeof START_POSITION, from: number, to: number, distance: number) {
  return to === from - distance && position[from]?.color === "player" && (position[to]?.color !== "opponent" || (position[to]?.count ?? 0) < 2)
}

function legalDistractors(opening: Opening) {
  const [a, b] = opening.dice
  const results: string[] = []
  const seen = new Set([opening.play])
  for (const [first, second] of [[a, b], [b, a]]) {
    for (const from of [24, 13, 8, 6]) {
      const firstTo = from - first
      if (!isLegalMove(START_POSITION, from, firstTo, first)) continue
      const afterFirst = applyMoves(START_POSITION, [[from, firstTo]])
      for (const secondFrom of [24, 13, 8, 6, firstTo]) {
        const secondTo = secondFrom - second
        if (!isLegalMove(afterFirst, secondFrom, secondTo, second)) continue
        const play = `${secondFrom}/${secondTo} ${from}/${firstTo}`
        if (!seen.has(play)) { seen.add(play); results.push(play) }
        if (results.length === 3) return results
      }
    }
  }
  return results
}

function answerChoices(opening: Opening) {
  const distractors = legalDistractors(opening)
  const labels = ["Develop two builders", "Make a constructive split", "Run a back checker"]
  return [{ id: opening.id, play: opening.play, name: opening.name, correct: true }, ...distractors.map((play, index) => ({ id: `${opening.id}-alternative-${index}`, play, name: labels[index] ?? "Playable alternative", correct: false }))]
}

function tournamentSearchUrl(opening: Opening) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(`backgammon tournament opening ${opening.dice[0]}-${opening.dice[1]} ${opening.play}`)}`
}

export function OpeningQuiz() {
  const [round, setRound] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [history, setHistory] = useState<Result[]>([])

  const questions = useMemo(() => Array.from({ length: QUESTION_COUNT }, (_, index) => OPENINGS[(index * 2 + 1) % OPENINGS.length]), [])
  const opening = questions[round]
  const answered = selected !== null
  const correct = selected === opening?.id
  const finished = round >= QUESTION_COUNT
  const uniqueRolls = new Set(history.map((item) => item.openingId)).size
  const accuracy = history.length ? Math.round((history.filter((item) => item.correct).length / history.length) * 100) : 0

  function choose(id: string) {
    if (answered) return
    const isCorrect = id === opening.id
    setSelected(id)
    setHistory((items) => [...items, { openingId: opening.id, correct: isCorrect, play: opening.play }])
    if (isCorrect) { setScore((value) => value + 1); setStreak((value) => value + 1) } else setStreak(0)
  }
  function next() { setSelected(null); setRound((value) => value + 1) }
  function reset() { setRound(0); setSelected(null); setScore(0); setStreak(0); setHistory([]) }

  if (finished) return (
    <div className="rounded-2xl border-2 border-quiz-border bg-quiz-surface p-5 text-quiz-ink shadow-xl sm:p-8">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-quiz-accent/20 text-quiz-accent-strong"><Sparkles aria-hidden="true" /></div>
        <p className="text-sm font-bold uppercase tracking-wider text-quiz-accent-strong">Opening practice complete</p>
        <h3 className="font-heading text-3xl font-bold">You scored {score} out of {QUESTION_COUNT}</h3>
        <div className="grid w-full grid-cols-3 gap-2 text-left">
          {[{ label: "Different rolls", value: uniqueRolls }, { label: "Answered", value: history.length }, { label: "Accuracy", value: `${accuracy}%` }].map((stat) => <div key={stat.label} className="rounded-xl bg-quiz-option p-3"><p className="text-xs font-bold uppercase tracking-wide text-quiz-muted">{stat.label}</p><p className="mt-1 text-2xl font-bold text-quiz-ink">{stat.value}</p></div>)}
        </div>
        <div className="w-full text-left"><p className="mb-2 text-xs font-bold uppercase tracking-wide text-quiz-muted">This session timeline</p><div className="flex flex-wrap gap-2">{history.map((item, index) => <span key={`${item.openingId}-${index}`} className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold ${item.correct ? "bg-quiz-accent/20 text-quiz-accent-strong" : "bg-secondary/20 text-secondary"}`}><span>{index + 1}</span>{item.openingId}</span>)}</div></div>
        <button type="button" onClick={reset} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 font-semibold text-primary-foreground hover:opacity-90"><RotateCcw aria-hidden="true" data-icon="inline-start" /> Play again</button>
      </div>
    </div>
  )

  const choices = answerChoices(opening)
  const resultPosition = answered ? applyMoves(START_POSITION, opening.moves) : START_POSITION
  return (
    <div className="rounded-2xl border-2 border-quiz-border bg-quiz-surface p-4 text-quiz-ink shadow-xl sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-1"><div><p className="text-sm font-bold uppercase tracking-wider text-quiz-accent-strong">Question {round + 1} of {QUESTION_COUNT}</p><div className="mt-3 h-2 w-40 overflow-hidden rounded-full bg-quiz-option sm:w-56"><div className="h-full rounded-full bg-quiz-accent" style={{ width: `${(round / QUESTION_COUNT) * 100}%` }} /></div></div><div className="flex items-center gap-4 text-sm font-bold"><span>Score <strong className="text-quiz-accent-strong">{score}</strong></span><span>Streak <strong className="text-quiz-accent-strong">{streak}</strong></span></div></div>
      <div className="grid gap-6 pt-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:items-center">
        <div className="flex flex-col gap-4"><div className="flex flex-col gap-3 rounded-xl bg-quiz-panel p-4"><div className="text-sm font-bold text-quiz-ink">You are playing the <span className="text-checker-player">red checkers</span>.</div><div className="flex items-center justify-center gap-3 sm:justify-start"><Die value={opening.dice[0]} size={58} color="player" /><span className="font-heading text-2xl text-quiz-muted">+</span><Die value={opening.dice[1]} size={58} color="player" /><span className="ml-2 text-sm font-semibold text-quiz-muted">Your roll</span></div></div><Board position={resultPosition} highlight={answered ? opening.moves.map((move) => move[1]) : []} caption={answered ? `Best play: ${opening.play}` : "Study the starting position, then choose the best play."} /></div>
        <div className="flex flex-col gap-4"><div><p className="text-sm font-bold uppercase tracking-wider text-quiz-accent-strong">Your move</p><h3 className="mt-2 font-heading text-2xl font-bold leading-tight">Which play is best for this roll?</h3></div><div className="grid gap-3" role="group" aria-label="Opening play choices">{choices.map((choice) => { const isSelected = selected === choice.id; const isAnswer = answered && choice.correct; const isWrong = answered && isSelected && !choice.correct; return <button key={choice.id} type="button" onClick={() => choose(choice.id)} aria-pressed={isSelected} className={`flex min-h-16 items-center justify-between gap-3 rounded-xl border-2 p-4 text-left transition-all ${isAnswer ? "border-quiz-accent-strong bg-quiz-accent/20" : isWrong ? "border-secondary bg-secondary/15" : "border-quiz-border bg-quiz-option hover:border-quiz-accent-strong hover:bg-quiz-panel"}`}><span><span className="block font-mono text-base font-bold">{choice.play}</span><span className="mt-1 block text-sm font-medium text-quiz-muted">{choice.name}</span></span>{isAnswer && <Check aria-label="Correct answer" className="text-quiz-accent-strong" />}{isWrong && <X aria-label="Incorrect answer" className="text-secondary" />}</button> })}</div>{answered && <div className={`rounded-xl p-4 ${correct ? "bg-quiz-accent/15" : "bg-secondary/10"}`} role="status"><p className="font-bold">{correct ? "Correct — great read." : `Not quite. The best play is ${opening.play}.`}</p><p className="mt-2 text-sm leading-relaxed text-quiz-muted">{opening.explanation}</p><p className="mt-3 text-sm font-semibold text-quiz-ink">Theory note: {opening.alternative ?? "Look for the play that builds structure while keeping your back checkers flexible."}</p><a href={tournamentSearchUrl(opening)} target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-quiz-accent-strong underline-offset-4 hover:underline">Watch tournament examples <ExternalLink aria-hidden="true" data-icon="inline-end" /></a><button type="button" onClick={next} className="mt-4 block min-h-11 rounded-xl bg-primary px-4 font-semibold text-primary-foreground hover:opacity-90">{round === QUESTION_COUNT - 1 ? "See results" : "Next roll"}</button></div>}</div>
      </div>
    </div>
  )
}
