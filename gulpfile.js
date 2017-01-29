var gulp = require('gulp');
var ejs = require('gulp-ejs');
var rename = require('gulp-rename');

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
	var playlist = require('./source/mappings/controls/playlist.js');
	var mixer = require('./source/mappings/controls/mixer.js');
	var channel = require('./source/mappings/controls/channel.js');
	var jogWheel = require('./source/mappings/controls/jog-wheel.js');
	var hotCue = require('./source/mappings/controls/performance-pads/hot-cue.js');
	var roll = require('./source/mappings/controls/performance-pads/roll.js');
	var sampler = require('./source/mappings/controls/performance-pads/sampler.js');

	return gulp
		.src('source/mappings/midi-mapping.xml')
		.pipe(ejs({ settings: settings, controls: playlist }))
		.pipe(ejs({ settings: settings, controls: mixer }))
		.pipe(ejs({ settings: settings, controls: channel }))
		.pipe(ejs({ settings: settings, controls: jogWheel }))
		.pipe(ejs({ settings: settings, controls: hotCue }))
		.pipe(ejs({ settings: settings, controls: roll }))
		.pipe(ejs({ settings: settings, controls: sampler }))
		.pipe(rename(settings.filePrefix + '.midi.xml'))
		.pipe(gulp.dest('bin'));
};

gulp.task('compile-xml', compileXml);

gulp.task('compile-js', compileJs);

gulp.task(
	'default',
	['compile-xml', 'compile-js'],
	function() {
		return gulp.src(['bin/**/*.*'])
			.pipe(gulp.dest(process.env.LOCALAPPDATA + '/Mixxx/controllers'));
	}
);

gulp.task(
	'watch',
	function() { 
		var watcher = gulp.watch('source/**/*.js', ['default']);
		watcher.on('change', function(event) {
			console.log(' '); // Just place an empty line between watch builds.
		});
	}
);
	