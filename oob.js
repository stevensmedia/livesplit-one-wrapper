function applyStyle() {
	if(!$('.livesplit-container').length) {
		setTimeout(applyStyle, 1);
		return;
	}
	$('.livesplit-container > div').css('margin', '0');
	$('.layout').css('width', 'auto');
}

var $ = require('jquery');
applyStyle();
