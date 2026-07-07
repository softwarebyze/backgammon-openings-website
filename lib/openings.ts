// Backgammon opening theory data.
// Board uses a single-player perspective: the player ("you", red checkers)
// moves from the 24-point toward the 1-point. Points are numbered 1-24.

export type Color = "player" | "opponent"

export type Position = Record<number, { color: Color; count: number }>

export type Move = [from: number, to: number]

export type Tier = "Excellent" | "Very good" | "Good" | "Average" | "Awkward"

export type Category =
  | "Point-making"
  | "Running"
  | "Splitting"
  | "Building"

export interface Opening {
  id: string
  dice: [number, number]
  name: string
  category: Category
  tier: Tier
  play: string
  moves: Move[]
  explanation: string
  alternative?: string
}

// Standard starting position (player = red, opponent = dark).
export const START_POSITION: Position = {
  // player checkers
  24: { color: "player", count: 2 },
  13: { color: "player", count: 5 },
  8: { color: "player", count: 3 },
  6: { color: "player", count: 5 },
  // opponent checkers (mirror)
  1: { color: "opponent", count: 2 },
  12: { color: "opponent", count: 5 },
  17: { color: "opponent", count: 3 },
  19: { color: "opponent", count: 5 },
}

export function applyMoves(start: Position, moves: Move[]): Position {
  const pos: Position = {}
  for (const k of Object.keys(start)) {
    const n = Number(k)
    pos[n] = { ...start[n] }
  }
  for (const [from, to] of moves) {
    if (pos[from]) {
      pos[from].count -= 1
      if (pos[from].count <= 0) delete pos[from]
    }
    if (pos[to]) {
      pos[to].count += 1
      pos[to].color = "player"
    } else {
      pos[to] = { color: "player", count: 1 }
    }
  }
  return pos
}

// The 15 non-double opening rolls with modern, rollout-informed best plays.
export const OPENINGS: Opening[] = [
  {
    id: "31",
    dice: [3, 1],
    name: "Make the golden point",
    category: "Point-making",
    tier: "Excellent",
    play: "8/5 6/5",
    moves: [
      [8, 5],
      [6, 5],
    ],
    explanation:
      "Making your 5-point — the 'golden point' — is the single strongest opening play in the game. It builds the most valuable point in your home board and is universally agreed to be the best opening roll.",
    alternative: "There is no real debate here: always make the 5-point.",
  },
  {
    id: "61",
    dice: [6, 1],
    name: "Make the bar point",
    category: "Point-making",
    tier: "Excellent",
    play: "13/7 8/7",
    moves: [
      [13, 7],
      [8, 7],
    ],
    explanation:
      "Making the bar point (7-point) gives you a three-point block on the 6, 7 and 8 points. This wall makes it much harder for your opponent's back checkers to escape.",
    alternative: "Always make the bar point.",
  },
  {
    id: "42",
    dice: [4, 2],
    name: "Make the 4-point",
    category: "Point-making",
    tier: "Very good",
    play: "8/4 6/4",
    moves: [
      [8, 4],
      [6, 4],
    ],
    explanation:
      "Making your 4-point is the clear best play. It's a valuable home-board point that strengthens both your blocking game and your priming game.",
    alternative: "Always make the 4-point.",
  },
  {
    id: "53",
    dice: [5, 3],
    name: "Make the 3-point",
    category: "Point-making",
    tier: "Very good",
    play: "8/3 6/3",
    moves: [
      [8, 3],
      [6, 3],
    ],
    explanation:
      "Modern rollouts favor making the 3-point over splitting. It's a real home-board point, though deeper and a touch less flexible than the 4- or 5-point.",
    alternative: "8/5 6/3 (two builders) is a playable but weaker alternative.",
  },
  {
    id: "65",
    dice: [6, 5],
    name: "Lover's Leap",
    category: "Running",
    tier: "Good",
    play: "24/13",
    moves: [
      [24, 18],
      [18, 13],
    ],
    explanation:
      "The famous 'Lover's Leap' — run a back checker all the way to the safety of your 13-point. It escapes a back checker with zero risk and is the best use of this roll.",
    alternative: "Always run 24/13.",
  },
  {
    id: "63",
    dice: [6, 3],
    name: "Run to the bar point",
    category: "Running",
    tier: "Good",
    play: "24/18 13/10",
    moves: [
      [24, 18],
      [13, 10],
    ],
    explanation:
      "Advance a back checker to your opponent's bar point and bring down a builder. This balances escaping with constructive development.",
    alternative: "24/15 (run one checker) is a close second choice.",
  },
  {
    id: "64",
    dice: [6, 4],
    name: "Split and build",
    category: "Splitting",
    tier: "Good",
    play: "24/18 13/9",
    moves: [
      [24, 18],
      [13, 9],
    ],
    explanation:
      "The flexible modern choice: jump a back checker to the bar point and drop a builder for your outfield points. Keeps your options open on the next roll.",
    alternative:
      "8/2 6/2 (make the 2-point) is solid but buries checkers; 24/14 (run) is also playable.",
  },
  {
    id: "62",
    dice: [6, 2],
    name: "Run to the bar point",
    category: "Running",
    tier: "Average",
    play: "24/18 13/11",
    moves: [
      [24, 18],
      [13, 11],
    ],
    explanation:
      "Jump a back checker to the bar point and add a builder with the 2. A flexible developing play.",
    alternative: "24/16 (run one checker all the way) is a close alternative.",
  },
  {
    id: "54",
    dice: [5, 4],
    name: "Split to the golden anchor",
    category: "Splitting",
    tier: "Average",
    play: "24/20 13/8",
    moves: [
      [24, 20],
      [13, 8],
    ],
    explanation:
      "Play the 4 to split to your opponent's 20-point — the 'golden anchor' spot — and the 5 to bring a checker safely down to your 8-point. A balanced, flexible developing play.",
    alternative: "24/15 (run) and 13/8 13/9 are reasonable alternatives.",
  },
  {
    id: "52",
    dice: [5, 2],
    name: "Split and bring down",
    category: "Splitting",
    tier: "Average",
    play: "24/22 13/8",
    moves: [
      [24, 22],
      [13, 8],
    ],
    explanation:
      "Make a constructive split to the 22-point and bring a checker safely down to your 8-point.",
    alternative: "13/8 13/11 (two builders down) is a close alternative.",
  },
  {
    id: "43",
    dice: [4, 3],
    name: "Split to the golden anchor",
    category: "Splitting",
    tier: "Average",
    play: "24/20 13/10",
    moves: [
      [24, 20],
      [13, 10],
    ],
    explanation:
      "Splitting to the 20-point (golden anchor spot) while adding a builder is a balanced, flexible play that several rollouts rate at the top.",
    alternative: "24/21 13/9 and 13/10 13/9 (two down) are all close.",
  },
  {
    id: "51",
    dice: [5, 1],
    name: "Bring down and split",
    category: "Building",
    tier: "Average",
    play: "13/8 24/23",
    moves: [
      [13, 8],
      [24, 23],
    ],
    explanation:
      "Bring a checker safely to your 8-point and make a small, constructive split with the ace. Slightly preferred over slotting the 5-point in modern play.",
    alternative: "13/8 6/5 (slotting the golden point) is the old-school alternative.",
  },
  {
    id: "41",
    dice: [4, 1],
    name: "Split and build",
    category: "Splitting",
    tier: "Average",
    play: "24/23 13/9",
    moves: [
      [24, 23],
      [13, 9],
    ],
    explanation:
      "Make a gentle split with the ace and bring down a builder for your 5- and 4-points. Flexible and low-risk.",
    alternative: "13/9 13/12 keeps everything back but is slightly passive.",
  },
  {
    id: "32",
    dice: [3, 2],
    name: "Split and build",
    category: "Splitting",
    tier: "Awkward",
    play: "24/21 13/11",
    moves: [
      [24, 21],
      [13, 11],
    ],
    explanation:
      "Split to the edge of your opponent's home board while adding a builder. A flexible way to handle an awkward roll.",
    alternative: "13/11 13/10 (two builders down) is a very close alternative.",
  },
  {
    id: "21",
    dice: [2, 1],
    name: "Split with the ace",
    category: "Splitting",
    tier: "Awkward",
    play: "13/11 24/23",
    moves: [
      [13, 11],
      [24, 23],
    ],
    explanation:
      "Bring down a builder and make a gentle split with the ace. Modern rollouts prefer this over the old-fashioned slot of the 5-point.",
    alternative: "13/11 6/5 (slotting the golden point) is the classic aggressive alternative.",
  },
]

