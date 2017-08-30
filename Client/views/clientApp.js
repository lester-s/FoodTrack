var customComponent = Vue.component('my-component', {
    template: '<div>A custom component!</div>'
});

var clientApp = new Vue({
    el: '#app',
    data: {
        truckId: '',
        nameInput: '',
        urlInput: '',
        latitudeInput: '',
        longitudeInput: '',
        isNewInput: true
    },
    methods: {
        GetAllTrucks: function (event) {
            if (markersLayers.length > 0) {
                markersLayers.forEach(function (t) {
                    t.remove();
                });
            }
            var encodeAddress = encodeURI("Laval 53000 france");
            var requestGeocoding = " http://nominatim.openstreetmap.org/search?format=json&q=" + encodeAddress;
            $.getJSON(requestGeocoding, function (data) {
                var t = data;
            });

            $.ajax({
                type: "GET",
                url: "http://localhost:3000/v1/trucks",
                dataType: "json",
                success: function (result) {
                    var innerText = "";

                    result.forEach(function (truck) {
                        innerText += "<br>" + JSON.stringify(truck);

                        var layer = L.marker([truck.location.latitude, truck.location.longitude])
                            .bindPopup('<a href="' + truck.url + '" target="_blank">' + truck.name + '</a>')
                            .addTo(mymap);

                        markersLayers.push(layer);
                    });


                    document.getElementById("answerBox").innerHTML = innerText;
                },
                error: function (xhr, status, error) {
                    var e = error;
                },
            });
        },
        createTruckSubmit: function () {

            var id = 0;
            if (!clientApp.isNewInput) {
                id = clientApp.truckId;
            }

            var token = getCookie("FoodTrackToken");

            var data = {
                token: token,
                id: id,
                name: clientApp.nameInput,
                url: clientApp.urlInput,
                latitude: clientApp.latitudeInput,
                longitude: clientApp.longitudeInput,
                isNew: clientApp.isNewInput
            }

            var jsonData = JSON.stringify(data);

            $.ajax({
                type: "POST",
                url: "http://localhost:3000/v1/trucks",
                dataType: "json",
                contentType: "application/json",
                success: function (result) {
                    document.getElementById("answerBox").innerHTML = result.truckId;
                },
                error: function (xhr, status, error) {
                    var e = error;
                },
                data: jsonData
            });
        },
        GetOneTruck: function () {
            $.ajax({
                type: "GET",
                url: "http://localhost:3000/v1/trucks/" + clientApp.truckId,
                dataType: "json",
                success: function (result) {
                    document.getElementById("answerBox").innerHTML = JSON.stringify(result);
                },
                error: function (xhr, status, error) {
                    var e = error;
                },
            });
        },
        SelectOneLocationOnMap: function (event) {

        }
    }
});

function getCookie ( name )
{
    var results = document.cookie.match ( '(^|;) ?' + name + '=([^;]*)(;|$)' );

    if ( results )
        return ( unescape ( results[2] ) );
    else
        return null;
}

function CreateContextMenu() {
    var contextMenu = document.createElement('div');

    var nameLabel = document.createTextNode('name: ');
    var nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.oninput = function (event) {
        clientApp.nameInput = event.target.value;
    };

    var urlLabel = document.createTextNode('url: ');
    var urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.oninput = function (event) {
        clientApp.urlInput = event.target.value;
    };

    var createButton = document.createElement('button');
    createButton.type = 'button';
    createButton.innerHTML = "Create";
    createButton.onclick = function () {
        clientApp.createTruckSubmit();
        mymap.closePopup();
    };

    var breakElement = document.createElement('BR');

    contextMenu.appendChild(nameLabel);
    contextMenu.appendChild(nameInput);
    contextMenu.appendChild(breakElement.cloneNode(true));

    contextMenu.appendChild(urlLabel);
    contextMenu.appendChild(urlInput);
    contextMenu.appendChild(breakElement.cloneNode(true));

    contextMenu.appendChild(createButton);

    return contextMenu;
};


var mymap = L.map('mapid').setView([51.505, -0.09], 3);

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: ['a', 'b', 'c']
}).addTo(mymap);

mymap.on('contextmenu', function (ev) {

    clientApp.latitudeInput = ev.latlng.lat;
    clientApp.longitudeInput = ev.latlng.lng;
    var popup = L.popup().setLatLng(ev.latlng)
        .setContent(CreateContextMenu())
        .openOn(mymap);
});

var markersLayers = [];