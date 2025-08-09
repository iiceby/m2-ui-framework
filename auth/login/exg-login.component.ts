import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { ExgFormComponent } from '../../../burns-ui-framework/shared/components/abstract/exg-form.component';

import { AuthRequest } from '../../shared/models/business/auth/auth-request.model';
import { ExgCultureEnum } from '../../../burns-ui-framework/shared/models/common/exg-culture.model';
import { ErrorObject } from '../../shared/models/common/error-object.model';

import { RoutingConfig } from '../../shared/routing.config';

@Component({
    selector: 'exg-login',
    templateUrl: './exg-login.component.html',
    styleUrls: ['./exg-login.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExgLoginComponent extends ExgFormComponent {

    @Input() pending: boolean;
    @Input() error: ErrorObject | string;
    @Input() showBottomNavigation: boolean;

    @Output() readonly authenticate = new EventEmitter<AuthRequest>();
    @Output() readonly languageSelect = new EventEmitter<ExgCultureEnum>();

    public login: FormControl;
    public password: FormControl;
    public menuItems = [{ id: 1, text: 'test 1' }, { id: 2, text: 'test 2' }];

    public routes = RoutingConfig.routes;

    constructor(private formBuilder: FormBuilder) {
        super();
        this.login = this.formBuilder.control(null, [Validators.required, Validators.maxLength(320)]);
        this.password = this.formBuilder.control(null, [Validators.required, Validators.minLength(6), Validators.maxLength(64)]);
        this.mainForm = formBuilder.group({ login: this.login, password: this.password });
    }

    public processSubmit() {
        this.authenticate.emit({ login: this.mainForm.value.login, password: this.mainForm.value.password });
    }

    public onMenuItemClick(event: any) {
    }
}
