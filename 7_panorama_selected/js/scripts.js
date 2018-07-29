ymaps.ready(init);

var myMap,
    collectionMarkers,
    myMapElem = document.getElementById('map'),
    player1Elem = document.getElementById('player1'),
    selectedMarker;

function init(){     
    myMap = new ymaps.Map("map", {
        center: [55.76, 37.64],
        controls: ['default', 'routeButtonControl', 'geolocationControl'],
        zoom: 18
    });
    // myMap.controls.add('default');
    // myMap.controls.add('zoomControl'); 

    var panoramaButton = new ymaps.control.Button({
        data: {
            content: "моя кнопка",
        }
    });
    myMap.controls.add(panoramaButton, {
        float: 'none',
        position: {
            top: 250,
            right: 10
        }
    });    

    collectionMarkers = new ymaps.GeoObjectCollection({}); 
    myMap.geoObjects.add(collectionMarkers);
    renderSavedPoints();

    myMap.events.add('click', function (e) {
        var coords = e.get('coords');    
        var id = 'id_' + Date.now() + coords[0].toFixed(2) + coords[1].toFixed(2); 
        var placemark = new ymaps.Placemark([coords[0], coords[1]], {id: id});    
        collectionMarkers.add(placemark);  

        console.log('lat:', coords[0], 'lng:', coords[1], 'id', id);

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
        console.log('selectedMarker', selectedMarker);       
         
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
    //console.log('addToStoragePoint start', pointObj);
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
                    'player1', panoramas[0], { direction: [256, 16] }
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


