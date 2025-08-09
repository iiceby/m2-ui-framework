import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ErrorsComponent } from './errors.component';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            component: ErrorsComponent
        }
    ])]
})
export class ErrorsRoutingModule { }
