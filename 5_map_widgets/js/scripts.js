ymaps.ready(init);

var myMap,
    collectionMarkers;  

function init(){     
    myMap = new ymaps.Map("map", {
        center: [55.76, 37.64],
        controls: ['default', 'routeButtonControl', 'geolocationControl'],
        zoom: 7
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
        console.log('lat:', coords[0], 'lng:', coords[1]);

        var id = 'id_' + Date.now() + coords[0].toFixed(2) + coords[1].toFixed(2); 
        var placemark = new ymaps.Placemark([coords[0], coords[1]], {id: id});    
        collectionMarkers.add(placemark);  

        addToStoragePoint({
            lat: coords[0],
            lng: coords[1],
            id: id
        });       
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
        //console.log(prop, points[prop]['lat'], points[prop]['lng']);
        var placemark = new ymaps.Placemark([points[prop]['lat'], points[prop]['lng']]);         
        collectionMarkers.add(placemark);        
    }
};


