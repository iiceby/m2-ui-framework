import { ExgBaseParamsConfig } from '../exg-params.config';

const storeConsoleLogging = !!+localStorage.getItem(ExgBaseParamsConfig.storageKeys.storageStoreConsoleLogging);

export function loggerPlugin(state, action, next) {
    if (storeConsoleLogging) {
        // tslint:disable-next-line:no-console
        console.log('state', state);
        // tslint:disable-next-line:no-console
        console.log('action', action);
    }
    return next(state, action);
}
