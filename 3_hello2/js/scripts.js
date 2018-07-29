ymaps.ready(init);

var myMap,
    collectionMarkers;    

function init(){     
    myMap = new ymaps.Map("map", {
        center: [55.76, 37.64],
        controls: [],
        zoom: 7
    });    

    ymaps.borders.load('RU').then(function (geojson) {
        var regions = ymaps.geoQuery(geojson);
        regions.addToMap(myMap);
    });
    
    var myPlacemark = new ymaps.Placemark([55.76, 37.64], {        
        hintContent: 'Содержимое всплывающей подсказки',
        balloonContent: 'Содержимое балуна',
    }, {
        preset: 'islands#redIcon',
    });   
    
    myMap.geoObjects.add(myPlacemark);
};



