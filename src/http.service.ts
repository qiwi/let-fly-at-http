import * as es6promise from 'es6-promise';
import * as fetch from 'isomorphic-fetch';
import {HttpError, IErrorData} from './error/http-error';

es6promise.polyfill();

export interface IErrorHandler {
    (error: HttpError): void | Promise<void>
}

export class HttpService {
    protected _baseUrl: string;
    protected _baseOptions: Request;
    protected _errorHandler: IErrorHandler;

    constructor(baseUrl: string, options: any = {}, errorHandler?: IErrorHandler) {
        this._baseUrl = baseUrl;
        this._baseOptions = options;
        this._errorHandler = errorHandler;
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
        let response: Response;
        let error: any;
        try {
            response = await fetch(url, options);
            if (response.ok) {
                return await response.json();
            }
        } catch (err) {
            error = err;
        } finally {
            this._currentRequestCount--;
        }
        await this._handleError({response, error});
    }

    protected async _handleError(data: IErrorData): Promise<void> {
        const error = new HttpError(data);
        if (typeof this._errorHandler === 'function') {
            const promise = this._errorHandler(error);
            if(promise instanceof Promise) {
                await promise;
            }
        } else {
            throw error;
        }
    }
}