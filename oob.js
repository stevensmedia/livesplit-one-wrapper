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

function oobCookieValue(arg) {
	var ret = localStorage.getItem(arg);
	if(!ret || ret == 'undefined') {
		return '';
	} else {
		return ret;
	}
}

function oobInitializeSettings() {
	$('#startsplit-hotkey').attr('value', oobCookieValue('startsplit-hotkey'));
	$('#reset-hotkey').attr('value', oobCookieValue('startsplit-hotkey'));
	$('#back-hotkey').attr('value', oobCookieValue('startsplit-hotkey'));
	$('#skip-hotkey').attr('value', oobCookieValue('startsplit-hotkey'));
	$('#timer-font').attr('value', oobCookieValue('timer-font'));
	$('#splits-font').attr('value', oobCookieValue('splits-font'));
	$('#title-font').attr('value', oobCookieValue('title-font'));
}

function oobUpdateSettings() {
	var getVal = function(sel, p = true) {
		var val = $(sel)[0].value;
		var placeholder = $(sel).attr('placeholder');
		if(!val || val == '' | val == 'undefined') {
			if(p) {
				return placeholder;
			} else {
				return '';
			}
		} else {
			return val;
		}
	};

	localStorage.setItem('startsplit-hotkey', getVal('#startsplit-hotkey', false));
	localStorage.setItem('reset-hotkey', getVal('#reset-hotkey', false));
	localStorage.setItem('back-hotkey', getVal('#back-hotkey', false));
	localStorage.setItem('skip-hotkey', getVal('#skip-hotkey', false));
	localStorage.setItem('timer-font', getVal('#timer-font', false));
	localStorage.setItem('splits-font', getVal('#splits-font', false));
	localStorage.setItem('title-font', getVal('#title-font', false));

	var hotkeys = {
		start: getVal('#startsplit-hotkey'),
		reset: getVal('#reset-hotkey'),
		skip: getVal('#back-hotkey'),
		back: getVal('#skip-hotkey'),
	}
	ipc.send('sethotkeys', hotkeys);
	$('.timer-time').css('font-family', getVal('#timer-font'));
	$('.split-time.time').css('font-family', getVal('#timer-font'));
	var x = $('.timer-time').last()[0].getBBox().x + 'px'
	$('.timer-time').first().attr('x', x);
	$('.split').css('font-family', getVal('#splits-font'));
	$('.title-text').css('font-family', getVal('#title-font'));
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
		$('#wrapper-dialog .buttonrow .save').click(function() {
			oobUpdateSettings();
			hide_wrapper_dialog();
		});
		$('#wrapper-dialog .buttonrow .cancel').click(function() {
			hide_wrapper_dialog();
		});
		oobInitializeSettings();
		oobUpdateSettings();
	});
	ipc.send('readdialog');

	/* Adding our own buttons */
	ipc.once('buttons', function(event, args) {
		$('.buttons').append($(args.data));
		$('#contextmenu-button').click(function() {
			ipc.send('rightclick');
		});
		$('#wrapper-button').click(function() {
			show_wrapper_dialog();
		});
	});
	ipc.send('readbuttons');
}

function show_wrapper_dialog() {
	$('#wrapper-dialog-overlay').show().animate({opacity: 0.6}, 300);
	$('#wrapper-dialog').show().animate({left: '50%'}, 300);
};

function hide_wrapper_dialog() {
	$('#wrapper-dialog-overlay').animate({opacity: 0}, 300).hide(300);
	$('#wrapper-dialog').animate({left: '100%'}, 300).hide(300);
}

/* Go! */
oobSetup();
