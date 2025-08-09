import { FormGroup } from '@angular/forms';

import { Subject } from 'rxjs';

export abstract class ExgFormComponent {
    public mainForm: FormGroup;
    public validate$ = new Subject<boolean>();

    public onSubmit() {
        if (this.mainForm && this.mainForm.invalid) {
            this.showValidationErrors();

            return;
        }

        this.processSubmit();
    }

    public showValidationErrors() {
        this.validate$.next(true);
    }

    protected abstract processSubmit();
}
