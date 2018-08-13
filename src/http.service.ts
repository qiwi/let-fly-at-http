import * as es6promise from 'es6-promise';
import * as fetch from 'isomorphic-fetch';
import {HttpError} from './error/http-error';

es6promise.polyfill();

export class HttpService {
    protected _baseUrl: string;
    protected _baseOptions: Request;

    constructor(baseUrl: string, options: any = {}) {
        this._baseUrl = baseUrl;
        this._baseOptions = options;
    }

    protected _currentRequestCount: number = 0;

    public get currentRequestCount() {
        return this._currentRequestCount;
    }

    public async get<T>(route: string, options?: Request): Promise<T> {
        return await this._request<T>(this._baseUrl + route, Object.assign({}, this._baseOptions, options,
            {method: 'get'}));
    }

    public async post<T>(route: string, body?: any, options?: Request): Promise<T> {
        return await this._request<T>(this._baseUrl + route, Object.assign({}, this._baseOptions, options,
            {
                method: 'post',
                body: JSON.stringify(body)
            }));
    }

    public async put<T>(route: string, body?: any, options?: Request): Promise<T> {
        return await this._request<T>(this._baseUrl + route, Object.assign({}, this._baseOptions, options,
            {
                method: 'put',
                body: JSON.stringify(body)
            }));
    }

    public async patch<T>(route: string, body?: any, options?: Request): Promise<T> {
        return await this._request<T>(this._baseUrl + route, Object.assign({}, this._baseOptions, options,
            {
                method: 'patch',
                body: JSON.stringify(body)
            }));
    }

    public async delete<T>(route: string, options?: Request): Promise<T> {
        return await this._request<T>(this._baseUrl + route, Object.assign({}, this._baseOptions, options,
            {method: 'delete'}));
    }

    public async requestRow<T>(route: string, options?: Request): Promise<T> {
        return await this._request<T>(this._baseUrl + route, Object.assign({}, this._baseOptions, options));
    }

    public async request<T>(route: string, body?: any, options?: Request): Promise<T> {
        return await this._request<T>(this._baseUrl + route, Object.assign({}, this._baseOptions, options,
            {body: JSON.stringify(body)}));
    }

    protected async _request<T>(url: string, options: Request): Promise<T> {
        this._currentRequestCount++;
        try {
            const response: Response = await fetch(url, options);
            if (response.ok) {
                return await response.json();
            } else {
                this._handleError(response);
            }
        } catch (err) {
            if (err instanceof HttpError) {
                return;
            }
            this._handleError(err);
        } finally {
            this._currentRequestCount--;
        }
    }

    protected _handleError(response: Response): void {
        throw new HttpError(response);
    }
}