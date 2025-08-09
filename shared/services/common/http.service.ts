import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { saveAs } from 'file-saver';
import { Observable } from 'rxjs';
import { catchError, first, map, switchMap } from 'rxjs/operators';

import { TypeGuard } from '../../models/common/type-guard.interface';

import { MobileErrorsDispatchers } from '../../store/ui/mobile-errors.dispatchers';

import { AuthRefreshService } from '../business/auth-refresh.service';
import { BaseSingletonService } from './base-singleton.service';
import { DebugService } from './debug.service';
import { DialogService } from './dialog.service';

import { PlatformService } from './platform.service';
import { SnackbarService } from './snackbar.service';

import { ErrorObject } from '../../models/common/error-object.model';
import { HttpStatusCode } from '../../models/common/http-status-code.model';
import { SettingsTokens } from '../../settings-tokens.config';

import { UrlUtils } from '../../utils/url-utils';

type MethodType = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'DOWNLOAD' | 'UPLOAD';

export function parseApiErrors(err: HttpErrorResponse): ErrorObject[] {
    const apiErrs: ErrorObject[] = [];

    if(err.error.message != null) {
        apiErrs.push(new ErrorObject(err.error.message, 0, undefined, err.error.code));
    }else {
        const rawErrs = err.error && err.error.message ? err.error.errors : err.error;
        if (rawErrs) {
            for (const field in rawErrs) {
                if (rawErrs.hasOwnProperty(field) && rawErrs[field]) {
                    if (rawErrs[field] instanceof Array) {
                        for (const msg of rawErrs[field]) {
                            apiErrs.push(new ErrorObject(msg));
                        }
                    } else {
                        apiErrs.push(new ErrorObject(rawErrs[field].message, 0, undefined, rawErrs[field].code));
                    }
                }
            }
        }
    }
    return apiErrs;
}

@Injectable({
    providedIn: 'root'
})
export class HttpService extends BaseSingletonService {
    constructor(@Inject(SettingsTokens.tokens.environment) private environment: any,
                private http: HttpClient,
                private authRefreshService: AuthRefreshService,
                private debugService: DebugService,
                private snackbar: SnackbarService,
                
                private platformService: PlatformService,
                private mobileErrorsDispatchers: MobileErrorsDispatchers,
                private dialogService: DialogService) {
        super('HttpService');
    }

    public async get<T>(apiUrl: string, typeGuard?: TypeGuard | any): Promise<T> {
        return this.processRequest<T>('GET', apiUrl, null, typeGuard);
    }

    public async post<T>(apiUrl: string, data: any, typeGuard?: TypeGuard| any): Promise<T> {
        return this.processRequest<T>('POST', apiUrl, data, typeGuard);
    }

    public async put<T>(apiUrl: string, data: any, typeGuard?: TypeGuard| any): Promise<T> {
        return this.processRequest<T>('PUT', apiUrl, data, typeGuard);
    }

    public async delete(apiUrl: string): Promise<boolean> {
        return this.processRequest<boolean>('DELETE', apiUrl, null, null);
    }

    public async download<Blob>(apiUrl: string, data: any, saveAsName?: string): Promise<Blob> {
        return this.processRequest<Blob>('DOWNLOAD', apiUrl, data, null).then((blob) => {
            if (saveAsName) {
                saveAs(blob, saveAsName);
            }
            return blob;
        });
    }

    public async upload<T>(apiUrl: string, data: any): Promise<T> {
        return this.processRequest<T>('UPLOAD', apiUrl, data, null);
    }

    private async processRequest<T>(methodType: MethodType, apiUrlArg: string, data: any, typeGuard: TypeGuard| any): Promise<any> {
        const apiUrl = apiUrlArg.startsWith('http') || apiUrlArg.startsWith('<') ? apiUrlArg : UrlUtils.encodeUrl(this.environment.apiUrl + apiUrlArg);

        let requestor$: Observable<any>;

        switch (methodType) {
            case 'GET':
                requestor$ = this.http.get(apiUrl, { observe: 'response' });
                break;
            case 'POST':
                requestor$ = this.http.post(apiUrl, data, { observe: 'response' });
                break;
            case 'PUT':
                requestor$ = this.http.put(apiUrl, data, { observe: 'response' });
                break;
            case 'DELETE':
                requestor$ = this.http.delete(apiUrl, { observe: 'response' });
                break;
            case 'DOWNLOAD':
                requestor$ = this.http.post(apiUrl,data, { observe: 'response', responseType: 'blob' });
                break;
            case 'UPLOAD':
                requestor$ = this.http.put(apiUrl, data, { observe: 'response', headers: { Accept: '*/*' } });
                break;
            default:
                throw new Error('Wrong request type!');
        }

        return requestor$.pipe(
            first(),
            map(resp => this.extractData<T>(resp, methodType, typeGuard)),
            catchError((err) => {
                if (err.status === HttpStatusCode.Unauthorized) {
                    return this.authRefreshService.refresh().pipe(
                        first(),
                        switchMap(() => {
                            return requestor$.pipe(
                                first(),
                                map(resp => this.extractData<T>(resp, methodType, typeGuard)),
                                catchError((recallErr) => {
                                    throw this.handleError(recallErr);
                                })
                            );
                        }),
                        catchError((refreshErr) => {
                            throw this.handleError(refreshErr);
                        })
                    );
                }
                throw this.handleError(err);
            })
        ).toPromise();
    }

    private extractData<T>(resp: HttpResponse<T>, methodType: MethodType, typeGuard?: TypeGuard): boolean | T {
        try {
            if (resp.status < 200 || resp.status >= 300) {
                throw new Error(`Bad response status: ${resp.status}`);
            }

            switch (methodType) {
                case 'GET':
                case 'POST':
                case 'PUT':
                    if (typeGuard) {
                        if (!typeGuard.isValid(resp.body)) {
                            throw new Error('Wrong object type received.');
                        }
                    }
                    //@ts-ignore
                    return resp.body;
                case 'DELETE':
                    return resp.ok;
                case 'DOWNLOAD':
                    //@ts-ignore
                    return resp.body;
                case 'UPLOAD':
                    //@ts-ignore
                    return resp.body;
                default:
                    throw new Error('Wrong request type!');
            }
        } catch (err) {
            console.log(err);
            if (this.debugService.isDebugPopError) {
                this.dialogService.showError(`[DEV DEBUG ONLY]: ${err}`);
            }
            if (this.platformService.isMobilePlatform()) {
                //@ts-ignore
                this.mobileErrorsDispatchers.dispatchMobileErrorsAction(err.message, err);
            }
            throw err;
        }
    }

    private handleError(err: HttpErrorResponse): ErrorObject {
        if (err.status === HttpStatusCode.Forbidden) {
            this.snackbar.showError('Oops. You seem to be missing the right.');
        }

        if (this.platformService.isMobilePlatform()) {
            this.mobileErrorsDispatchers.dispatchMobileErrorsAction(err.message, err);
        }

        const apiErrors = [HttpStatusCode.BadRequest, HttpStatusCode.NotFound].some(c => c === err.status) ? parseApiErrors(err) : [];
        //@ts-ignore
        return new ErrorObject(apiErrors[0] ? null : 'An error has occurred.', err.status, apiErrors, apiErrors[0] ? apiErrors[0].apiErrorCode : undefined);
    }
}
