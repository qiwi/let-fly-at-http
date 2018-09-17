export class HttpTimeoutError extends Error {
    static readonly ERROR_CODE = 'HTTP_TIMEOUT_ERROR';
    constructor() {
        super(HttpTimeoutError.ERROR_CODE);
        Object.setPrototypeOf(this, HttpTimeoutError.prototype);
    }
}