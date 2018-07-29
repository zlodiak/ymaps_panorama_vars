ymaps.ready(init);

var myMap,
    collectionMarkers,
    currCoords = [55.76, 37.64];

function init(){     
    myMap = new ymaps.Map("map", {
        center: currCoords,
        controls: [],
        zoom: 18
    });  

    collectionMarkers = new ymaps.GeoObjectCollection({}); 
    myMap.geoObjects.add(collectionMarkers);
    renderPoints();

    circle = new ymaps.Circle([currCoords, 30], null, { fill: false, outline: true });
    myMap.geoObjects.add(circle);

    myMap.events.add('actionend', function (e) {       
        circle.geometry.setCoordinates(myMap.getCenter());

        var markersInMap = ymaps.geoQuery(collectionMarkers);
    

        var markersInsideCircle = markersInMap.searchInside(circle);
        markersInsideCircle.setOptions('preset', 'islands#redIcon');
        markersInMap.remove(markersInsideCircle).setOptions('preset', 'islands#blueIcon');

        markersInsideCircle.each(m => {
            var id = m.properties.get('id');
            console.log(id)
        });
    }); 
};

function renderPoints() {
    var points = {
        "id_153278592594955.7637.64": {
            "lat": 55.7600272230672,
            "lng": 37.639074637889834
        },
        "id_153278592629655.7637.64": {
            "lat": 55.7608590300007,
            "lng": 37.639176561832414
        },
        "id_153278592665455.7637.64": {
            "lat": 55.760786436650726,
            "lng": 37.64125795602798
        },
        "id_153278592776655.7637.64": {
            "lat": 55.75999697520659,
            "lng": 37.64103265047072
        },
        "id_153278592922155.7637.64": {
            "lat": 55.76020568496519,
            "lng": 37.64076442956922
        },
        "id_153278593075055.7637.64": {
            "lat": 55.76006352046883,
            "lng": 37.64091968536358
        },
        "id_153278593143255.7637.64": {
            "lat": 55.759981851267455,
            "lng": 37.64115035533884
        }
    };
    for(var prop in points) {
        var opt = { id: prop };
        var placemark = new ymaps.Placemark([points[prop]['lat'], points[prop]['lng']], opt);         
        collectionMarkers.add(placemark);        
    }
};


