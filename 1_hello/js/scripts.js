ymaps.ready(init);

var myMap,
    collectionMarkers,
    currPlacemark;    

function init(){     
    myMap = new ymaps.Map("map", {
        center: [55.76, 37.64],
        controls: [],
        zoom: 7
    });  

    collectionMarkers = new ymaps.GeoObjectCollection({}, {
        preset: "islands#redIcon"
    }); 

    myMap.geoObjects.add(collectionMarkers);

    renderSavedPoints();

    myMap.events.add('click', function (e) {
        var coords = e.get('coords');
        //console.log('lat:', coords[0], 'lng:', coords[1]);

        var id = 'id_' + Date.now() + coords[0].toFixed(2) + coords[1].toFixed(2); 
        var placemark = new ymaps.Placemark([coords[0], coords[1]], {id: id});    
        collectionMarkers.add(placemark);  

        addToStoragePoint({
            lat: coords[0],
            lng: coords[1],
            id: id
        });       
    });


    collectionMarkers.events.add('contextmenu', function(e) {
        var target = e.get('target');
        var id = target.properties.get('id');
        var baloonText = target.properties.get('balloonContent');
        var hintText = target.properties.get('hintContent');
        var baloon_close_icon = target.options.get('balloonCloseButton');

        //console.log(id, target, baloonText, hintText, baloon_close_icon);

        $('#myModal').modal('show');
        document.getElementById('myModal').setAttribute('data-point-id', id);            
        document.getElementById('baloonText').value = baloonText ? baloonText : '';            
        document.getElementById('hintText').value = hintText ? hintText : '';            
        document.getElementById('closeBtn').value = baloon_close_icon ? baloon_close_icon : '';            
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

        var opt = {                  
            id: prop,                 
            hintContent: points[prop]['hint_text'] ? points[prop]['hint_text'] : '',
            balloonContent: points[prop]['baloon_text'] ? points[prop]['baloon_text'] : ''
        };

        var opt2 = {
            hasHint: true,  
            balloonCloseButton: points[prop]['baloon_close_icon']
        };

        var placemark = new ymaps.Placemark([points[prop]['lat'], points[prop]['lng']], opt, opt2);         

        collectionMarkers.add(placemark);        
    }
};

function setPointProps() {
    var id = document.getElementById('myModal').getAttribute('data-point-id'),
        baloonText = document.getElementById('baloonText').value,
        hintText = document.getElementById('hintText').value,
        baloon_close_icon = document.getElementById('closeBtn').value;

    //console.log('setPointProps', id, baloonText, hintText, baloon_close_icon);

    var points = getPoints();
    points[id].baloon_text = baloonText;
    points[id].hint_text = hintText;
    points[id].baloon_close_icon = baloon_close_icon;
    localStorage.points = JSON.stringify(points);

    $('#myModal').modal('hide');

    renderSavedPoints();
};

