import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';

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

        try {
            if (document) {
                const invalidElement = document.querySelector(':not(form).ng-invalid');
                if (invalidElement) {
                    invalidElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        } catch (err) {
            console.log(err);
        }

    }

    public onChangeCheckboxState(value: boolean, control: FormControl) {
        control.setValue(value);
    }

    public onChangeValueState(value: any, control: FormControl) {
        control.setValue(value);
    }

    public getFormGroup(control: AbstractControl) {
        return <FormGroup>control;
    }

    public getFormArray(control: AbstractControl) {
        return <FormArray>control;
    }

    public getControl(group: AbstractControl, controlName: string): FormControl {
        return <FormControl>(<FormGroup>group).controls[controlName];
    }

    protected abstract processSubmit();
}
