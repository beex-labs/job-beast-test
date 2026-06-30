// 集中错误码（指南 §8.6）。

export const ERROR_CODES = {
  SCORE_INPUT: "E_SCORE_INPUT",
  SCORE_CALCULATION: "E_SCORE_CALCULATION",
  SHARE_INVALID: "E_SHARE_INVALID",
  RATING_SUBMIT: "E_RATING_SUBMIT",
  RATING_SUMMARY: "E_RATING_SUMMARY",
  CANVAS_EXPORT: "E_CANVAS_EXPORT",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export class WorkZooError extends Error {
  code: ErrorCode;
  constructor(code: ErrorCode, message?: string) {
    super(message ?? code);
    this.code = code;
    this.name = "WorkZooError";
  }
}
