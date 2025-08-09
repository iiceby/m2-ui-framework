import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { ErrorObject } from '../../../models/common/error-object.model';

import { formErrorAnimation } from './exg-form-error.animation';

@Component({
    selector: 'exg-form-error',
    templateUrl: './exg-form-error.component.html',
    styleUrls: ['./exg-form-error.component.scss'],
    animations: [...formErrorAnimation],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExgFormErrorComponent implements OnChanges {
    ngOnChanges(changes: SimpleChanges): void {
       if(changes.error && this.error) {
        console.log(this.error)
       }
    }
    @Input() error: string | ErrorObject;
}
