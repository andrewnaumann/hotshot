'use strict';

var app = require('app');
var dribbbleapi = require('./dribbbleapi');

var mainWindow = null;
var dribbbleData = null;

var menubar = require('menubar')

var mb = menubar({
  frame: true,
  index: 'file://' + __dirname + '/app/index.html',
  width: 400,
  'max-width': 400,
  'min-height': 300,
  height: 700
});

app.on('window-all-closed', function() {
  app.quit();
});