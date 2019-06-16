export class HttpResponseError extends Error {
    static readonly ERROR_CODE = 'HTTP_RESPONSE_ERROR';
    protected _response: any;

    get response() {
        return this._response;
    }

    constructor(response: any) {
        super(HttpResponseError.ERROR_CODE);
        Object.setPrototypeOf(this, HttpResponseError.prototype);
        this._response = response;
    }
}