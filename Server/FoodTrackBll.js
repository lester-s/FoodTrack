var truck = require('./Truck');
const uuidv1 = require('uuid/v1');
const ftException = require('./FoodTrackException');

var truckDBHolder = require('./TruckDB');
var truckDB = new truckDBHolder.truckDB();

var bll = function BLL() {
    this.GetTrucks = function () {
        return new Promise(function (resolve, reject) {
            truckDB.GetTrucks().then(function (successResult) {
                resolve(successResult);
                return;
            }, function (errorResult) {
                reject(errorResult);
                return;
            });
        });
    };

    this.GetTruckById = function (truckId) {
        return new Promise(function (resolve, reject) {

            if (!truckId) {
                reject(new ftException.ftException("ArgumentMissingException", "Argument truckId is missing", "FoodTrackBll, GetTruckById method"));
                return;
            }

            truckDB.GetTruck(truckId).then(function (successResult) {
                resolve(successResult);
                return;
            }, function (errorResult) {
                reject(errorResult);
                return;
            });
        });
    };

    this.CreateTruck = function (truckData) {

        return new Promise(function (resolve, reject) {

            if (!truckData) {
                reject(new ftException.ftException("ArgumentMissingException", "the argumment truckData is missing", "FoodTrackBll, CreateTruck method"));
                return;
            }

            var baseId = uuidv1();
            var newId = baseId.replace(/-/g, "");
            var newTruck = new truck.truck(newId, truckData.login, truckData.name, truckData.latitude, truckData.longitude, truckData.url);
            truckDB.CreateTruck(newId, newTruck).then(function (successResult) {
                resolve(successResult);
                return;
            }, function (rejectResult) {
                reject(rejectResult);
                return;
            });
        });
    };

    this.UpdateTruck = function (truckData) {
        return new Promise(function (resolve, reject) {
            if (!truckData) {
                reject(new ftException.ftException("ArgumentMissingException", "the argumment truckData is missing", "FoodTrackBll, UpdateTruck method"));
                return;
            }

            if (truckData.id <= 0) {
                reject(new ftException.ftException("ArgumentOutOfRange", "the argumment truckData.id must be different of zero", "FoodTrackBll, UpdateTruck method"));
                return;
            }

            truckDB.GetTruck(truckData.id).then(function (readSuccess) {
                if (truckData.login !== readSuccess.login) {
                    reject(new ftException.ftException("UnAuthorized", "You are not the owner of this truck", "FoodTrackBll, UpdateTruck method"));
                    return;
                }

                var newTruck = new truck.truck(truckData.id, truckData.login, truckData.name, truckData.latitude, truckData.longitude, truckData.url);
                return truckDB.UpdateTruck(truckData.id, newTruck);

            }, function (readFail) {
                reject(readFail);
                return;
            }).then(function (successResult) {
                resolve(successResult);
                return;
            }, function (rejectResult) {
                reject(rejectResult);
                return;
            });
        });
    };
};

exports.bll = bll;