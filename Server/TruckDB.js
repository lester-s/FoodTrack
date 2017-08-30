var levelup = require('levelup');
var db = levelup('./Databases/truckDB');
var ftException = require('./FoodTrackException');

var truckDB = function TruckDB() {

    this.CreateTruck = function (key, value) {
        return new Promise(function (resolve, reject) {

            var jsonValue = JSON.stringify(value);

            db.put(key, jsonValue, function (error) {

                if (error) {
                    var exception = new ftException.ftException(error.type, "Can't create truck in the database", "TruckDB/CreateTruck");
                    reject(exception);
                    return;
                }

                resolve(key);
                return;
            });
        });
    };

    this.GetTruck = function (key) {
        return new Promise(function (resolve, reject) {
            if (!key) {
                reject(new ftException.ftException("ArgumentMissingException", "Argument key is missing", "TruckDB, GetTruck method"));
                return;
            }

            db.get(key, function (error, jsonValue) {
                if (error) {
                    reject(new ftException.ftException(error.type, "An error occured while reading the DB", "TruckDB, GetTruck method"));
                    return
                }

                var truck = JSON.parse(jsonValue);
                resolve(truck);
                return;
            });
        });
    };

    this.GetTrucks = function () {
        return new Promise(function (resolve, reject) {
            var trucks = [];
            var readStream = db.createReadStream()
                .on('data', function (data) {
                    var truck = JSON.parse(data.value);
                    trucks.push(truck);
                })
                .on('error', function (err) {
                    reject(new ftException.ftException(err.type, "On error occured while reading all trucks", "TruckDB, GetTrucks, On Error from ReadStream"));
                    return;
                })
                .on('close', function () {
                })
                .on('end', function () {
                    resolve(trucks);
                    return;
                });
        });
    };

    this.UpdateTruck = function (key, value) {
        return new Promise(function (resolve, reject) {

            var jsonData = JSON.stringify(value);
            db.put(key, jsonData, function (error) {
                if (error) {
                    var exception = new ftException.ftException(error.type, "An error occured while updating", "TruckDB, UpdateTruck");
                    reject(exception);
                    return;
                }

                resolve(key);
                return;
            });
        });
    };
};

exports.truckDB = truckDB;