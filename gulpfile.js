var gulp = require('gulp');
var rename = require('gulp-rename');
var ejs = require('gulp-ejs');

var settings = { 
	functionPrefix: 'PioneerDDJSR',
	filePrefix: 'PIONEER_DDJ-SR',
	name: 'Pioneer DDJ-SR',
	author: 'Hilton Rudham &lt;hiltonrudham@gmail.com&gt;',
	description: 'Pioneer DDJ-SR configuration for 2 decks on midi channels 1 and 2'
};

var compileJs = function() {
	return gulp
		.src('source/scripts/scripts.js')
		.pipe(rename(settings.filePrefix + '-scripts.js'))
		.pipe(gulp.dest('bin'));
};

var compileXml = function() {
	var paths = [
		'./source/mappings/controls/playlist.js',
		'./source/mappings/controls/mixer.js',
		'./source/mappings/controls/channel.js',
		'./source/mappings/controls/jog-wheel.js',
		'./source/mappings/controls/performance-pads/hot-cue.js',
		'./source/mappings/controls/performance-pads/roll.js',
		'./source/mappings/controls/performance-pads/sampler.js',
		'./source/mappings/controls/effects.js',
	];

	var controls = [];
	for (var i = 0; i < paths.length; i++) {
		var manager = require(paths[i]);
		controls = controls.concat(manager.controls);

		// Remove the mapping from the require cache, otherwise 
		// it won't be reloaded correctly when using `watch`.
		delete require.cache[require.resolve(paths[i])];
	}
	
	return gulp.src('source/mappings/midi-mapping.xml')
		.pipe(ejs({ settings: settings, controls: controls }))
		.pipe(rename(settings.filePrefix + '.midi.xml'))
		.pipe(gulp.dest('bin'));
};

var copyToLocalAppData = function() {
	return gulp.src(['bin/**/*.*'])
		.pipe(gulp.dest(process.env.LOCALAPPDATA + '/Mixxx/controllers'));
};

gulp.task('compile-xml', compileXml);
gulp.task('compile-js', compileJs);
gulp.task('default', ['compile-xml', 'compile-js'], copyToLocalAppData);

gulp.task(
	'watch',
	function() { 
		var watcher = gulp.watch('source/**/*.js', ['default']);
		watcher.on('change', function(event) {
			console.log(' '); // Just place an empty line between watch builds.
		});
	}
);
	