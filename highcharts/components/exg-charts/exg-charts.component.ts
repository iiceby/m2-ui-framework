import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { Chart } from 'angular-highcharts';

@Component({
    selector: 'exg-charts',
    templateUrl: './exg-charts.component.html',
    styleUrls: ['./exg-charts.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExgChartsComponent implements OnChanges {

    @Input() options: Highcharts.Options;

    public chart: Chart;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.options && this.options) {
            this.chart = new Chart(this.options);
        }
    }
}
