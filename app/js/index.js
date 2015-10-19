'use strict';

var dribbbleapi = require('../dribbbleapi.js');
var updateFinished = false;
var pageIndex = 1;
var perPage = 50;
var lastRefresh = null;
var minRefreshTimeInMin = 2;
var elRefreshScreen = document.getElementById('refresh');

function init(){
  setInterval(checkScrollPos, 250);
}

function updateUI(data, refreshUI) {
  var elShots, imageUrl;
  elShots = document.querySelector('.shots');
  
  // If this is a refresh remove the existing elements
  if(refreshUI) {
    elShots.innerHTML = '';
  }
  
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
  elRefreshScreen.classList.remove('show');
  pageIndex++;
  updateFinished = true;
}

function refreshShots() {
  var now = Date.now() / 1000;
  
  if (lastRefresh === null || now - lastRefresh > 300) {
    elRefreshScreen.classList.add('show');
    lastRefresh = now;
    pageIndex = 1;
    dribbbleapi.getData(pageIndex, perPage, function(data) {
      updateUI(data, true);
    });
  }
}

// Check scroll position and request more data if reaching the end.
function checkScrollPos() {
  
  if ((updateFinished && window.scrollY + window.innerHeight) >= document.body.scrollHeight - 500 && (window.scrollY + window.innerHeight) > 1000) {
    updateFinished = false;
    console.log('scrolling near bottom with a scrollY of:' + (window.scrollY + window.innerHeight));
    dribbbleapi.getData(pageIndex, perPage, function(data) {
      updateUI(data);
    });
  }
}

require('ipc').on('focus', function(message) {
  refreshShots();
});


init();



