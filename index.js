const electron = require('electron')
const settings = require('electron-settings')
const path = require('path')

var app = electron.app;
var win;

app.on('ready', function() {
	app.dock.setIcon(path.join(__dirname, 'icon.png'));
	var size = settings.get('size');

	win = new electron.BrowserWindow({
		width: size ? size[0] : 900,
		height: size ? size[1] : 800,
		title: "LiveSplit One",
		icon: path.join(__dirname, 'icon.png'),
	});

	win.webContents.on('dom-ready', function() {
		win.webContents.executeJavaScript(`
			const path = require('path');
			const remote = require('electron').remote;
			var app = remote.app;
			require(path.join(app.getAppPath(), 'oob.js'));
		`);
	});

	win.on('close', function() {
		settings.set('size', win.getSize());
	});

	win.loadURL('https://one.livesplit.org/');
});

app.on('window-all-closed', function() {
	app.quit()
});
