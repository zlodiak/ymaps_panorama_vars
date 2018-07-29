ymaps.ready(init);

var myMap,
    collectionMarkers,
    myMapElem = document.getElementById('map'),
    player1Elem = document.getElementById('player1'),
    selectedMarker,
    currCoords = [55.76, 37.64];

function init(){     
    myMap = new ymaps.Map("map", {
        center: currCoords,
        controls: [],
        zoom: 18
    });  

    collectionMarkers = new ymaps.GeoObjectCollection({}); 
    myMap.geoObjects.add(collectionMarkers);
    renderSavedPoints();

    circle = new ymaps.Circle([currCoords, 30], null, { fill: false, outline: true });
    myMap.geoObjects.add(circle);

    myMap.events.add('actionend', function (e) {       
        circle.geometry.setCoordinates(myMap.getCenter());

        var markersInMap = ymaps.geoQuery(collectionMarkers);

        var markersInsideCircle = markersInMap.searchInside(circle);
        markersInsideCircle.setOptions('preset', 'islands#redIcon');
        markersInMap.remove(markersInsideCircle).setOptions('preset', 'islands#blueIcon');

        var points = getPoints();
        var objectsForPanorama = [];
        markersInsideCircle.each(m => {
            var id = m.properties.get('id');
            var objectForPanorama = {
                id: id,
                coords: points[id]
            };
            objectsForPanorama.push(objectForPanorama);
        });

        if (myMap.getZoom() === 19 && objectsForPanorama.length) {
            // пока ищем панораму только для первого по порядку маркера. @TODO: этот момент нужно продумать
            findPanorama(objectsForPanorama[0].coords);
        }

        if (myMap.getZoom() === 19) {
            myMap.setZoom(18);  
        }
    });

    myMap.events.add('click', function (e) {
        var coords = e.get('coords');    
        var id = 'id_' + Date.now() + coords[0].toFixed(2) + coords[1].toFixed(2); 
        var placemark = new ymaps.Placemark([coords[0], coords[1]], {id: id});    
        collectionMarkers.add(placemark);  
        addToStoragePoint({
            lat: coords[0],
            lng: coords[1],
            id: id
        });       
    });
    
    collectionMarkers.events.add('click', function(e) {
        var target = e.get('target');
        var id = target.properties.get('id'); 
        selectedMarker = id;            
        collectionMarkers.each((m) => {
            m.options.set({
                preset: 'islands#blueIcon',
            });
        });
        e.get('target').options.set('preset', 'islands#greenIcon');    
    }); 
};

function getPoints() {
    return localStorage.points ? JSON.parse(localStorage.points) : {};
};

function addToStoragePoint(pointObj) {
    var points = getPoints();
    points[pointObj.id] = {
        lat: pointObj.lat,
        lng: pointObj.lng
    };
    localStorage.points = JSON.stringify(points);
};

function renderSavedPoints() {
    var points = getPoints();
    collectionMarkers.removeAll();
    for(var prop in points) {
        var opt = { id: prop };
        var placemark = new ymaps.Placemark([points[prop]['lat'], points[prop]['lng']], opt);         
        collectionMarkers.add(placemark);        
    }
};

function findPanorama(coords) {
    ymaps.panorama.locate([coords.lat, coords.lng]).done(
        function (panoramas) {
            if (panoramas.length > 0) {
                _setPanoramaVisibility(true);
                var player1 = new ymaps.panorama.Player(
                    'player1', panoramas[0], { direction: 'auto' }
                );
                player1.events.add('destroy', function () {
                    _setPanoramaVisibility(false);
                });
            }
        }
    );    
}

function _setPanoramaVisibility(visibility) {
    if (visibility) {
        myMapElem.style.display = 'none';
        player1Elem.style.display = 'block';
    } else {
        myMapElem.style.display = 'block';
        player1Elem.style.display = 'none';
    }    
}


