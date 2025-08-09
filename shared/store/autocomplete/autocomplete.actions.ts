export class AutocompleteAction {
    static readonly type = '[Autocomplete Component] GetAutocomplete';

    constructor(public payload: string) { }
}

export class AutocompleteSuccessAction {
    static readonly type = '[Autocomplete Component] GetAutocomplete Success';

    constructor(public payload: any[]) { }
}

export class AutocompleteResetAction {
    static readonly type = '[Autocomplete Component] GetAutocomplete Reset';
}
