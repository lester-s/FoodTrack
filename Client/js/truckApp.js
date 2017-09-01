const cookieName = "FoodTrackToken";
var truckMarker = null;
var truckApp = new Vue({
    el: '#truckApp',
    mounted: function () {
        this.$nextTick(function () {
            var urlPath = window.location.hash.split('#');
            truckApp.truckId = urlPath[1];
            truckApp.GetOneTruck()
        })
    },
    data:{
        truckId:null,
        nameInput: '',
        urlInput: '',
        latitudeInput: '',
        longitudeInput: '',
        isNewInput: true,
    },
    methods:{
        GetOneTruck: function () {
            $.ajax({
                type: "GET",
                url: "http://localhost:3000/v1/trucks/" + truckApp.truckId,
                dataType: "json",
                success: function (result) {
                    if(result.errorCode)
                    {
                        alert(result.errorCode + ", " + result.errorMessage);
                        return;
                    }
                    truckApp.nameInput = result.name;
                    truckApp.urlInput = result.url;
                    truckApp.latitudeInput = result.location.latitude;
                    truckApp.longitudeInput = result.location.longitude;

                    truckMarker = L.marker([result.location.latitude, result.location.longitude])
                        .bindPopup('<a href="' + result.url + '" target="_blank">' + result.name + '</a>')
                        .addTo(mymap);
                    mymap.setView(L.latLng(result.location.latitude,result.location.longitude));
                },
                error: function (xhr, status, error) {
                    var e = error;
                },
            });
        },
        UpdateTruck: function () {

            var token = getCookie(cookieName);

            var data = {
                token: token,
                id: truckApp.truckId,
                name: truckApp.nameInput,
                url: truckApp.urlInput,
                latitude: truckApp.latitudeInput,
                longitude: truckApp.longitudeInput,
                isNew: false
            }

            var jsonData = JSON.stringify(data);

            $.ajax({
                type: "POST",
                url: "http://localhost:3000/v1/trucks",
                dataType: "json",
                contentType: "application/json",
                success: function (result) {
                    if(result.errorCode)
                    {
                        alert(result.errorCode + ", " + result.errorMessage);
                        return;
                    }
                    truckMarker.remove();
                    truckMarker = L.marker([truckApp.latitudeInput, truckApp.longitudeInput])
                        .bindPopup('<a href="' + result.url + '" target="_blank">' + result.name + '</a>')
                        .addTo(mymap);
                    mymap.setView(L.latLng(truckApp.latitudeInput,truckApp.longitudeInput));
                },
                error: function (xhr, status, error) {
                    var e = error;
                },
                data: jsonData
            });
        },
    }
});

function getCookie ( name )
{
    var results = document.cookie.match ( '(^|;) ?' + name + '=([^;]*)(;|$)' );

    if ( results )
        return ( unescape ( results[2] ) );
    else
        return null;
};

function CreateContextMenu() {
    var contextMenu = document.createElement('div');

    var createButton = document.createElement('button');
    createButton.type = 'button';
    createButton.innerHTML = "Select new position";
    createButton.onclick = function () {
        truckApp.UpdateTruck();
        mymap.closePopup();
    };

    contextMenu.appendChild(createButton);

    return contextMenu;
};

var mymap = L.map('mapid').setView([51.505, -0.09], 16);

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: ['a', 'b', 'c']
}).addTo(mymap);

mymap.on('contextmenu', function (ev) {

    truckApp.latitudeInput = ev.latlng.lat;
    truckApp.longitudeInput = ev.latlng.lng;
    var popup = L.popup().setLatLng(ev.latlng)
        .setContent(CreateContextMenu())
        .openOn(mymap);
});