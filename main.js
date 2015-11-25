'use strict';
var app = require('app');
const ipcMain = require('electron').ipcMain;
var mainWindow = null;
var dribbbleData = null;

var menubar = require('menubar')

var mb = menubar({
  index: 'file://' + __dirname + '/app/index.html',
  icon: __dirname + '/app/assets/HotshotIcon2.png',
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

ipcMain.on('quit-button-clicked', function(event) {
  app.quit();
});


