import * as es6promise from 'es6-promise';
import * as fetch from 'isomorphic-fetch';
import {HttpResponseError} from './error/http-response-error';
import {HttpTimeoutError} from './error/http-timeout-error';

es6promise.polyfill();

export const DEFAULT_TIMEOUT = 5000;

export interface IRequest extends Request {
    headers: any
}

export class HttpService {
    protected _baseUrl: string;
    protected _baseOptions: Partial<IRequest>;
    protected _timeoutms: number;

    constructor(baseUrl: string, options: Partial<IRequest> = {}, timeoutms: number = DEFAULT_TIMEOUT) {
        this._baseUrl = baseUrl;
        this._baseOptions = options;
        this._timeoutms = timeoutms;
    }

    protected _currentRequestCount: number = 0;

    public get currentRequestCount() {
        return this._currentRequestCount;
    }

    public async get<T>(route: string, options?: Partial<IRequest>): Promise<T> {
        return await this._request<T>(this._baseUrl + route, Object.assign({}, this._baseOptions, options,
            {method: 'get'}));
    }

    public async post<T>(route: string, body?: any, options?: Partial<IRequest>): Promise<T> {
        return await this._request<T>(this._baseUrl + route, Object.assign({}, this._baseOptions, options,
            {
                method: 'post',
                body: JSON.stringify(body)
            }));
    }

    public async put<T>(route: string, body?: any, options?: Partial<IRequest>): Promise<T> {
        return await this._request<T>(this._baseUrl + route, Object.assign({}, this._baseOptions, options,
            {
                method: 'put',
                body: JSON.stringify(body)
            }));
    }

    public async patch<T>(route: string, body?: any, options?: Partial<IRequest>): Promise<T> {
        return await this._request<T>(this._baseUrl + route, Object.assign({}, this._baseOptions, options,
            {
                method: 'patch',
                body: JSON.stringify(body)
            }));
    }

    public async delete<T>(route: string, options?: Partial<IRequest>): Promise<T> {
        return await this._request<T>(this._baseUrl + route, Object.assign({}, this._baseOptions, options,
            {method: 'delete'}));
    }

    public async requestRaw<T>(route: string, options?: Partial<IRequest>): Promise<T> {
        this._currentRequestCount++;
        try {
            return await Promise.race([
                fetch(this._baseUrl + route, Object.assign({}, this._baseOptions, options)),
                new Promise((resolve, reject) =>
                    setTimeout(() => reject(new HttpTimeoutError()), this._timeoutms)
                )
            ]);
        } catch (err) {
            this._handleError(err);
        } finally {
            this._currentRequestCount--;
        }
    }

    public async request<T>(route: string, body?: any, options?: Partial<IRequest>): Promise<T> {
        return await this._request<T>(this._baseUrl + route, Object.assign({}, this._baseOptions, options,
            {body: JSON.stringify(body)}));
    }

    protected async _request<T>(url: string, options: Partial<IRequest>): Promise<T> {
        this._currentRequestCount++;
        try {
            const response: Response = await Promise.race([
                    fetch(url, options),
                    new Promise((resolve, reject) =>
                        setTimeout(() => reject(new HttpTimeoutError()), this._timeoutms)
                    )
                ]
            );
            if (response.ok) {
                return await this._parseResponse(response);
            } else {
                this._handleError(response);
            }
        } catch (err) {
            this._handleError(err);
        } finally {
            this._currentRequestCount--;
        }
    }

    protected async _parseResponse(response: Response): Promise<any> {
        const responseText = await response.text();
        if (!responseText) {
            return null;
        }
        let responseObj;
        try {
            responseObj = JSON.parse(responseText);
        } catch {
            return responseText;
        }
        return responseObj;
    }

    protected _handleError(err: Response | Error): void {
        if (err instanceof HttpResponseError || err instanceof HttpTimeoutError) {
            throw err;
        }
        throw new HttpResponseError(err as Response);
    }
}