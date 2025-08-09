import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PerfectScrollbarModule } from '@eklipse/perfect-scrollbar';
import { IMaskModule } from 'angular-imask';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { SharedMaterialModule } from './shared.material.module';

import { ExgBackgroundDirective } from './directives/exg-background.directive';
import { DisableCopyPasteDirective } from './directives/exg-disable-copy-paste.directive';
import { ExgDisabledDirective } from './directives/exg-disabled.directive';
import { ExgFileDropDirective } from './directives/exg-file-drop.directive';
import { ExgHoverDirective } from './directives/exg-hover.directive';
import { ExgRippleDirective } from './directives/exg-ripple.directive';
import { ExgTooltipDirective } from './directives/exg-tooltip.directive';

import { ExgAutocompleteComponent } from './components/common/exg-autocomplete/exg-autocomplete.component';
import { ExgBaseDialogComponent } from './components/common/exg-dialog/exg-base-dialog.component';
import { ExgButtonComponent } from './components/common/exg-button/exg-button.component';
import { ExgCheckBoxComponent } from './components/common/exg-checkbox/exg-checkbox.component';
import { ExgChipsInputComponent } from './components/common/exg-chips-input/exg-chips-input.component';
import { ExgChipsComponent } from './components/common/exg-chips/exg-chips.component';
import { ExgDatepickerMonthComponent } from './components/common/exg-datepicker-month/exg-datepicker-month.component';
import { ExgDatepickerRangeComponent } from './components/common/exg-datepicker-range/exg-datepicker-range.component';
import { ExgDatepickerComponent } from './components/common/exg-datepicker/exg-datepicker.component';
import { ExgDialogServiceComponent } from './components/common/exg-dialog/exg-dialog-service.component';
import { ExgDialogWrapperComponent } from './components/common/exg-dialog/exg-dialog-wrapper.component';
import { ExgDialogComponent } from './components/common/exg-dialog/exg-dialog.component';
import { ExgDropMenuComponent } from './components/common/exg-drop-menu/exg-drop-menu.component';
import { ExgEditPhotosComponent } from './components/common/exg-edit-photos/exg-edit-photos.component';
import { ExgFilesDropComponent } from './components/common/exg-files-drop/exg-files-drop.component';
import { ExgFormErrorComponent } from './components/common/exg-form-error/exg-form-error.component';
import { ExgIconComponent } from './components/common/exg-icon/exg-icon.component';
import { ExgImageEditorComponent } from './components/common/exg-image-editor/exg-image-editor.component';
import { ExgImageComponent } from './components/common/exg-image/exg-image.component';
import { ExgImgCropperComponent } from './components/common/exg-img-cropper/exg-img-cropper.component';
import { ExgMenuComponent } from './components/common/exg-menu/exg-menu.component';
import { ExgRadioButtonComponent } from './components/common/exg-radio-button/exg-radio-button.component';
import { ExgRoutingTree } from './components/common/exg-routing-tree/exg-routing-tree.component';
import { ExgSelectComponent } from './components/common/exg-select/exg-select.component';
import { ExgSnackbarServiceComponent } from './components/common/exg-snackbar/exg-snackbar-service.component';
import { ExgTextBoxComponent } from './components/common/exg-textbox/exg-textbox.component';
import { ExgTimepickerComponent } from './components/common/exg-timepicker/exg-timepicker.component';
import { ExgTree } from './components/common/exg-tree/exg-tree.component';
import { ExgValidationMessagesComponent } from './components/common/exg-validation-messages/exg-validation-messages.component';

