import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { ExgFormComponent } from '../../../burns-ui-framework/shared/components/abstract/exg-form.component';

import { CustomValidators } from '../../../burns-ui-framework/shared/validators/custom.validators';
import { RoutingConfig } from '../../shared/routing.config';
import { ErrorObject } from '../../shared/models/common/error-object.model';

@Component({
    selector: 'auth-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordComponent extends ExgFormComponent {
    @Input() resetRequestSent: boolean;
    @Input() pending: boolean;
    @Input() error: string | ErrorObject;

    @Output() readonly resetPassword = new EventEmitter<string>();

    public email: FormControl;
    public routes = RoutingConfig.routes;

    constructor(private formBuilder: FormBuilder) {
        super();
        this.email = this.formBuilder.control(null, [Validators.required, Validators.maxLength(32), CustomValidators.shouldBeEmail]);
        this.mainForm = formBuilder.group({ email: this.email });
    }

    protected processSubmit() {
        this.resetPassword.emit(this.mainForm.value.email.trim());
    }
}
