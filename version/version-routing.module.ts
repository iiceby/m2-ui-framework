import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { IconsComponent } from './icons/icons.component';
import { StylingComponent } from './styling/styling.component';
import { VersionComponent } from './version.component';

import { RoutingConfig } from '../shared/routing.config';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            component: VersionComponent
        },
        {
            path: RoutingConfig.routes.version.icons.route,
            component: IconsComponent
        },
        {
            path: RoutingConfig.routes.version.styling.route,
            component: StylingComponent
        }
    ])]
})
export class VersionRoutingModule { }
