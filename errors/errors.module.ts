import { NgModule } from '@angular/core';

import { ErrorsRoutingModule } from './errors-routing.module';

import { ErrorsComponent } from './errors.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    imports: [
        ErrorsRoutingModule,
        SharedModule
    ],
    declarations: [
        ErrorsComponent
    ],
    providers: []
})
export class ErrorsModule { }
