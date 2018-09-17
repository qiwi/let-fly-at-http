export class HttpResponseError extends Error {
    protected _response: Response;

    get response() {
        return this._response;
    }

    constructor(response: Response) {
        super('HTTP_ERROR');
        Object.setPrototypeOf(this, HttpResponseError.prototype);
        this._response = response;
    }
}