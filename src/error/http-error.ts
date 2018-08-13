export interface IErrorData {
    response?: Response;
    error?: any
}

export class HttpError extends Error {
    protected _response: Response;
    protected _error: any;

    get response() {
        return this._response;
    }

    get error() {
        return this._error;
    }

    constructor(data: IErrorData) {
        super('HTTP_ERROR');
        Object.setPrototypeOf(this, HttpError.prototype);
        this._response = data.response;
        this._error = data.error;
    }
}