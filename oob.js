const ipc = require('electron').ipcRenderer;
var $ = window.$ = require('jquery');

/* Receive a click from the app process */
ipc.on('click', function(event, arg) {
	var tgt = $(arg.target);
	if(arg.parent) {
		tgt = tgt.parent();
	}
	tgt.click();
});

/* Apply our CSS changes that need to happen every time LSO redraws */
function oobCSSChanges() {
	/* The window doesn't need a margin */
	$('.livesplit-container > div').css('margin', '0');

	/* Splits should go full width */
	$('.layout').css('width', 'auto');
	$('svg.Timer0').attr('viewBox', '0 0 300 60')
	               .attr('preserveAspectRatio', 'xMaxYMin meet')
	               .css('width', '100%');

	/* completely revamping the buttons */
	$('.buttons').css('width', 'auto');
	$('.buttons').css('text-align', 'center');
	$('.buttons').css('position', 'fixed');
	$('.buttons').css('bottom', '0%');
	$('.buttons').css('width', '100%');
	$('.buttons > .small').css('display', 'inline-block');
	$('.buttons > .small').css('width', '30%');
	$('.buttons > .small > button').css('width', '48%');
}

/* Install our custom changes */
function oobSetup() {
	/* Keep trying until LSO is actually loaded */
	if(!$('.livesplit-container').length) {
		setTimeout(oobSetup, 10);
		return;
	}

	/* We need to do this so the window will actually be closeable */
	window.onbeforeunload = null;

	/* Apply CSS */
	oobCSSChanges();

	/* We need to re-apply the CSS on every load */
	$('.livesplit-container').bind('DOMSubtreeModified', function(e) {
		oobCSSChanges();
	});

	/* Adding our own configuration dialog */
	var dialog = '<div id="wrapper-dialog"></div>';
	$('body').append($(dialog));

	/* Adding our own buttons */
	var buttons = '<div class="small"><button id="contextmenu-button">⚙️</button><button id="wrapper-button">⌘</button></div>';
	$('.buttons').append($(buttons));
	$('#contextmenu-button').click(function() {
		ipc.send('rightclick');
	});
	$('#wrapper-button').click(function() {
		console.log('wrappermenu-button click');
	});
}

/* Go! */
oobSetup();
