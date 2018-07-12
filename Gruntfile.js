module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-electron');
	grunt.loadNpmTasks('grunt-newer');

	grunt.initConfig({
		electron: {
			mac: {
				options: {
					name: 'Livesplit One',
					dir: 'app',
					icon: 'app/icon.png',
					out: 'build',
					ignore: 'build',
					platform: 'darwin',
					arch: 'x64'
				}
			}
		},
		clean: {
			clean: ['build/']
		}
	});

	var default_tasks = [
		'clean',
		'electron:mac'
	];

	grunt.registerTask('default', default_tasks);
};
