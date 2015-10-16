var request = require('request');
var DRIBBBLE_ACCESS_TOKEN = "7db78f5cb574b2309af3ea772628b42269c6bfb6767b88ba13f5294d5b9cbb8d";
var dribbbleJSONData = null;
var pageIndex = 1;
 
function buildOptions() {
  return {
    url: "https://api.dribbble.com/v1/shots?page=" + pageIndex +"&per_page=100",
    headers: {
      'Authorization': 'Bearer ' + DRIBBBLE_ACCESS_TOKEN
    }
  }
}
  
function updateJSON(callback) {
  request(buildOptions(), function(error, response, body) {
    if (!error && response.statusCode == 200) {
      pageIndex++;
      var dribbbleJSONData = JSON.parse(body);
    }
    callback(dribbbleJSONData);
  });
}



module.exports = {
  updateJSON: updateJSON,
};



