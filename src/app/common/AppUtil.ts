import * as moment from 'moment';

export class AppUtil {
    public static COLOR_SCHEME = {
        domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA',
        /* vivid */'#647c8a', '#3f51b5', '#2196f3', '#00b862', '#afdf0a', '#a7b61a', '#f3e562', '#ff9800', '#ff5722', '#ff4514',
        /* ocean */ '#1D68FB', '#33C0FC', '#4AFFFE', '#AFFFFF', '#FFFC63', '#FDBD2D', '#FC8A25', '#FA4F1E', '#FA141B', '#BA38D1',
         /* natural */ '#bf9d76', '#e99450', '#d89f59', '#f2dfa7', '#a5d7c6', '#7794b1', '#afafaf', '#707160', '#ba9383', '#d9d5c3',
        /* nightLights */ '#4e31a5', '#9c25a7', '#3065ab', '#57468b', '#904497', '#46648b', '#32118d', '#a00fb3', '#1052a2', '#6e51bd', '#b63cc3', '#6c97cb', '#8671c1', '#b455be', '#7496c3'
        ]
    };

    public static populateChartColors(lookupColors: LookupColors, series: any[]): string[] {
        var colors: string[] = [];
        for (var seriesIdx = 0; seriesIdx < series.length; seriesIdx++) {
            var seriesItem = series[seriesIdx];
            var color = "";
            if (!lookupColors.lookup[seriesItem.name]) {
                color = AppUtil.COLOR_SCHEME.domain[lookupColors.colorIdx];
                lookupColors.lookup[seriesItem.name] = color;
                lookupColors.colorIdx++;
            }
            else {
                color = lookupColors.lookup[seriesItem.name];
            }
            colors.push(color);
        }
        return colors;
    }

    public static getTodayFormattedString(format: string) {
        var now = new Date();
        var output = moment(now).format(format);
        return output;
    }
    
    public static dictionaryToArray(lookup: any) {
        var array = [];
        for (var key in lookup) {
            var value = lookup[key];
            array.push(value);
        }
        return array;
    }

    public static getLocalStorage(key: string): any {
        var output = null;
        var bufferString = localStorage.getItem(key);
        if (bufferString) {
            output = JSON.parse(bufferString);
        }
        return output;
    }

    public static setLocalStorage(key: string, buffer: any): void {
        var data = JSON.stringify(buffer);
        localStorage.setItem(key, data);
    }
}

export interface LookupColors {
    lookup: any;
    colorIdx: number;
}
