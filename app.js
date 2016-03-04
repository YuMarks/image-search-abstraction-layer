var port = process.env.PORT || 8080,
    express = require('express'),
    app = express(),
    request = require('request'),
    https = require('https'),
    dotenv = require('dotenv').config(); //load environment variables from .env
var searchTerm = 'puppies';
var options = {
    host: 'api.imgur.com',
    //method: 'GET',
    path: '/3/image/g4r0ojH',
    headers: {
        "Content-Type" : "application/json",
        'Authorization': 'Client-ID ' + process.env.Client_ID 
    }
};
function callback(res){
    var str = '';
    res.on('data', function(chunk){
        str += chunk;
         });
    res.on('end', function(){
        var final = JSON.parse(str);
        console.log(final);
       
    }); 
}
https.request("https://api.imgur.com/3/gallery/hot/viral/0.json", function (res, body) {
    console.log("Made it");
    var info = JSON.parse(body);
    console.log(info);
    
});
   
