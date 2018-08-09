export class HttpError extends Error {
    protected _response: Response;

    get response() {
        return this._response;
    }

    constructor(response: Response) {
        super('HTTP_ERROR');
        this._response = response;
    }
}