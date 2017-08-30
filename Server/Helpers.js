var intformat = require('biguint-format');
var FlakeId = require('flake-idgen');
var snowFlakeRandomId;
var Hashids = require('hashids');
var hashids = new Hashids('FoodTrackSeed', 17, 'ABCDEFGHIJKLMNPQRSTUVWXYZ23456789');

var helpers = function Helpers() {
    this.GenerateSnowflake = function () {

        if (!snowFlakeRandomId) {
            snowFlakeRandomId = Math.floor(Math.random() * 1023);
        }

        var flakeIdGen = new FlakeId({id: snowFlakeRandomId});

        var id = intformat(flakeIdGen.next(), 'hex');

        return id;
    };

    this.EncodeSnowflakeToToken = function (snowFlake) {
        return hashids.encodeHex(snowFlake);
    };

    this.DecodeTokenToSnowflake = function (token) {
        var result =  hashids.decodeHex(token);
        return result;
    };
};

exports.helpers = helpers;