export class HttpError extends Error {
    protected _response: Response;

    get response() {
        return this._response;
    }

    constructor(response: Response) {
        super('HTTP_ERROR');
        Object.setPrototypeOf(this, HttpError.prototype);
        this._response = response;
    }
}