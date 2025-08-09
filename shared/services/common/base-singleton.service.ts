import { Directive, OnDestroy } from '@angular/core';

@Directive()
export class BaseSingletonService implements OnDestroy {

    public static initialized = {};

    constructor(protected serviceName: string) {
        //@ts-ignore
        if (BaseSingletonService.initialized[this.serviceName]) {
            //@ts-ignore
            if (!global['__SERVER__']) {
                throw new Error(`Service already initialized! (${this.serviceName})`);
            }
        }
        //@ts-ignore
        BaseSingletonService.initialized[serviceName || this.constructor.name] = true;
    }

    public ngOnDestroy() {
        //@ts-ignore
        BaseSingletonService.initialized[this.serviceName] = false;
    }
}
