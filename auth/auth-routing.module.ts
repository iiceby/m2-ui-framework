import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthComponent } from './auth.component';
import { LoginContainer } from './login/login.container';
import { ResetPasswordContainer } from './reset-password/reset-password.container';

import { LoginResolver } from './shared/login.resolver';
import { ResetPasswordResolver } from './shared/reset-password.resolver';

import { RoutingConfig } from '../shared/routing.config';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            component: AuthComponent,
            children: [
                {
                    path: '',
                    component: LoginContainer,
                    resolve: { data: LoginResolver }
                },
                {
                    path: RoutingConfig.routes.auth.resetPassword.route,
                    component: ResetPasswordContainer,
                    resolve: { data: ResetPasswordResolver }
                }
            ]
        }
    ])]
})
export class AuthRoutingModule { }
