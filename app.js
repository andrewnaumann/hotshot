
var Vue = require('vue/dist/vue.js');
var shell = require('electron').shell;
var ipc = require('electron').ipcRenderer;
var DRIBBBLE_ACCESS_TOKEN = "7db78f5cb574b2309af3ea772628b42269c6bfb6767b88ba13f5294d5b9cbb8d";
var initialAPIURL = 'https://api.dribbble.com/v1/shots';
var nextPageURL = "";
var dribbbleJSON = {
  shotlist:[]
};
var nextPageURL;
var closeEl = document.querySelector('#close');
var scrollTimer = null;
var refreshTimer = null;
var refreshTimeout = 300000; // 5 minutes
var dataIsStale = false;
var newPageCounter = 0;
var MAX_NEW_PAGES = 4;


var vm = new Vue({
  el: "#shot-list",
  data: {shotlist: []},
  computed: {
    hidpiMode: function () {
      return true;
    }
  },
  methods: {
    openURL: function(url) {
      shell.openExternal(url);
    },
    resetState: function() {
      this.shotlist = [];
      newPageCounter = 0;
      requestDribbbleJSON(initialAPIURL);
    }
  },
  ready: requestDribbbleJSON(initialAPIURL)
});

var btn = new Vue({
  el: "#next-button",
  methods: {
    loadNextPage: function(event) {
      newPageCounter = 0;
      requestDribbbleJSON(nextPageURL);
    }
  }
});

var loadScreen = new Vue({
  el: "#load-screen",
  data: {
    display: true
  }
});

closeEl.addEventListener('click', function () {
    ipc.sendSync('close-main-window');
});

ipc.on("app-shown", function() {
  refreshAppData();
});

function refreshAppData() {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
  }
  refreshTimer = setTimeout(setDataIsStale, refreshTimeout);

  if (dataIsStale) {
    resetAppState();
  }
}

function setDataIsStale() {
  dataIsStale = true;
}

function resetAppState() {
  loadScreen.display = true;
  refreshTimer = null;
  vm.resetState();
  document.body.scrollTop = 0;
  dataIsStale = false;
}

document.addEventListener('scroll', function () {
    if (scrollTimer) {
        clearTimeout(scrollTimer);   // clear any previous pending timer
    }
    scrollTimer = setTimeout(handleScroll, 500);   // set new timer
});

function reqListener () {
  var nextPageURLString = this.getResponseHeader('Link');
  nextPageURL = getNextURL(nextPageURLString);
  dribbbleJSON.shotlist = JSON.parse(this.responseText);
  loadScreen.display = false;
  for (var i = 0; i < dribbbleJSON.shotlist.length; i ++) {
    vm.shotlist.push(dribbbleJSON.shotlist[i]);
  }
}

function getNextURL(headerString) {
  var semicolonPos = headerString.search(';') - 1;
  var url =  headerString.substring(1, semicolonPos);
  return url;
}

function requestDribbbleJSON(url){
  if (newPageCounter <= MAX_NEW_PAGES) {
    newPageCounter++;
    var oReq = new XMLHttpRequest({});
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", url);
    oReq.setRequestHeader('Authorization', 'Bearer ' + DRIBBBLE_ACCESS_TOKEN);
    oReq.send();
  }
}

function handleScroll() {
    scrollTimer = null;
    var bodyHeight = document.body.scrollHeight;
    var windowHeight = window.innerHeight;
    var scrollPos = document.body.scrollTop;

    if ((bodyHeight - windowHeight - 200) < scrollPos) {
      requestDribbbleJSON(nextPageURL);
    }
}
