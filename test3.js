var http = require('http');
var https = require('https');
var port = process.env.PORT || 8080;
var url = require('url');
var request = require('request');
var options;
var html;
var infoArray = [];

function addToArray(newData, res){
     if(newData == undefined){
         res.write("<p>Your search did not return any results.</p>");
         res.end();
         infoArray = [];
         return;
     }
     if(newData.length >= 10){
        var length = 10;
    }
    else{
        var length = data.length;
    }
    
    for(var i = 0; i <= length; i++){
        var pageUrl = "imgur.com/gallery/" + newData[i].id;
        var imageUrl = newData[i].link;
        var altText = newData[i].title;
        var newArray = {"url": pageUrl, "image url": imageUrl, "alt text": altText};
        infoArray += JSON.stringify(newArray);
    }
        console.log(infoArray);
        res.write("<p>" + infoArray + "</p>");
        res.end();
        infoArray =[];
}

var server = http.createServer(function(req, res){
    var origUrl = url.parse(req.url, true);
    var getOffset = url.parse(req.url, true).query;
    
    var pagination = getOffset.offset;
    var searchTerm = origUrl.pathname.slice(1) + "/" + pagination; 
    var options = {
    uri: "https://api.imgur.com/3/gallery/t/puppy/" + searchTerm,
    method: "GET",
    hostname: "api.imgur.com",
    path: '/3/gallery/t/' + searchTerm,
    headers: {
        "Content-Type" : "application/json",
        'Authorization': 'Client-ID ' + '39347fe2cdd277c' 
    }
    };
    console.log(options.uri);
    request(options, function(error, response, body){
    var newData = JSON.parse(body).data.items;
    addToArray(newData, res);
    });
});
server.listen(port);