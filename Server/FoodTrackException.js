var ftException = function (_errorCode, _errorMessage, _errorLocalization) {

    console.log("An error occured, Code: " + _errorCode + " message: " + _errorMessage + " localization: " + _errorLocalization);

    this.errorCode = _errorCode;
    this.errorMessage = _errorMessage;
    this.errorLocalization = _errorLocalization;
    this.internalMessage = "";

    this.ToJson = function () {
        var value = {
            errorCode: this.errorCode,
            errorMessage : this.errorMessage,
            errorLocalization : this.errorLocalization
        };

        var jsonValue = JSON.stringify(value);
        return jsonValue;
    };
}

exports.ftException = ftException;