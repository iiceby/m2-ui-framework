import { NgModule } from '@angular/core';

import { NgxsModule } from '@ngxs/store';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';

import { MapModule } from '../map/map.module';



import { ExgDrawInfoComponent } from './components/exg-draw-info/exg-draw-info.component';
import { ExgDrawMapComponent } from './components/exg-draw-map/exg-draw-map.component';
import { ExgDrawToolbarComponent } from './components/exg-draw-toolbar/exg-draw-toolbar.component';

import { DrawMapEditState } from './store/draw-map-edit.reducer';
import { DrawMapState } from './store/draw-map.reducer';
import { SharedBurnsUIModule } from 'burns-ui-framework/shared/shared.module';

@NgModule({
    imports: [
        MapModule,
        SharedBurnsUIModule,
        LeafletModule,
        LeafletDrawModule,

        NgxsModule.forFeature([
            DrawMapEditState,
            DrawMapState,
        ])
    ],
    declarations: [
        ExgDrawMapComponent,
        ExgDrawToolbarComponent,
        ExgDrawInfoComponent,
    ],
    exports: [
        ExgDrawMapComponent
    ]
})
export class DrawMapModule {
}
