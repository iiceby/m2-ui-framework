import { DrawAction } from '../models/draw-action.model';
import { ToolbarAction } from '../models/toolbar-action.enum';

export class DrawMapReadyAction {
    static readonly type = '[DrawMaps Page] GetDrawMap Ready';
}

export class DrawMapToolbarAction {
    static readonly type = '[DrawMaps Page] GetDrawMap Toolbar';

    constructor(public payload: ToolbarAction) { }
}

export class DrawMapDrawActionAction {
    static readonly type = '[DrawMaps Page] GetDrawMap DrawAction';

    constructor(public payload: DrawAction) { }
}


export class DrawMapResetAction {
    static readonly type = '[DrawMap Page] GetDrawMap Reset';
}
