'use strict';
var app = require('app');
var dribbbleapi = require('./dribbbleapi');

var mainWindow = null;
var dribbbleData = null;

var menubar = require('menubar')

var mb = menubar({
  index: 'file://' + __dirname + '/app/index.html',
  icon: __dirname + '/app/assets/HotshotIcon.png',
  width: 400,
  height: 700,
  'max-width': 440,
  'min-height': 300,
  'min-width': 300,
  preloadWindow: true
});

app.on('window-all-closed', function() {
  app.quit();
});


mb.on('show', function(){
//  mb.window.webContents.send('focus');
  mb.window.openDevTools();
});


