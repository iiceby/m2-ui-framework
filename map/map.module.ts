import { NgModule } from '@angular/core';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';


import { ExgMapComponent } from './components/exg-map/exg-map.component';
import { SharedBurnsUIModule } from 'burns-ui-framework/shared/shared.module';

@NgModule({
    imports: [
        SharedBurnsUIModule,
        LeafletModule
    ],
    declarations: [
        ExgMapComponent
    ],
    exports: [
        ExgMapComponent
    ]
})
export class MapModule {
}
