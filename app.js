var http = require('http'),
  https = require('https'),
  port = process.env.PORT || 8080,
  url = require('url'),
  request = require('request'),
  html,
  mongodb = require('mongodb'),
  MongoClient = mongodb.MongoClient,
  dotenv = require('dotenv').config(), //load environment variables from .env
  dbInfo = process.env.MONGOLAB_URI,
  moment = require("moment"),
  infoArray = [];

function addTerm(keyWord) {
  var date = new Date();
  var term = {
    holder: 1,
    searchTerm: keyWord,
    date: moment(date)
  };
  MongoClient.connect(dbInfo, function(err, db) {
    if (err) {
      console.log(err);
    } else {
      var prevSearch = db.collection('prevSearch');
      prevSearch.insert(
        term,
        function(err, data) {
          if (err) {
            console.log(err);
          }
          db.close();
        });
    }
  });
}

function latestSearch(res) {
  //find last ten searches that are not imagesearch
  MongoClient.connect(dbInfo, function(err, db) {
    if (err) {
      console.log("The error is " + err);
    } else {
      var prevSearch = db.collection('prevSearch');
      prevSearch.find({
        holder: 1
      }).sort({
        _id: -1
      }).limit(10).toArray(function(err, docs) {
        if (err) {
          console.log(err);
        }
        db.close();
        var html = docs;
        var latestArray = [];
        for (var i = 0; i < 10; i++) {
          var imageInfo = {
            term: docs[i].searchTerm,
            when: docs[i].date._i
          };
          latestArray.push(imageInfo);
        }
        res.end("<p>" + JSON.stringify(latestArray) + "</p>")
      });

    }
  })
}

function addToArray(newData, res) {
  
  if (newData == undefined || newData[0] == undefined) {
    res.write("<p>Your search did not return any results.</p>");
    res.end();
    infoArray = [];
    return;
  }
  if (newData.length >= 10) {
    var length = 10;
  } else {
    var length = newData.length - 1;
  }
  for (var i = 0; i <= length; i++) {
    var pageUrl = "imgur.com/gallery/" + newData[i].id;
    var imageUrl = newData[i].link;
    var altText = newData[i].title;
    var newArray = {
      "url": pageUrl,
      "image url": imageUrl,
      "alt text": altText
    };
    infoArray += JSON.stringify(newArray);
  }
  res.write("<p>" + infoArray + "</p>");
  res.end();
  infoArray = [];
}

var server = http.createServer(function(req, res) {
  var origUrl = url.parse(req.url, true);
  var getOffset = url.parse(req.url).query;
  
  if(getOffset != null){
    var pagination = getOffset.slice(7);
  }else{
    var pagination = undefined;
  }
  
  if (pagination == undefined || pagination == null) {
    var searchTerm = origUrl.pathname.slice(1);
  } else {
    var searchTerm = origUrl.pathname.slice(1) + "/" + pagination;
  }
  var options = {
    url: "https://api.imgur.com/3/gallery/t/" + searchTerm,
    method: "GET",
    hostname: "api.imgur.com",
    path: '/3/gallery/t/' + searchTerm,
    headers: {
      "Content-Type": "application/json",
      'Authorization': 'Client-ID ' + '39347fe2cdd277c'
    }
  };

  if (origUrl.pathname.slice(1) == "latest/imagesearch") {
    latestSearch(res);
    return;
  }
  request(options, function(error, response, body) {
    var newData = JSON.parse(body).data.items;
    addToArray(newData, res);
  });
  addTerm(origUrl.pathname.slice(1));
});
server.listen(port);
