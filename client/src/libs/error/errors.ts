// utils/errors.ts
export class SessionExpiredError extends Error {
  constructor(message = "세션이 만료되었습니다.") {
    super(message);
    this.name = "SessionExpiredError";
  }
}
