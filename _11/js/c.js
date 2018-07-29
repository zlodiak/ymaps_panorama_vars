ymaps.ready(init);

var map,
    collectionMarkers,
    panoramaObjects = [],
    mapElem = document.getElementById('map');

var currCoords = [55.76, 37.64],
    biggestZoom = 19,
    aimRadius = 15;

var btnsTop = 250,
    btnsRight = 10,
    btnMaxWidth = '250px',    
    btnVerticalPeriod = 40,    
    btnDeselectTimeMs = 300;

function init(){     
    map = new ymaps.Map("map", {
        center: currCoords,
        zoom: biggestZoom
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

        constructPanoramaBtns(objectsForPanorama);
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

function constructPanoramaBtns(objectsForPanorama) {
console.log(panoramaObjects)
    panoramaObjects.forEach(n => map.controls.remove(n));
    panoramaObjects = [];

    objectsForPanorama.forEach((obj, i) => {
        var panoramaButton = new ymaps.control.Button({
            data: {
                content: "смотреть панораму №" + i,
                title: 'кликните чтобы посмотреть панораму'
            }
        });
        panoramaObjects.push(panoramaButton);
        map.controls.add(panoramaButton, {
            float: 'none',
            maxWidth: btnMaxWidth,
            position: {
                top: btnsTop + (btnVerticalPeriod * i),
                right: btnsRight
            }
        });
        panoramaButton.events.add('click', () => {
            console.log('click on button', i)
            setTimeout(() => {
                panoramaButton.deselect();
            }, btnDeselectTimeMs);
        });
    });
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
        }
    };
};
