import { Injectable } from '@angular/core';

@Injectable()
export class GraphService {

    public prepareSingleGraphData(lookupData: any, columnKey: string) {
        if (!lookupData[columnKey]) {
            var newColumnItem = {
                name: "" + columnKey,
                value: 0
            };
            lookupData[columnKey] = newColumnItem;
        }

        var columnItem = lookupData[columnKey];
        
        columnItem.value++;
    }

    public createSingleGraphSeriesData(lookupData: any) {
        var seriesData = [];

        for (var columnKey in lookupData) {
            var columnItem = lookupData[columnKey];
            seriesData.push(columnItem);
        }
        
        seriesData.sort(function (item1, item2) {
            return item1.name > item2.name ? 1 : -1;
        });
        return seriesData;
    }
    
    public prepareMultiGraphData(lookupData: any, columnKey: string, seriesKey: string) {
        if (!lookupData[columnKey]) {
            var newColumnItem = {
                name: "" + columnKey,
                series: {}
            };
            lookupData[columnKey] = newColumnItem;
        }

        var columnItem = lookupData[columnKey];
        
        if (!columnItem.series[seriesKey]) {
            var newSeriesItem = {
                name: "" + seriesKey,
                value: 0
            };
            columnItem.series[seriesKey] = newSeriesItem;
        }

        var seriesItem = columnItem.series[seriesKey];
        seriesItem.value++;
    }

    public createMultiGraphSeriesData(lookupData: any) {
        var seriesData = [];

        for (var columnKey in lookupData) {
            var columnItem = lookupData[columnKey];
            var newSeriesDataItem = {
                name: columnItem.name,
                series: []
            };
            seriesData.push(newSeriesDataItem);
            for (var seriesKey in columnItem.series) {
                var seriesItem = columnItem.series[seriesKey];
                newSeriesDataItem.series.push(seriesItem);
            }
        }
        
        seriesData.sort(function (item1, item2) {
            return item1.name > item2.name ? 1 : -1;
        });
        return seriesData;
    }
}