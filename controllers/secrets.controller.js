const secrets = require('../secrets.js');

/*
exports.GetDatabaseUsername = function(){
    return secrets.DATABASE_USERNAME;
}

exports.GetDatabasePassword= function(){
    return secrets.DATABASE_PASSWORD;
}
*/

exports.GetSecretKey = function(){
    return secrets.SECRET_KEY;
}