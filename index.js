const electron = require('electron')
const settings = require('electron-settings')

var win;

function start() {
	var size = settings.get('size');
	console.log(settings.file());

	win = new electron.BrowserWindow({
		width: size ? size[0] : 900,
		height: size ? size[1] : 800,
		title: "LiveSplit One"
	});

	win.loadURL('https://one.livesplit.org/');
}

function end() {
	settings.set('size', win.getSize());
}

electron.app.on('ready', start);
electron.app.on('before-quit', end);
