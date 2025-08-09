import { ExgDialogResultEvent } from '../../components/common/exg-dialog/shared/exg-dialog-result-event.model';

export class ShowHeaderForSettingsAction {
    static readonly type = '[Header] ShowHeaderForSettings';

    constructor(public payload: { show: boolean }) { }
}

export class LanguageChangeAction {
    static readonly type = '[Footer] LanguageChange';

    constructor(public payload: { culture: string }) { }
}

export class CurrencyChangeAction {
    static readonly type = '[Footer] CurrencyChange';

    constructor(public payload: { currency: string }) { }
}

export class LangCurrencyChange {
    static readonly type = '[Footer] LanguageAndCurrencyChange';

    constructor(public payload: { culture: string, currency: string }) { }
}

export class OpenDialogAction {
    static readonly type = '[Components] ToggleDialogAction';
    //@ts-ignore
    constructor(public payload: { showDialog, componentData }) { }
}

export class CloseDialogAction {
    static readonly type = '[Components] CloseDialogAction';

    constructor(public payload: ExgDialogResultEvent) { }
}

export class DialogResetAction {
    static readonly type = '[Components] DialogResetAction';
}