export function findOpening(a: number, b: number): Opening | undefined {
  const id = [Math.max(a, b), Math.min(a, b)].join("")
  return OPENINGS.find((o) => o.id === id)
}

export const PRINCIPLES = [
  {
    title: "Make the 5-point",
    body: "Your 5-point is the 'golden point' — the most valuable point on the board. Any roll that makes it (3-1) is an automatic best play, and many opening decisions revolve around preparing to make it next turn.",
  },
  {
    title: "Point-making rolls play themselves",
    body: "Five rolls let you make an inner-board or bar point immediately: 3-1, 4-2, 6-1, 5-3 and 6-4 (via the 2-point). When you can make a good point, you almost always should.",
  },
  {
    title: "Build before you slot",
    body: "Classic theory loved 'slotting' — dropping a lone checker on the 5-point to make it next turn. Modern rollouts favor bringing down builders and splitting the back checkers instead, which is more flexible and less risky.",
  },
  {
    title: "Split your back checkers",
    body: "Advancing a back checker to a new point (a 'split') fights for key anchors like the 20-point golden anchor and prepares to escape. Small splits with non-point-making rolls keep your position flexible.",
  },
  {
    title: "Run with big doubles of the dice",
    body: "With 6-5, run a back checker to safety (the 'Lover's Leap', 24/13). With other big rolls like 6-3 and 6-2, escaping a back checker to the bar point is often best.",
  },
  {
    title: "Bring down builders",
    body: "A 'builder' is a spare checker placed in your outfield (like the 9, 10 or 11 points) that gives you numbers to make new points next turn. Good opening play stockpiles builders aimed at your 5- and 4-points.",
  },
]

export const GLOSSARY = [
  { term: "Golden point", def: "Your 5-point — the most valuable point to make in the opening." },
  { term: "Golden anchor", def: "Your opponent's 5-point (your 20-point) — the best defensive anchor to hold." },
  { term: "Bar point", def: "The 7-point. Making it completes a 3-point block on the 6, 7 and 8 points." },
  { term: "Builder", def: "A spare checker positioned to help make a new point next turn." },
  { term: "Slot", def: "Placing a single checker on a point you hope to make next turn, risking a hit." },
  { term: "Split", def: "Moving one of your two back checkers to a different point." },
  { term: "Lover's Leap", def: "The opening 6-5 play 24/13, running a back checker all the way to safety." },
  { term: "Anchor", def: "A point made deep in your opponent's home board, giving your back checkers a safe base." },
]
