import { getRating } from "@/core/rating";
import type { RatingId } from "@/core/types";
import { assertEqual, type Suite } from "./runner";

// New tier order (high→low): Shareholder, Enjoyer, Offer, Worker,
// mer~(beast_of_burden), Joker, Volunteer, Loser.
const BOUNDARIES: { score: number; expected: RatingId }[] = [
  { score: 0, expected: "loser" },
  { score: 17, expected: "loser" },
  { score: 18, expected: "volunteer" },
  { score: 33, expected: "volunteer" },
  { score: 34, expected: "joker" },
  { score: 45, expected: "joker" },
  { score: 46, expected: "beast_of_burden" },
  { score: 57, expected: "beast_of_burden" },
  { score: 58, expected: "worker" },
  { score: 69, expected: "worker" },
  { score: 70, expected: "offer" },
  { score: 79, expected: "offer" },
  { score: 80, expected: "enjoyer" },
  { score: 89, expected: "enjoyer" },
  { score: 90, expected: "shareholder" },
  { score: 100, expected: "shareholder" },
];

export const ratingSuite: Suite = {
  name: "评级边界",
  tests: BOUNDARIES.map(({ score, expected }) => ({
    name: `分数 ${score} → ${expected}`,
    run: () => {
      assertEqual(getRating(score), expected, `getRating(${score})`);
    },
  })),
};
