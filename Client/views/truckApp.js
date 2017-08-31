var truckApp = new Vue({
    el: 'truckApp',
    mounted: function () {
        this.$nextTick(function () {
            var urlPath = window.location.pathname.split('/');
            truckApp.truckId = urlPath[urlPath.length - 1];

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
                    truckApp.nameInput = result.name;
                },
                error: function (xhr, status, error) {
                    var e = error;
                },
            });
        },
    }
});