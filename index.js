const electron = require('electron')

function createWindow() {
	win = new electron.BrowserWindow();
	win.loadURL('https://one.livesplit.org/');
}

electron.app.on('ready', createWindow);
