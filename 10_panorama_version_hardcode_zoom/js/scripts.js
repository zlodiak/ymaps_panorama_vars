ymaps.ready(init);

var map,
    collectionMarkers,
    mapElem = document.getElementById('map'),
    panoramaElem = document.getElementById('panorama');

var currCoords = [55.76, 37.64],
    biggestZoom = 19,
    preBiggestZoom = 18,
    aimRadius = 30;

function init(){     
    map = new ymaps.Map("map", {
        center: currCoords,
        zoom: preBiggestZoom
    });  

    collectionMarkers = new ymaps.GeoObjectCollection({}); 
    map.geoObjects.add(collectionMarkers);
    renderPoints();

    var aim = new ymaps.Circle([currCoords, aimRadius], null, { fill: false, outline: true });
    map.geoObjects.add(aim);

    map.events.add('actionend', function () {       
        aim.geometry.setCoordinates(map.getCenter());

        var markersInMap = ymaps.geoQuery(collectionMarkers);

        var markersInsideAim = markersInMap.searchInside(aim);
        markersInsideAim.setOptions('preset', 'islands#redIcon');
        markersInMap.remove(markersInsideAim).setOptions('preset', 'islands#blueIcon');

        var objectsForPanorama = [];
        markersInsideAim.each(m => {
            var id = m.properties.get('id');
            var objectForPanorama = {
                id: id,
                coords: getPoints()[id]
            };
            objectsForPanorama.push(objectForPanorama);
        });

        if (map.getZoom() === biggestZoom && objectsForPanorama.length) {
            // пока ищем панораму только для первого по порядку маркера. @TODO: этот момент нужно продумать
            findPanorama(objectsForPanorama[0].coords);
        }

        if (map.getZoom() === biggestZoom) {
            map.setZoom(preBiggestZoom);  
        }
    });
};

function renderPoints() {
    var points = getPoints();
    for(var prop in points) {
        var opt = { id: prop };
        var placemark = new ymaps.Placemark([points[prop]['lat'], points[prop]['lng']], opt);         
        collectionMarkers.add(placemark);        
    }
};

function findPanorama(coords) {
    ymaps.panorama.locate([coords.lat, coords.lng]).done(
        function (panoramas) {
            if (panoramas && panoramas.length > 0) {
                _setPanoramaVisibility(true);
                var panorama = new ymaps.panorama.Player(
                    'panorama', panoramas[0], { direction: 'auto' }
                );
                panorama.events.add('destroy', function () {
                    _setPanoramaVisibility(false);
                });
            }
        }
    );    
}

function _setPanoramaVisibility(visibility) {
    if (visibility) {
        mapElem.style.display = 'none';
        panoramaElem.style.display = 'block';
    } else {
        mapElem.style.display = 'block';
        panoramaElem.style.display = 'none';
    }    
}

function getPoints() {
    return {
        "id_153278840974655.7637.64": {
            "lat": 55.76052933411141,
            "lng": 37.640329911708825
        },
        "id_153278841020655.7637.64": {
            "lat": 55.760317601330215,
            "lng": 37.64070005655288
        },
        "id_153278926472355.7637.64": {
            "lat": 55.75960072605657,
            "lng": 37.64145107507703
        },
        "id_153281807396655.7637.64": {
            "lat": 55.75886871317579,
            "lng": 37.638578429222086
        },
        "id_153281807558255.7637.64": {
            "lat": 55.75889896191524,
            "lng": 37.63839603900909
        },
        "id_153281807636155.7637.64": {
            "lat": 55.75885056392078,
            "lng": 37.638379945754984
        },
        "id_153281807868955.7637.64": {
            "lat": 55.75907137928029,
            "lng": 37.638723268508905
        },
        "id_153281808028555.7637.64": {
            "lat": 55.76108285864214,
            "lng": 37.63797761440275
        },
        "id_153281808111055.7637.64": {
            "lat": 55.76022080881715,
            "lng": 37.63782204627989
        },
        "id_153281808579255.7637.64": {
            "lat": 55.7610102657106,
            "lng": 37.64263929367064
        },
        "id_153281808632655.7637.64": {
            "lat": 55.76118569839615,
            "lng": 37.64240325927733
        },
        "id_153281808687855.7637.64": {
            "lat": 55.76096791977122,
            "lng": 37.64244617462156
        },
        "id_153281808755055.7637.64": {
            "lat": 55.760665447432515,
            "lng": 37.64258564949035
        },
        "id_153281809052755.7637.64": {
            "lat": 55.758463377793625,
            "lng": 37.635880126953104
        },
        "id_153281809104755.7637.64": {
            "lat": 55.758935260371516,
            "lng": 37.635601177215555
        },
        "id_153281809259055.7637.63": {
            "lat": 55.760925573785634,
            "lng": 37.63277949333189
        },
        "id_153281809314955.7637.63": {
            "lat": 55.75990925627758,
            "lng": 37.631996288299554
        },
        "id_153281809375755.7637.63": {
            "lat": 55.75799148948164,
            "lng": 37.634399547576876
        },
        "id_153281809487055.7637.64": {
            "lat": 55.757465145753486,
            "lng": 37.640214576721185
        },
        "id_153281809856755.7637.64": {
            "lat": 55.7618874212123,
            "lng": 37.63596595764158
        }
    };
};
