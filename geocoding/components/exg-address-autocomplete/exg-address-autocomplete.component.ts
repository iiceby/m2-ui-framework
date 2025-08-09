import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

import { LanguageService } from '../../../../burns-ui-framework/shared/services/common/language-service.service';

import { GeocodingDispatchers } from '../../store/geocoding.dispatchers';
import { GeocodingSelectors } from '../../store/geocoding.selectors';

import { Geocoding } from '../../models/geocoding.model';

import { LocaleUtils } from '../../../../burns-ui-framework/shared/utils/locale-utils';


@Component({
    selector: 'exg-address-autocomplete',
    templateUrl: './exg-address-autocomplete.component.html',
    styleUrls: ['./exg-address-autocomplete.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ExgAddressAutocompleteComponent),
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExgAddressAutocompleteComponent implements ControlValueAccessor {
    @Input() maxlength: number;
    @Input() placeholder: string;
    @Input() validate: boolean;
    @Input() controlsToValidate: FormControl[];
    @Input() countryCode: string;
    @Input() readonly: boolean;
    @Input() styleType: 'common' | 'inline' | 'empty' | 'readonly' = 'common';
    @Input() allowNull: boolean;
    @Input() emptyDisplayValue = '-';

    public value: any;
    public isDisabled: boolean;

    public places$ = this.geocodingSelectors.places$;

    private propagateChange: (_) => void;
    private propagateTouch: () => void;

    constructor(private changeDetectorRef: ChangeDetectorRef,
                private languageService: LanguageService,
                private geocodingDispatchers: GeocodingDispatchers,
                private geocodingSelectors: GeocodingSelectors) {}

    public addressDisplayValueFunction(item: Geocoding) {
        return `${item.fullName || item.name || ''} ${item.text || ''}`;
    }

    public onSearchPlace($event: string) {
        this.value = {
            ...(this.value || {}),
            text: this.value && this.value.id ? $event?.replace(this.value.fullName, '').replace(this.value.name, '').trim() : $event?.trim()
        };

        const countryCode = this.countryCode || LocaleUtils.parseCountryFromCulture(this.languageService.retrieveLanguage());
        this.geocodingDispatchers.dispatchGeocodingAction(countryCode, $event);
    }

    public onSelectionChange($event: Geocoding) {
        this.value = $event;
        this.geocodingDispatchers.dispatchGeocodingResetAction();

        if (this.propagateTouch) {
            this.propagateTouch();
        }
        if (this.propagateChange) {
            this.propagateChange(this.value);
        }
    }

    public writeValue(value: string) {
        this.value = value;
        this.changeDetectorRef.markForCheck();
    }

    public registerOnChange(fn) {
        this.propagateChange = fn;
    }

    public registerOnTouched(fn) {
        this.propagateTouch = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
    }
}
