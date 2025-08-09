import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { DevDelayInterceptor } from './dev-delay-interceptor';
import { DevErrorsHandlingInterceptor } from './dev-errors-handling-interceptor';
import { HeadersInterceptor } from './headers-interceptor';
import { LoggingInterceptor } from './logging-interceptor';

export const httpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: HeadersInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: DevErrorsHandlingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: DevDelayInterceptor, multi: true }
];
