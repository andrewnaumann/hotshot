'use strict';
const electron = require('electron');
const ipc = require('electron').ipcMain;
const menubar = require('menubar');
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const mb = menubar({
  icon: __dirname + '/hotshotmenubaricon.png',
  width: 428,
  height: 700,
  minWidth: 300,
  maxWidth: 428,
  "show-dock-icon": true,
  'preload-window': true
});

var windowIsShown = false;

function toggleShowWindow() {
  if (windowIsShown) {
    mb.hideWindow();
    windowIsShown = false;
  } else {
    mb.showWindow();
    windowIsShown = true;
  }
}

app.on('activate', function () {
  toggleShowWindow();
  sendWindowShownMessage();
});

mb.on('ready', function() {
  // mb.window.openDevTools();
});

mb.on('show', function() {
  windowIsShown = true;
  sendWindowShownMessage();
});

mb.on('hide', function() {
  windowIsShown = false;
});

ipc.on('close-main-window', function () {
    app.quit();
});

function sendWindowShownMessage() {
  mb.window.webContents.send("app-shown");
}
