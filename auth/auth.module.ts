import { NgModule } from '@angular/core';

import { AuthRoutingModule } from '../auth/auth-routing.module';
import { AuthComponent } from './auth.component';
import { SharedModule } from '../../burns-ui-framework/shared/shared.module';

import { ExgLoginComponent } from './login/exg-login.component';
import { LoginContainer } from './login/login.container';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ResetPasswordContainer } from './reset-password/reset-password.container';

@NgModule({
    imports: [
        AuthRoutingModule,
        SharedModule
    ],
    declarations: [
        ExgLoginComponent,
        LoginContainer,
        AuthComponent,
        ResetPasswordComponent,
        ResetPasswordContainer
    ],
    providers: []
})
export class AuthModule { }
