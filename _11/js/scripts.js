ymaps.ready(init);

var map;

function init(){     
    map = new ymaps.Map("map", {
        center: [12.12, 12.12],
        controls: [],
        zoom: 5
    });  

    var btn = new ymaps.control.Button({
        data: {
            content: "bla",
            num: 77783
        }
    });

    map.controls.add(btn, {
        float: 'left',
    }); 

    btn.events.add('click', (e) => {
        console.log('binded data is:', e.get('num'))
    });    
};



