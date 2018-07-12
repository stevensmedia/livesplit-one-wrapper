const electron = require('electron')
const settings = require('electron-settings')

var app = electron.app;
var win;

electron.app.on('ready', function() {
	app.dock.setIcon(__dirname + '/icon.png');
	var size = settings.get('size');

	win = new electron.BrowserWindow({
		width: size ? size[0] : 900,
		height: size ? size[1] : 800,
		title: "LiveSplit One",
		icon: __dirname + '/icon.png',
	});

	win.loadURL('https://one.livesplit.org/');
});

electron.app.on('before-quit',function() {
	settings.set('size', win.getSize());
});
