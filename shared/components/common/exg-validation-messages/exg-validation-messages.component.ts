import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { validationAppearAnimation } from './exg-validation-messages.animations';

@Component({
    selector: 'exg-validation-messages',
    templateUrl: 'exg-validation-messages.component.html',
    styleUrls: ['exg-validation-messages.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [...validationAppearAnimation]
})
export class ExgValidationMessagesComponent implements OnInit, OnChanges, OnDestroy {

    @Input() controls: AbstractControl[];
    @Input() validate: boolean;
    @Input() showErrors: boolean;

    public errors: { key: string, errors: { error: string, param?: any }[] }[] = [];

    private unsubscribe = new Subject();

    constructor(private changeDetectorRef: ChangeDetectorRef) { }

    public ngOnInit() {
        for (const key in this.controls) {
            if (this.controls.hasOwnProperty(key)) {
                const control = this.controls[key];
                control.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
                    if (this.validate) {
                        this.refreshErrors(key);
                        this.changeDetectorRef.markForCheck();
                    }
                });
            }
        }
    }

    public translate(word: string) {
        switch(word){
            case 'This is a mandatory field.': return 'Это обязательное поле'
        }

        return word
    }

    public ngOnChanges(changes: SimpleChanges) {
        //@ts-ignore
        if (changes.validate) {
            if (this.validate) {
                for (const key in this.controls) {
                    if (this.controls.hasOwnProperty(key)) {
                        this.refreshErrors(key);
                    }
                }
            }
        }
    }

    public ngOnDestroy(): void {
        this.unsubscribe.next(true);
        this.unsubscribe.complete();
    }

    public trackByErrors(_: number, item: { key: string, errors: { error: string, param?: any }[] }) {
        return item.key;
    }

    public trackByKeyErrors(_: number, item: { error: string, param?: any }) {
        return item.error;
    }

    private refreshErrors(key: string) {
        //@ts-ignore
        const errs = this.controls[key].errors ? Object.entries(this.controls[key].errors) : [];
        if (errs[0]) {
            const data = errs.map(err => this.getDisplayError(err));
            this.errors = this.errors.filter(err => err.key !== key);
            this.errors.push({ key, errors: data });
        } else {
            this.errors = this.errors.filter(err => err.key !== key);
        }
    }

    // tslint:disable-next-line:cyclomatic-complexity
    private getDisplayError(error: any): { error: string, param?: any } {
        switch (error[0]) {
            case 'required':
                return { error: 'This is a mandatory field.' };
            case 'isItEmail':
                return { error: 'Incorrect email.' };
            case 'isItPhone':
                return { error: 'Incorrect phone number.' };
            case 'isItPassword':
                return { error: 'The password must contain only digits and letters.' };
            case 'isItPasswordOnlyDigits':
                return { error: 'The password must contain at least one letter.' };
            case 'isItPasswordOnlyLetters':
                return { error: 'The password must contain at least one digit.' };
            case 'minPasswordLength':
                return { error: 'The password must contain at least 6 characters.' };
            case 'minlength':
                return { error: 'The field must contain at least {{value}} characters.', param: { value: error[1].requiredLength } };
            case 'maxlength':
                return { error: 'The field must contain no more than {{value}} characters.', param: { value: error[1].requiredLength } };
            case 'min':
                return { error: 'The field value cannot be less than {{min}}.', param: { min: error[1].min } };
            case 'max':
                return { error: 'The field value cannot be more than {{max}}.', param: { max: error[1].max } };
            case 'pattern':
                return { error: 'Incorrect field format.' };
            case 'isItInteger':
                return { error: 'This field can contain only digits.' };
            case 'isItText':
                return { error: 'Incorrect field format.' };
            case 'passwordEqualConfirm':
                return { error: 'Passwords don\'t match.' };
            case 'emailEqualConfirm':
                return { error: 'Emails don\'t match.' };
            case 'emailUniqueConfirm':
                return { error: 'Duplicate emails found.' };
            case 'langsUniqueConfirm':
                return { error: 'Duplicate languages found.' };
            case 'phonesUniqueConfirm':
                return { error: 'Dublicate phones found.' };
            case 'badFullName':
                return { error: 'The field must contain both first and last name.' };
            case 'placeAddress':
                return { error: 'Address must contain street and house number.' };
            case 'regionAddress':
                return { error: 'Address must contain country and region.' };
            case 'membersMaxCountConfirm':
                return { error: 'The number of members cannot be more than {{count}}', param: { count: error[1].count } };
            case 'leastOneLetter':
                return { error: 'The field must contain at least one letter.' };
            case 'overlapDates':
                return { error: 'Should not overlap dates.' };
            case 'isItUrl':
                return { error: 'The field must contain a link.' };
            case 'textValidator':
                return { error: error[1].text };
            default:
                return { error: 'Incorrect field format.' };
        }
    }
}
