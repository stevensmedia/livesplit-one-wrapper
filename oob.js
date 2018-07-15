function applyStyle() {
	if(!$('.livesplit-container').length) {
		console.log('waiting');
		setTimeout(applyStyle, 1);
		return;
	}
		console.log('going');
	$('.livesplit-container > div').css('margin', '0');
	$('.layout').css('width', 'auto');
}

var $ = require('jquery');
applyStyle();
