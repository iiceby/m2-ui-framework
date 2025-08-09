import { NgModule } from '@angular/core';


import { VersionRoutingModule } from './version-routing.module';

import { IconsComponent } from './icons/icons.component';
import { StylingComponent } from './styling/styling.component';


import { VersionComponent } from './version.component';
import { SharedBurnsUIModule } from 'burns-ui-framework/shared/shared.module';

@NgModule({
    imports: [
        SharedBurnsUIModule,
        VersionRoutingModule
    ],
    declarations: [
        IconsComponent,
        VersionComponent,
        StylingComponent
    ],
    providers: [
    ]
})
export class VersionModule { }
