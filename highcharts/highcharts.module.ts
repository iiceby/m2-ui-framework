import { ModuleWithProviders, NgModule } from '@angular/core';

import { HIGHCHARTS_MODULES } from 'angular-highcharts';

import * as HC_more from 'highcharts/highcharts-more';
import * as HC_drilldown from 'highcharts/modules/drilldown.src';
import * as HC_solidGauge from 'highcharts/modules/solid-gauge.src';
import * as HC_variablepie from 'highcharts/modules/variable-pie.src';

import { ChartModule } from 'angular-highcharts';
import { SharedModule } from '../shared/shared.module';

import { ExgChartsComponent } from './components/exg-charts/exg-charts.component';

@NgModule({
    imports: [
        ChartModule,
        SharedModule
    ],
    declarations: [
        ExgChartsComponent
    ],
    exports: [
        ExgChartsComponent
    ]
})
export class HighchartsModule {
    static forRoot(): ModuleWithProviders<HighchartsModule> {
        return {
            ngModule: HighchartsModule,
            providers: [
                { provide: HIGHCHARTS_MODULES, useFactory: () => [HC_more, HC_solidGauge, HC_variablepie, HC_drilldown] },
            ]
        };
    }
}
