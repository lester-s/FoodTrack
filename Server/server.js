const express = require('express');
const app = express();
const pathBuilder = require('path');
var ftException = require('./FoodTrackException');
app.use(express.static(pathBuilder.join(__dirname, '../Client', 'views')));
app.use(express.static(pathBuilder.join(__dirname, '../Client', 'js')));

const router = express.Router();


const mainPath = __dirname;

var bll = require('./FoodTrackBll');
var foodBll = new bll.bll();

var userbllHandler = require('./UserBll');
var userBll = new userbllHandler.userBll();

var bodyparser = require('body-parser');
var jsonParser = bodyparser.json();
router.use(function (req, res, next) {
    console.log("/" + req.method);
    next();
});

router.get("/", function (req, res) {
    res.sendFile('/index.html');
});

router.get("/subscribe", function (req, res) {
    res.sendFile('/Subscribe.html');
});

router.get("/truck*", function (req, res) {
    res.sendFile('truck.html');
});

router.get("/v1/trucks", function (req, res) {
    foodBll.GetTrucks().then(function (trucks) {
        var jsonResult = JSON.stringify(trucks);
        res.send(jsonResult);

    }, function (error) {
        res.send(error.ToJson());
    });
});

router.get("/v1/trucks/:id", function (req, res) {
    console.log("enter the get");
    var idToFetch = req.params.id;
    foodBll.GetTruckById(idToFetch).then(function (trucks) {
        var jsonResult = JSON.stringify(trucks);
        res.send(jsonResult);

    }, function (error) {
        res.send(error.ToJson());
    });
});

router.post('/v1/trucks', jsonParser, function (req, res) {

    var data = req.body;

    if (!data.token) {
        var exception = new ftException.ftException("TokenMissing", "You need a valid token to perfom this action", "Server, Truck create/update");
        res.send(exception.ToJson());
        return;
    }

    userBll.ValidateToken(data.token).then(function (validateSuccess) {
        if(validateSuccess === true)
        {
            if (data.isNew) {
                foodBll.CreateTruck(data).then(function (successResult) {
                    var responseData = {
                        truckId: successResult
                    };
                    var jsonData = JSON.stringify(responseData);
                    res.send(jsonData);

                }, function (errorResult) {
                    res.send(error.ToJson());
                });
            }
            else {
                foodBll.UpdateTruck(data).then(function (successResult) {
                    var responseData = {
                        truckId: successResult
                    };
                    var jsonData = JSON.stringify(responseData);
                    res.send(jsonData);

                }, function (errorResult) {
                    res.send(error.ToJson());
                });
            }
        }
    }, function (validateFail) {
        res.send(validateFail.ToJson());
        return;
    });


});

router.post('/v1/users/subscribe', jsonParser, function (req, res) {
    var subscribtionData = req.body;
    userBll.CreateUser(subscribtionData.login, subscribtionData.password).then(function (createSuccess) {
        res.send(createSuccess);
    }, function (createFail) {
        res.send(createFail.ToJson());
    });
});

router.post('/v1/users/authenticate', jsonParser, function (req, res) {
    var subscribtionData = req.body;
    userBll.AuthenticateUser(subscribtionData.login, subscribtionData.password).then(function (createSuccess) {
        var data = {
            success: true,
            token: createSuccess
        };

        var jsonData = JSON.stringify(data);
        res.send(jsonData);
    }, function (createFail) {
        res.send(createFail.ToJson());
    });
});

app.use("/", router);

app.use("*", function (req, res) {
    res.sendFile(pathBuilder.join(__dirname, '../Client', 'views', '/404.html'));
});

app.use(bodyparser.json());


app.listen(3000, function () {
    console.log('app running on port 3000');
});