import { ExgArrayAnyPipe } from './pipes/exg-array-any/exg-array-any.pipe';
import { ExgArrayFilterPipe } from './pipes/exg-array-filter/exg-array-filter.pipe';
import { ExgArrayMathPipe } from './pipes/exg-array-math/exg-array-math.pipe';
import { ExgCurrencyPipe } from './pipes/exg-currency/exg-currency.pipe';
import { ExgDateTzPipe } from './pipes/exg-date-tz/exg-date-tz.pipe';
import { ExgDatePipe } from './pipes/exg-date/exg-date.pipe';
import { ExgDecimalPipe } from './pipes/exg-decimal/exg-decimal.pipe';
import { ExgEnumArrayToEnumerationPipe } from './pipes/exg-enum-array-to-enumeration/exg-enum-array-to-enumeration.pipe';
import { ExgEnumToArrayPipe } from './pipes/exg-enum/exg-enum-to-array.pipe';
import { ExgOrderIdPipe } from './pipes/exg-order-id.pipe';
import { ExgPercentPipe } from './pipes/exg-percent/exg-percent.pipe';
import { ExgRideTime } from './pipes/exg-ride-time/exg-ride-time.pipe';
import { ExgSecurePipe } from './pipes/exg-secure.pipe';
import { ExgTimespanPipe } from './pipes/exg-timespan/exg-timespan.pipe';
import { ExgTranslateCut } from './pipes/exg-translate-cut.pipe';
import { ExgUrlPipe } from './pipes/exg-url/exg-url.pipe';
import { ExgWordFormsPipe } from './pipes/exg-word-forms/exg-word-forms.pipe';
import { MAT_DATE_LOCALE } from '@angular/material/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        RouterModule,

        SharedMaterialModule,

        IMaskModule,
        PerfectScrollbarModule,
        NgxMaterialTimepickerModule,
        ClipboardModule,
        ImageCropperModule
    ],

    declarations: [
        ExgArrayAnyPipe,
        ExgArrayFilterPipe,
        ExgArrayMathPipe,
        ExgCurrencyPipe,
        ExgDatePipe,
        ExgDateTzPipe,
        ExgDecimalPipe,
        ExgEnumToArrayPipe,
        ExgPercentPipe,
        ExgRideTime,
        ExgUrlPipe,
        ExgSecurePipe,
        ExgTimespanPipe,
        ExgTranslateCut,
        ExgOrderIdPipe,
        ExgWordFormsPipe,
        ExgEnumArrayToEnumerationPipe,

        ExgAutocompleteComponent,
        ExgButtonComponent,
        ExgCheckBoxComponent,
        ExgChipsComponent,
        ExgChipsInputComponent,
        ExgEditPhotosComponent,
        ExgFormErrorComponent,
        ExgIconComponent,
        ExgImageComponent,
        ExgImageEditorComponent,
        ExgMenuComponent,
        ExgSelectComponent,
        ExgDatepickerComponent,
        ExgDatepickerMonthComponent,
        ExgDatepickerRangeComponent,
        ExgRadioButtonComponent,
        ExgTextBoxComponent,
        ExgTimepickerComponent,
        ExgRoutingTree,
        ExgTree,
        ExgImgCropperComponent,
        ExgValidationMessagesComponent,
        ExgDialogComponent,
        ExgDropMenuComponent,

        ExgFilesDropComponent,

        ExgDialogWrapperComponent,

        ExgSnackbarServiceComponent,
        ExgDialogServiceComponent,
        ExgBaseDialogComponent,

        ExgDisabledDirective,
        ExgHoverDirective,
        ExgFileDropDirective,
        ExgRippleDirective,
        DisableCopyPasteDirective,
        ExgBackgroundDirective,
        ExgTooltipDirective
    ],

    // entryComponents: [
    //     ExgSnackbarServiceComponent,
    //     ExgDialogServiceComponent,
    //     ExgBaseDialogComponent
    // ],

    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        PerfectScrollbarModule,
        NgxMaterialTimepickerModule,

        ExgArrayAnyPipe,
        ExgArrayFilterPipe,
        ExgArrayMathPipe,
        ExgCurrencyPipe,
        ExgDatePipe,
        ExgDateTzPipe,
        ExgDecimalPipe,
        ExgEnumToArrayPipe,
        ExgPercentPipe,
        ExgRideTime,
        ExgUrlPipe,
        ExgSecurePipe,
        ExgTimespanPipe,
        ExgTranslateCut,
        ExgOrderIdPipe,
        ExgWordFormsPipe,
        ExgEnumArrayToEnumerationPipe,

        // ExgAutocompleteComponent,
         ExgButtonComponent,
         ExgCheckBoxComponent,
        // ExgChipsComponent,
        // ExgChipsInputComponent,
        // ExgEditPhotosComponent,
         ExgFormErrorComponent,
         ExgIconComponent,
        // ExgImageComponent,
        // ExgImageEditorComponent,
         ExgMenuComponent,
         ExgSelectComponent,
         ExgDatepickerComponent,
         ExgDatepickerMonthComponent,
         ExgDatepickerRangeComponent,
         ExgRadioButtonComponent,
         ExgTextBoxComponent,
        // ExgTimepickerComponent,
        // ExgRoutingTree,
        ExgTree,
        // ExgImgCropperComponent,
        // ExgValidationMessagesComponent,
        ExgDialogComponent,
        ExgDropMenuComponent,
        ExgDisabledDirective

        // ExgFilesDropComponent,

        // ExgDialogWrapperComponent,

        // ExgDisabledDirective,
        // ExgFileDropDirective,
        // ExgHoverDirective,
        // ExgRippleDirective,
        // DisableCopyPasteDirective,
        // ExgBackgroundDirective,
        // ExgTooltipDirective
    ],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' },
    ]
})
export class SharedCommonModule {
    static forRoot(settingsProviders: { token: string, value: any }[]): ModuleWithProviders<SharedCommonModule> {
        const providers: Provider[] = settingsProviders.map(setting => ({ provide: setting.token, useValue: setting.value }));

        return {
            ngModule: SharedCommonModule,
            providers
        };
    }
}
