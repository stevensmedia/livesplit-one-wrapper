const electron = require('electron')
const settings = require('electron-settings')
const path = require('path')

var app = electron.app;
var win;

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

	/* This function passes a click to a selector the render process */
	var click = function(target) {
		var encoded = JSON.stringify(target);
		win.webContents.executeJavaScript(`
			window.$(${encoded}).click();
			/* Electron can't handle jQuery. Return something simple. */
			0;
		`);
	};

	/* This function passes a click to a selector's PARENT in the render process */
	var clickParent = function(target) {
		var encoded = JSON.stringify(target);
		win.webContents.executeJavaScript(`
			window.$(${encoded}).parent().click();
			0;
		`);
	};

	/* Global hotkeys*/
	electron.globalShortcut.register('Shift+Down', function() {
		click('.livesplit-container .layout');
	});

	electron.globalShortcut.register('Shift+Up', function() {
		clickParent('i.fa-times');
	});

	electron.globalShortcut.register('Shift+Right', function() {
		clickParent('i.fa-arrow-down');
	});

	electron.globalShortcut.register('Shift+Left', function() {
		clickParent('i.fa-arrow-up');
	});

	/* Go! */
	win.loadURL('https://one.livesplit.org/');
});

/* Goodbye */
app.on('window-all-closed', function() {
	app.quit()
});
