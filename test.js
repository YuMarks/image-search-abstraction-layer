var https = require('https');
var dotenv = require('dotenv').config(); //load environment variables from .env
var searchTerm = "lilith";
var options = {
    method: "GET",
    hostname: "api.imgur.com",
    path: '/3/gallery/t/' + searchTerm,
    headers: {
        "Content-Type" : "application/json",
        'Authorization': 'Client-ID ' + '39347fe2cdd277c' 
    }
};
function callback(response){
    var str = '';
    response.on('data', function(chunk){
        str += chunk;
    });
    response.on('end', function(){
        var newData = JSON.parse(str);
        console.log(newData.data.items[0].title);
    });
}
https.request(options, callback).end();