// Autogenerated file

import { Inject, Service, Token } from '~/ioc'
import { IApiService } from './IApiService'
import { ApiServiceClientError } from './errors/ApiServiceClientError'
import { ApiServiceErrorsCodes } from './errors/ApiServiceErrorsCodes'
import { ApiServiceRequireError } from './errors/ApiServiceRequireError'
import { ApiServiceServerError } from './errors/ApiServiceServerError'
import { ApiServiceError } from './errors/ApiServiceError'
import { HttpServiceToken, IHttpService, IHttpRequestConfig, IHttpPromise } from '~/services/http'

import { Product } from './definitions/Product'

import { OrderItems } from './definitions/OrderItems'

import { OrderItem } from './definitions/OrderItem'

import { IOrderParams } from './params/IOrderParams'

import { IGetProductsListResponse } from './responses/IGetProductsListResponse'

export const ApiServiceToken = new Token<IApiService>()

@Service(ApiServiceToken)
export class ApiService implements IApiService {
    constructor(
        @Inject(HttpServiceToken) private http: IHttpService
    ) { }

    getProductsList(params?: void | null, config?: IHttpRequestConfig): IHttpPromise<IGetProductsListResponse> {

        let path = '/products'
        let body

        const queryParams = {}
        const headers = {}

        return this.request(path, 'get', headers, queryParams, body, config)
            .catch(this.onError({

            }))
    }

    order(params: IOrderParams, config?: IHttpRequestConfig): IHttpPromise<void> {

        let path = '/order'
        let body

        const queryParams = {}
        const headers = {}

        this.checkRequire(params, 'body', 'order')

        body = params['body']

        return this.request(path, 'post', headers, queryParams, body, config)
            .catch(this.onError({

                400: { message: 'Incorrect input data', code: 'INCORRECT_INPUT_DATA' },

                404: { message: 'Some products not found', code: 'SOME_PRODUCTS_NOT_FOUND' }

            }))
    }

    protected checkRequire(params: { [k: string]: any }, name: string, operationId: string): void {
        if (params[name] === undefined) {
            throw new ApiServiceRequireError('Missing required parameter ' + name + ' when calling ' + operationId + '"')
        }
    }

    protected request(url: string, method: string, headers: any, params: any, data: any, externalConfig?: IHttpRequestConfig) {
        return this.http.request(Object.assign(
            { baseURL: 'https://my-json-server.typicode.com/0pt1m1z3r/vue-test' },
            externalConfig,
            { url, method, headers, params, data }
        ))
    }

    protected onError(handlers) {
        return (e) => {
            if (e && e.response && e.response.status && e.response.status >= 400 && e.response.status < 500) {
                const errorData = handlers[e.response.status] || {}
                const message = errorData.message || 'Undefined client error'
                const code = errorData.code || 'UNDEFINED_CLIENT_ERROR'
                throw new ApiServiceClientError(message, e, ApiServiceErrorsCodes[code])
            }
            if (e && e.response && e.response.status && e.response.status >= 500) {
                throw new ApiServiceServerError('Server error', e)
            }
            if (e && e.code === 'ECONNABORTED') {
                throw new ApiServiceError('Connection aborted', e)
            }
            if (e && !e.response) {
                throw new ApiServiceError('Network error', e)
            }
            throw new ApiServiceError('Unexpected error', e)
        }
    }

    protected applyPathParams(path, pathParams) {
        for (const key of Object.keys(pathParams)) {
            path = path.replace('{' + key + '}', pathParams[key].toString())
        }
        return path
    }

    protected encodeFormComponents(formData) {
        return [...formData.entries()]
            .map((e) => encodeURIComponent(e[0]) + '=' + encodeURIComponent(e[1]))
            .join('&')
    }
}
