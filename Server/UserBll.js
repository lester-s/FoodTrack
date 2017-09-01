const ftException = require('./FoodTrackException');
var userDBHolder = require('./UserDB');
var userDB = new userDBHolder.userDB();
var helperHolder = require('./Helpers');
var helpers = new helperHolder.helpers();
var Sessions = {
    isRunning: true
};
var userbll = function UserBLL() {

    this.CreateUser = function (login, password) {
        return new Promise(function (resolve, reject) {
            if (!login || !password) {
                var exception = new ftException.ftException("ArgumentMissing", "A argument is missing to create user", "UserBll, CreateUser");
                reject(exception);
                return;
            }

            userDB.GetUser(login).then(function (getSuccess) {
                var exception = new  ftException.ftException("UserAlreadyExist", "This user name is already in use.", "UserBll, create user");
                reject(exception);
                return;
            }, function (GetFail) {
                userDB.CreateUser(login, password).then(function (createSuccess) {
                    resolve(login);
                    return;
                }, function (createFail) {
                    reject(createFail);
                    return;
                });
            });


        });
    };

    this.AuthenticateUser = function (login, password) {
        return new Promise(function (resolve, reject) {
            if (!login || !password) {
                var exception = new ftException.ftException("ArgumentMissing", "A argument is missing to authenticate user", "UserBll, AuthenticateUser");
                reject(exception);
                return;
            }

            userDB.GetUser(login).then(function (readSuccess) {

                if (readSuccess !== password) {
                    var exception = new ftException.ftException("UnAuthorized", "You are not allowed to do this action", "UserBll, DeleteUser");
                    reject(exception);
                    return;
                }

                var sessionId = helpers.GenerateSnowflake();
                var currentTime = new Date();

                Sessions[sessionId.toString()] = {
                    login: login,
                    endDate: new Date(currentTime.getTime() + 1 * 60000),
                };

                var userFriendlyToken = helpers.EncodeSnowflakeToToken(sessionId);

                resolve(userFriendlyToken);
                return;
            }, function (readFail) {
                reject(readFail);
                return;
            });
        });
    };

    this.ValidateToken = function (token) {
        return new Promise(function (resolve, reject) {
            if (!token) {
                var exception = new ftException.ftException("ArgumentMissing", "An argument is missing to validate the token", "UserBll, ValidateToken");
                reject(exception);
                return;
            }

            var sessionId = helpers.DecodeTokenToSnowflake(token);
            var result = false;
            var currentSession = Sessions[sessionId.toString()];
            if (currentSession) {

                var isValid = currentSession.endDate > new Date();

                if (isValid) {
                    currentSession.endDate = new Date(currentSession.endDate.getTime() + 2 * 60000);
                    resolve({
                        isValid: true,
                        login: currentSession.login
                    });
                    return;
                }
                else {
                    var exception = new ftException.ftException("InvalidToken", "The token used for the session has expired.", "UserBll, ValidateToken");
                    delete Sessions[sessionId.toString()];
                    reject(exception);
                    return;
                }
            }

            var exception = new ftException.ftException("InvalidToken", "The token used for the session is invalid.", "UserBll, ValidateToken");
            reject(exception);
            return;
        });
    };

    this.UpdateUserPassword = function (login, oldPassword, newPassword) {
        return new Promise(function (resolve, reject) {
            if (!login || !oldPassword || !newPassword) {
                var exception = new ftException.ftException("ArgumentMissing", "A argument is missing to update user", "UserBll, UpdateUserPassword");
                reject(exception);
                return;
            }

            userDB.GetUser(login).then(function (readSuccess) {
                if (readSuccess !== oldPassword) {
                    var exception = new ftException.ftException("UnAuthorized", "You are not allowed to do this action", "UserBll, UpdateUserPassord");
                    reject(exception);
                    return;
                }

                return userDB.UpdateUser(login, newPassword);

            }, function (readFail) {
                reject(readFail);
                return;
            }).then(function (updateSuccess) {
                resolve(updateSuccess);
                return;
            }, function (updateFail) {
                reject(updateFail);
                return;
            });
        });
    };

    this.DeleteUser = function (login, password) {
        return new Promise(function (resolve, reject) {
            if (!login || !password) {
                var exception = new ftException.ftException("ArgumentMissing", "A argument is missing to delete user", "UserBll, DeleteUser");
                reject(exception);
                return;
            }

            userDB.GetUser(login).then(function (readSuccess) {
                if (readSuccess !== password) {
                    var exception = new ftException.ftException("UnAuthorized", "You are not allowed to do this action", "UserBll, DeleteUser");
                    reject(exception);
                    return;
                }

                return userDB.DeleteUser(login);

            }, function (readFail) {
                reject(readFail);
                return;
            }).then(function (deleteSuccess) {
                resolve(deleteSuccess);
                return;
            }, function (deleteFail) {
                reject(deleteFail);
                return;
            });
        });
    };
};

exports.userBll = userbll;
