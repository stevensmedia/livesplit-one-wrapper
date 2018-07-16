function applyStyle() {
	if(!$('.livesplit-container').length) {
		setTimeout(applyStyle, 1);
		return;
	}
	$('.livesplit-container > div').css('margin', '0');
	$('.layout').css('width', 'auto');
	$('.buttons').css('width', 'auto');
	$('.buttons').css('text-align', 'center');
	$('.buttons > .small').css('display', 'inline-block');
	$('.buttons > .small').css('width', '48%');
	$('.buttons > .small > button').css('width', '48%');
	$('svg.Timer0').attr('viewBox', '0 0 300 60')
	               .attr('preserveAspectRatio', 'xMaxYMin meet')
	               .css('width', '100%');
}

var $ = require('jquery');
applyStyle();
