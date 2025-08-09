export class DrawMapEditFeatureAction {
    static readonly type = '[DrawMapEdit API] GetDrawMapEdit Feature';

    constructor(public payload: any) { }
}

export class DrawMapEditFeatureChangedAction {
    static readonly type = '[DrawMapEdit API] GetDrawMapEdit FeatureChanged';

    constructor(public payload: any) { }
}

export class DrawMapEditBackAcation {
    static readonly type = '[DrawMapEdit API] GetDrawMapEdit Back';
}

export class DrawMapEditPreviourseAcation {
    static readonly type = '[DrawMapEdit API] GetDrawMapEdit Previourse';
}

export class DrawMapEditCleanAction {
    static readonly type = '[DrawMapEdit API] GetDrawMapEdit Clean';
}

export class DrawMapEditResetAction {
    static readonly type = '[DrawMapEdit Page] GetDrawMapEdit Reset';
}
