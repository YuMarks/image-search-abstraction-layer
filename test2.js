var http = require('http');
var https = require('https');
var port = process.env.PORT || 8080;
var url = require('url');
var request = require('request');
var options;
var html;
var infoArray = [];

function callback(res){
    
    var str = '';
    var newData;
    //append chunk of data to str
     res.on('data', function(chunk){
         str += chunk;
         
     });
     
     res.on('end', function(){
         var newData = JSON.parse(str);
        console.log(newData); 
        //addToArray(newData.data.items, response);
         html = newData;
});


}
var server = http.createServer(function(req, res){
    var origUrl = url.parse(req.url, true);
    var getOffset = url.parse(req.url, true).query;
    
    var pagination = getOffset.offset;
    var searchTerm = origUrl.pathname.slice(1) + "/path=" + pagination; 
    var options = {
    uri: "https://api.imgur.com/3/gallery/t/" + searchTerm,
    method: "GET",
    hostname: "api.imgur.com",
    path: '/3/gallery/t/' + searchTerm,
    headers: {
        "Content-Type" : "application/json",
        'Authorization': 'Client-ID ' + '39347fe2cdd277c' 
    }
    };
    request(options, function(error, response, body){
    var newData = JSON.parse(body).data.items;
    
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
    });


});
server.listen(port);
