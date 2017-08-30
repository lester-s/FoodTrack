var levelup = require('levelup');
var db = levelup('./Databases/userDB');
var ftException = require('./FoodTrackException');

var userDB = function UserDB() {
    this.CreateUser = function (key, value) {
        return new Promise(function (resolve, reject) {
            db.put(key, value, function (error) {

                if (error) {
                    var exception = new ftException.ftException(error.type, "Can't create user in the database", "UserDB/CreateUser");
                    reject(exception);
                    return;
                }

                resolve(key);
                return;
            });
        });
    };

    this.GetUser = function (key) {
        return new Promise(function (resolve, reject) {
            if (!key) {
                reject(new ftException.ftException("ArgumentMissingException", "Argument key is missing", "UserDB, GetUser method"));
                return;
            }

            db.get(key, function (error, value) {
                if (error) {
                    reject(new ftException.ftException(error.type, "An error occured while reading the DB", "UserDB, GetUser method"));
                    return
                }

                resolve(value);
                return;
            });
        });
    };

    this.UpdateUser = function (key, value) {
        return new Promise(function (resolve, reject) {

            db.put(key, value, function (error) {
                if (error) {
                    var exception = new ftException.ftException(error.type, "An error occured while updating", "UserDB, UpdateUser");
                    reject(exception);
                    return;
                }

                resolve(key);
                return;
            });
        });
    };

    this.DeleteUser = function (key) {
        return new Promise(function (resolve, reject) {
            db.del(key, function (err) {
                if (error) {
                    var exception = new ftException.ftException(error.type, "An error occured while deleting user", "UserDB, DeleteUser");
                    reject(exception);
                    return;
                }

                resolve(key);
                return;
            });
        });
    };
};

exports.userDB = userDB;