var truck = function Truck (_id,_login,_name, _latitude, _longitude, _url) {
    this.name = _name;
    this.id = _id;
    this.location = {
        latitude:_latitude,
        longitude:_longitude
    };
    this.url = _url;
    this.login = _login;
};

exports.truck = truck;