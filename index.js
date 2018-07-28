const electron = require('electron');
const fs = require('fs');
const settings = require('electron-settings');
const ipc = electron.ipcMain;
const path = require('path');

var app = electron.app;
var win;

/* Read the button bar html for the renderer */
ipc.on('readbuttons', function(event, arg) {
	filename = path.join(__dirname, 'buttons.html');
	fs.readFile(filename, 'utf8', function(err, data) {
		data = data.replace(/^\s*/gm, '');
		data = data.replace(/\n/g, '');
		console.log(data);
		win.webContents.send('buttons', {data: data});
	});
});

/* Read the config dialog html for the renderer */
ipc.on('readdialog', function(event, arg) {
	filename = path.join(__dirname, 'config.html');
	fs.readFile(filename, 'utf8', function(err, data) {
		win.webContents.send('dialog', {data: data});
	});
});

/* The renderer process wants us to send a right click */
ipc.on('rightclick', function(event, arg) {
	event = {
		type:'mouseDown',
		x: 0,
		y: 0,
		button: 'right',
		clickCount: 1,
	};
	/* Mouse down */
	win.webContents.sendInputEvent(event);
	event.type = 'mouseUp',
	/* Mouse up */
	win.webContents.sendInputEvent(event);
});

app.on('ready', function() {
	/* MacOS dock icon */
	app.dock.setIcon(path.join(__dirname, 'icon.png'));

	/* We saved our last window size. Apply it. */
	var size = settings.get('size');

	/* Main window */
	win = new electron.BrowserWindow({
		width: size ? size[0] : 900,
		height: size ? size[1] : 800,
		title: "LiveSplit One",
		icon: path.join(__dirname, 'icon.png'),
	});

	/* This injects our custom JS into one.livesplit.org */
	win.webContents.on('dom-ready', function() {
		win.webContents.executeJavaScript(`
			const path = require('path');
			const remote = require('electron').remote;
			var app = remote.app;
			require(path.join(app.getAppPath(), 'oob.js'));
		`);
	});

	/* Make sure to save that window size for next time */
	win.on('close', function() {
		settings.set('size', win.getSize());
	});

	/* Global hotkeys */
	electron.globalShortcut.register('Shift+Down', function() {
		win.webContents.send('click', {target: '.livesplit-container .layout', parent: false});
	});

	electron.globalShortcut.register('Shift+Up', function() {
		win.webContents.send('click', {target: 'i.fa-times', parent: true});
	});

	electron.globalShortcut.register('Shift+Right', function() {
		win.webContents.send('click', {target: 'i.fa-arrow-down', parent: true});
	});

	electron.globalShortcut.register('Shift+Left', function() {
		win.webContents.send('click', {target: 'i.fa-arrow-up', parent: true});
	});

	/* Go! */
	win.loadURL('https://one.livesplit.org/');
});

/* Goodbye */
app.on('window-all-closed', function() {
	app.quit()
});
