const electron = require('electron');
const ipc = electron.ipcRenderer;
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
	/* Don't do weird scrolling */
	$('body').css('overflow', 'hidden');

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

	/* don't do weird zooming */
	electron.webFrame.setVisualZoomLevelLimits(1, 1);

	/* Apply CSS */
	oobCSSChanges();

	/* We need to re-apply the CSS on every load */
	$('.livesplit-container').bind('DOMSubtreeModified', function(e) {
		oobCSSChanges();
	});

	/* Adding our own configuration dialog */
	ipc.once('dialog', function(event, args) {
		$('body').append($(args.data));
	});
	ipc.send('readdialog');

	/* Adding our own buttons */
	ipc.once('buttons', function(event, args) {
		$('.buttons').append($(args.data));
		$('#contextmenu-button').click(function() {
			ipc.send('rightclick');
		});
		$('#wrapper-dialog-overlay').click(function() {
			$('#wrapper-dialog-overlay').animate({opacity: 0}, 300).hide(300);
			$('#wrapper-dialog').animate({left: '100%'}, 300).hide(300);
		});
		$('#wrapper-button').click(function() {
			$('#wrapper-dialog-overlay').show().animate({opacity: 0.6}, 300);
			$('#wrapper-dialog').show().animate({left: '50%'}, 300);
		});
	});
	ipc.send('readbuttons');
}

/* Go! */
oobSetup();
