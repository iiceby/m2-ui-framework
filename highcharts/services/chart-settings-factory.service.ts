import { Injectable } from '@angular/core';
import { LegendOptions } from 'highcharts';

@Injectable({
    providedIn: 'root'
})
export class ChartSettingsFactory {

    public static getPieSettings(title: string, legendOptions: LegendOptions, series: any[]) {
        return {
            chart: {
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: title
            },
            tooltip: {
                pointFormat: '<span style="color:{point.color}">●</span>  </div><b>{point.y}</b>',
                style: {
                    fontSize: '14px',
                    fontWeight: '400',
                    fontFamily: 'Roboto'
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    size: 250,
                    showInLegend: true
                }
            },
            legend: legendOptions,
            credits: { enabled: false },
            series
        };
    }

    public static getColumnSettings(title: string, categories: string[], yAxisTitle: string, legendOptions: LegendOptions, series: any[]) : Highcharts.Options {
        return {
            chart: {
                type: 'column'
            },
            title: {
                text: title
            },
            xAxis: {
                categories,
                crosshair: true,
                accessibility: {
                    description: null
                },
                labels: {
                    style: {
                        fontSize: '12px',
                        fontWeight: '400',
                        fontFamily: 'Roboto'
                    }
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: yAxisTitle
                },
                labels: {
                    style: {
                        fontSize: '10px',
                        fontWeight: '400',
                        fontFamily: 'Roboto'
                    }
                }
            },
            tooltip: {
                style: {
                    fontSize: '14px',
                    fontWeight: '400',
                    fontFamily: 'Roboto'
                }
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            legend: legendOptions,
            credits: { enabled: false },
            series
        };
    }

    public static getSplineSettings(title: string, categories: string[], legendOptions: LegendOptions, series: any[]) {
        return {
            chart: {
                type: 'spline'
            },
            title: {
                text: title
            },
            xAxis: {
                categories,
                labels: {
                    style: {
                        fontSize: '12px',
                        fontWeight: '400',
                        fontFamily: 'Roboto'
                    }
                }
            },
            yAxis: {
                title: {
                    text: null
                },
                labels: {
                    style: {
                        fontSize: '10px',
                        fontWeight: '400',
                        fontFamily: 'Roboto'
                    }
                }
            },
            tooltip: {
                style: {
                    fontSize: '14px',
                    fontWeight: '400',
                    fontFamily: 'Roboto'
                }
            },
            legend: legendOptions,
            plotOptions: {
                spline: {
                    enableMouseTracking: false,
                    lineWidth: 4
                }
            },
            credits: { enabled: false },
            series
        };
    }
}
