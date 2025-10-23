export class SessionExpiredError extends Error {
  constructor(message = '세션이 만료되었습니다.') {
    super(message); // Error.message 초기화
    this.name = 'SessionExpiredError';
  }
}

export class NotLoggedInError extends Error {
  constructor(message = '로그인되지 않은 상태입니다.') {
    super(message);
    this.name = 'NotLoggedInError';
  }
}
