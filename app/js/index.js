'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var dribbbleapi = require('../dribbbleapi.js');
var updateFinished = false;
var pageIndex = 1;
var perPage = 50;
var lastRefresh = null;
var minRefreshTimeInMin = 2;
var elRefreshScreen = document.getElementById('refresh');
var shotsArray;

function init(){
  refreshShots();
  setInterval(checkScrollPos, 250);
}

function updateUI(data, refreshUI) {
  var elShots, imageUrl, shotHTML;
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
    var shotDescription = data[i].description;
    shotHTML = '<li class="shot">'
      shotHTML += '<img src="'+ imageUrl +'">';
      shotHTML += '<div class="meta-info"';
      shotHTML += '<h5 class="title">' + shotTitle;
      shotHTML += '</h5>';
    if(shotDescription !== null) {
        shotHTML += '<p class="description">' + shotDescription + '</p>';
    }
      shotHTML += '</div>'
    shotHTML += '</li>';
    elShots.innerHTML += shotHTML
  }
  
  shotsArray = document.querySelectorAll('.shot');
  for (var i = 0; i < shotsArray.length; i++) {
    shotsArray[i].addEventListener('click', function() {
      var elMeta = this.querySelector('.meta-info');
      if (elMeta.classList.contains('show')) {
        elMeta.classList.remove('show');
      } else {
        elMeta.classList.add('show'); 
      }
    })
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



