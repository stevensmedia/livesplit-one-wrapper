var execSync = require('child_process').execSync;

function createIcnsFile(grunt, source, name, location) {
	var iconset = 'build/' + name + '.iconset';
	execSync('mkdir -p ' + iconset);

	var sizes = {};
	for(size of [16, 32, 128, 256, 512]) {
		sizes['' + size + 'x' + size] = size;
	}
	for(size of [16, 32, 128, 256, 512]) {
		sizes['' + size + 'x' + size + '@2x'] = size * 2;
	}

	for(key in sizes) {
		var val = sizes[key];
		var cmd = 'sips -z ' + val + ' ' + val + ' ' +
		           source +
		           ' --out ' + iconset + '/' +
		           name + '_' + key + '.png';
		grunt.log.write(cmd + "\n");
		execSync(cmd);
	}

	var cmd = 'iconutil -c icns ' +
	          '--output ' + location + '/' + name + '.icns '
	          + iconset;
	grunt.log.write(cmd + "\n");
	execSync(cmd);
}

module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-electron');
	grunt.loadNpmTasks('grunt-newer');

	grunt.initConfig({
		electron: {
			mac: {
				options: {
					name: 'Livesplit One',
					dir: '.',
					icon: 'build/icon',
					out: 'build',
					ignore: 'build',
					platform: 'darwin',
					arch: 'x64',
				}
			}
		},
		clean: {
			clean: ['build/']
		}
	});

	var default_tasks = [
		'clean',
		'appicon',
		'electron:mac'
	];

	grunt.registerTask('appicon', 'Create app icon', function() {
		grunt.log.write("Creating app icon\n");
		createIcnsFile(grunt, 'icon.png', 'icon', 'build');
	});

	grunt.registerTask('default', default_tasks);
};
