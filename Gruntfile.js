var execSync = require('child_process').execSync;
var fs = require('fs');
var path = require('path');

function fileModifiedTime(file) {
	try {
		var stat = fs.statSync(file);
		var ret = Date.parse(stat.mtime);
		return ret;
	}
	catch(err) {
		return false;
	}
}

function createIcnsFile(grunt, source, name, location) {
	var target = path.join(location, name + ".icns");
	var sourceModified = fileModifiedTime(source);
	var targetModified = fileModifiedTime(target);
	if(!targetModified || targetModified < sourceModified) {
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
			var out = path.join(iconset, name + '_' + key + '.png');
			var cmd = 'sips -z ' + val + ' ' + val + ' ' +
		           	 source + ' --out ' + out;
			grunt.log.write(cmd + "\n");
			execSync(cmd);
		}

		var cmd = 'iconutil -c icns ' +
		          '--output ' + target + ' '
		          + iconset;
		grunt.log.write(cmd + "\n");
		execSync(cmd);
	}
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
			electron: ['build/Livesplit One-darwin-x64'],
			all: ['build/'],
		}
	});

	var default_tasks = [
		'appicon',
		'clean:electron',
		'electron:mac',
	];

	grunt.registerTask('appicon', 'Create app icon', function() {
		grunt.log.write("Creating app icon\n");
		createIcnsFile(grunt, 'icon.png', 'icon', 'build');
	});

	grunt.registerTask('default', default_tasks);
};
