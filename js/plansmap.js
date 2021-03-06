var _ = require('underscore');
var singleminded = require('./singleminded');

var map,
    lotsLayer,
    highlightedLotLayer,
    lastFilters = {};

function unHighlightLot() {
    map.closePopup();
    highlightedLotLayer.clearLayers();           
    singleminded.forget('highlightLot_centroid');
    singleminded.forget('highlightLot_geometry');
}

module.exports = {

    init: function (id) {
        map = L.map(id, {
            maxZoom: 18,
            minZoom: 10,
            zoomControl: false
        });

        L.control.zoom({ position: 'bottomleft' }).addTo(map);

        L.tileLayer('http://{s}.tiles.mapbox.com/v3/{mapId}/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>, Imagery &copy; <a href="http://mapbox.com">Mapbox</a>',
            mapId: 'urbanreviewer.idebc7lb',
            maxZoom: 18
        }).addTo(map);

        cartodb.createLayer(map, {
            cartodb_logo: false,
            user_name: 'urbanreviewer',
            type: 'cartodb',
            sublayers: [{
                cartocss: '#lots{ polygon-fill: #FFFFFF; polygon-opacity: 0.7; line-color: #000; line-width: 0.25; line-opacity: 0.75; }',
                interactivity: 'block, lot, plan_name, borough',
                sql: 'SELECT l.*, p.name AS plan_name, p.borough AS borough FROM lots l LEFT JOIN plans p ON l.plan_id = p.cartodb_id'
            }]
        })
        .addTo(map)
        .done(function (layer) {
            lotsLayer = layer.getSubLayer(0);
            lotsLayer.setInteraction(true);
            layer.on('featureClick', function (e, latlng, pos, data, sublayerIndex) {
                map.fire('planlotclick', data);
            });

            layer.on('featureOver', function (e, latlng, pos, data) {
                // Update mouse cursor when over a feature
                $('#' + map._container.id).css('cursor', 'pointer');
                data.latlng = latlng;
                map.fire('planlotover', data);
            });
            layer.on('featureOut', function (e, latlng, pos, data) {
                // Reset mouse cursor when no longer over a feature
                var grabStyle = 'cursor: grab; cursor: -moz-grab; cursor: -webkit-grab;';
                $('#' + map._container.id).attr('style',  grabStyle);
                map.fire('planlotout', data);
            });

            map.addLayer(layer, false);
        });

        highlightedLotLayer = L.geoJson(null, {
            style: function (feature) {
                return {
                    color: '#F0F564',
                    fillOpacity: 1,
                    weight: 1
                };
            }
        }).addTo(map);

        return map;
    },

    setActiveArea: function (map, options) {
        options = options || {};
        var activeAreaOptions = {
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            height: '100%'
        }

        if (options.area === 'half') {
            activeAreaOptions.right = '50%';
        }

        if (options.area === 'most') {
            activeAreaOptions.right = '25%';
        }

        map.setActiveArea(activeAreaOptions);
    },

    filterLotsLayer: function (filters, extendLastFilters) {
        var sql = "SELECT l.*, p.name AS plan_name, p.borough AS borough " +
            "FROM lots l LEFT JOIN plans p ON l.plan_id = p.cartodb_id ",
            whereConditions = [];

        if (extendLastFilters === undefined || extendLastFilters === true) {
            filters = _.extend(lastFilters, filters);
        }

        if (filters.start) {
            whereConditions.push("p.adopted >= '" + filters.start + "-01-01'");
        }
        if (filters.end) {
            whereConditions.push("p.adopted <= '" + filters.end + "-01-01'");
        }

        if (filters.active) {
            whereConditions.push("p.expires > '" + new Date().toISOString() + "'");
        }

        if (filters.expired) {
            whereConditions.push("p.expires <= '" + new Date().toISOString() + "'");
        }

        if (filters.lastUpdated) {
            var year = parseInt(filters.lastUpdated);
            if (year) {
                whereConditions.push("p.updated >= '" + year + "-01-01'");
                whereConditions.push("p.updated < '" + (year + 1) + "-01-01'");
            }
        }

        if (whereConditions.length > 0) {
            sql += ' WHERE ' + whereConditions.join(' AND ');
        }
        lotsLayer.setSQL(sql);
        lastFilters = filters;
    },

    highlightLot: function (options) {
        unHighlightLot();

        var url = 'http://urbanreviewer.cartodb.com/api/v2/sql?q=',
            sql = 'SELECT ST_Centroid(l.the_geom) AS the_geom ' +
                'FROM lots l LEFT JOIN plans p ON p.cartodb_id = l.plan_id ';
            whereConditions = [],
            options = options || {};
        if (options.block) {
            whereConditions.push('l.block = ' + options.block);
        }
        if (options.borough) {
            whereConditions.push("p.borough = '" + options.borough + "'");
        }
        if (options.lot) {
            whereConditions.push('l.lot = ' + options.lot);
        }
        if (options.plan_name) {
            whereConditions.push("p.name = '" + options.plan_name + "'");
        }
        sql += ' WHERE ' + whereConditions.join(' AND ');

        // Get centroid
        singleminded.remember('highlightLot_centroid', 
            $.get(url + sql + '&format=GeoJSON', function (data) {
                var coords = data.features[0].geometry.coordinates,
                    latlng = [coords[1], coords[0]];
                map.openPopup('block: ' + options.block + ', lot: ' + options.lot, latlng);
            })
        );

        // Get geometry
        var geometrySql = 'SELECT l.the_geom AS the_geom ' +
                'FROM lots l LEFT JOIN plans p ON p.cartodb_id = l.plan_id ';
        geometrySql += ' WHERE ' + whereConditions.join(' AND ');
        singleminded.remember('highlightLot_geometry', 
            $.get(url + geometrySql + '&format=GeoJSON', function (data) {
                highlightedLotLayer.addData(data);           
            })
        );
    },

    unHighlightLot: unHighlightLot

};
