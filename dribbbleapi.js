var request = require('request');
var DRIBBBLE_ACCESS_TOKEN = "7db78f5cb574b2309af3ea772628b42269c6bfb6767b88ba13f5294d5b9cbb8d";
 
function buildOptions(pageIndex, perPage) {
  return {
    url: "https://api.dribbble.com/v1/shots?page=" + pageIndex +"&per_page=" + perPage,
    headers: {
      'Authorization': 'Bearer ' + DRIBBBLE_ACCESS_TOKEN
    }
  }
}
  
function getData(pageIndex, perPage, callback) {
  request(buildOptions(pageIndex, perPage), function(error, response, body) {
    if(!error && response.statusCode == 200) {
      var dribbbleJSONData = JSON.parse(body);
      callback(dribbbleJSONData);
    }
    // TODO: Create Error Handling
  })
}


module.exports = {
  getData: getData
};

