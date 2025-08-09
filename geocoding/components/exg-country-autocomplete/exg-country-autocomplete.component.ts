import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnDestroy, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

import { BehaviorSubject, combineLatest, first, Subject, takeUntil } from 'rxjs';

import { CountriesDispatchers } from '../../store/countries.dispatchers';
import { CountriesSelectors } from '../../store/countries.selectors';

import { Country } from '../../models/country.model';

@Component({
    selector: 'exg-country-autocomplete',
    templateUrl: './exg-country-autocomplete.component.html',
    styleUrls: ['./exg-country-autocomplete.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ExgCountryAutocompleteComponent),
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExgCountryAutocompleteComponent implements ControlValueAccessor, OnDestroy {
    @Input() value: any;
    @Input() maxlength: number;
    @Input() placeholder: string;
    @Input() validate: boolean;
    @Input() controlsToValidate: FormControl[];
    @Input() countryCode: string;
    @Input() readonly: boolean;
    @Input() styleType: 'common' | 'inline' | 'empty' | 'readonly' = 'common';
    @Input() allowNull: boolean;
    @Input() emptyDisplayValue = '-';

    @Output() readonly selectionChange = new EventEmitter<Country>();

    public isDisabled: boolean;

    public countries$ = this.countriesSelectors.countries$;
    public pending$ = this.countriesSelectors.pending$;

    public companyForSearc$ = new BehaviorSubject<Country[]>([]);

    private searchTerm$ = new BehaviorSubject<string>(null);

    private propagateChange: (_) => void;
    private propagateTouch: () => void;

    private unsubscribe$ = new Subject<boolean>();

    constructor(private changeDetectorRef: ChangeDetectorRef,
                private countriesDispatchers: CountriesDispatchers,
                private countriesSelectors: CountriesSelectors) {
        combineLatest([this.countries$, this.pending$]).pipe(first()).subscribe((res) => {
            if (!res[0].length && !res[1]) {
                this.countriesDispatchers.dispatchCountriesAction();
            }
        });

        combineLatest([this.countries$, this.searchTerm$]).pipe(takeUntil(this.unsubscribe$)).subscribe((merged) => {
            if (merged[1]?.length > 0) {
                this.companyForSearc$.next(merged[0].filter(x => x.name.toLocaleLowerCase().indexOf(merged[1].toLocaleLowerCase()) > -1));
            } else {
                this.companyForSearc$.next(merged[0]);
            }
        });
    }

    public ngOnDestroy(): void {
        this.unsubscribe$.next(true);
        this.unsubscribe$.complete();
    }

    public onSearchPlace($event: string) {
        this.searchTerm$.next($event);
    }

    public onSelectionChange($event: Country) {
        this.value = $event;

        if (this.propagateTouch) {
            this.propagateTouch();
        }
        if (this.propagateChange) {
            this.propagateChange(this.value);
        }

        this.selectionChange.emit($event);
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

    public countryDisplayValueFunction(item) {
        return item.name;
    }

    public setDisabledState?(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
    }
}
