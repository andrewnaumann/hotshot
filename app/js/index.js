'use strict';

var dribbbleapi = require('../dribbbleapi.js');
var updateFinished = false;
var pageIndex = 1;
var perPage = 50;

dribbbleapi.getData(pageIndex, perPage, function(data) {
  updateUI(data);
  updateFinished = true;
});

function updateUI(data) {
  var elShots, imageUrl;
  elShots = document.querySelector('.shots');
  for (var i = 0; i < data.length; i++) {
    if(data[i].animated) {
      imageUrl = data[i].images.hidpi ? data[i].images.hidpi : data[i].images.normal;  
    } else {
      imageUrl = data[i].images.normal;
    }
    var shotTitle = data[i].title;
    elShots.innerHTML += '<li><img src="'+ imageUrl +'">';
//    elShots.innerHTML += '<p class="title">' + shotTitle + '</p>';
    elShots.innerHTML += '</li>';
  }
}

function checkScrollPos() {
  if ((updateFinished && window.scrollY + window.innerHeight) >= document.body.scrollHeight - 500 && (window.scrollY + window.innerHeight) > 1000) {
    updateFinished = false;
    console.log('scrolling near bottom with a scrollY of:' + (window.scrollY + window.innerHeight));
    dribbbleapi.getData(pageIndex, perPage, function(data) {
      updateUI(data);
      pageIndex++;
      updateFinished = true;
    });
  }
}


setInterval(checkScrollPos, 250);

