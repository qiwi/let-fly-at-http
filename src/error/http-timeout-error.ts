export class HttpTimeoutError extends Error {
    constructor() {
        super('HTTP_TIMEOUT_ERROR');
        Object.setPrototypeOf(this, HttpTimeoutError.prototype);
    }
}