define([
    "dojo/_base/declare",
    "dojo/io-query",
    "esri",
    "esri/geometry",
    "esri/tasks/locator",
    "esri/utils"
],
function (declare, ioQuery, esri) {
    var Widget = declare("modules.WURadarLayer", esri.layers.DynamicMapServiceLayer, {
        constructor: function (apiKey) {
            this.key = apiKey;
            this.spatialReference = new esri.SpatialReference({
                wkid: 4326
            });
            this.loaded = true;
            this.onLoad(this);
        },
        getImageUrl: function (extent, width, height, callback) {
            var _self = this;
            if (this.updateTimeout) {
                clearTimeout(this.updateTimeout);
            }
            this.updateTimeout = setTimeout(function () {
                var minPoint = esri.geometry.webMercatorToGeographic(new esri.geometry.Point(extent.xmin, extent.ymin, new esri.SpatialReference({
                    wkid: 102100
                })));
                var maxPoint = esri.geometry.webMercatorToGeographic(new esri.geometry.Point(extent.xmax, extent.ymax, new esri.SpatialReference({
                    wkid: 102100
                })));
                var params = {
                    minlat: Math.round(minPoint.y * 1000) / 1000, // may be issues with url length, round to correct
                    maxlat: Math.round(maxPoint.y * 1000) / 1000,
                    minlon: Math.round(minPoint.x * 1000) / 1000,
                    maxlon: Math.round(maxPoint.x * 1000) / 1000,
                    newmaps: 0,
                    width: width,
                    height: height,
                    rainsow: 1,
                    smooth: 1,
                    timelabel: 1,
                    'timelabel.x': 5,
                    'timelabel.y': height - 5,
                    num: 6,
                    delay: 30
                };
                callback('http://api.wunderground.com/api/' + _self.key + '/animatedradar/image.gif?' + ioQuery.objectToQuery(params));
            }, 3000);
        }
    });
    return Widget;
});