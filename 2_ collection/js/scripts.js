ymaps.ready(function() {
    var map = new ymaps.Map("map", {
            center: [55.76, 37.64], 
            zoom: 7
        });
    // Cоздаем две коллекции
    var redObjects = new ymaps.GeoObjectCollection({}, {
        preset: "islands#redCircleIcon"
    });
    var blueObjects = new ymaps.GeoObjectCollection({}, {
        preset: "islands#blueCircleIcon"
    });
    // Добавляем их на карту
    map.geoObjects.add(redObjects);
    map.geoObjects.add(blueObjects);

    var ma = new ymaps.Placemark([55.8, 37.5]);

    // Добавляем в коллекции метки
    redObjects.add(ma);
    redObjects.add(new ymaps.Placemark([55.9, 37.7]));
    blueObjects.add(new ymaps.Placemark([55.4, 37.3]));
    blueObjects.add(new ymaps.Placemark([55.7, 37.6]));
    blueObjects.add(new ymaps.Placemark([55.5, 37.8]));

    redObjects.remove(ma);

    // Меняем вид иконок
    blueObjects.options.set("preset", "islands#blueIcon");
});