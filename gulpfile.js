var gulp = require('gulp');
var ejs = require('gulp-ejs');
var concat = require('gulp-concat');
var rename = require('gulp-rename');

var settings =
{
	functionPrefix: 'PioneerDDJSR',
	filePrefix: 'PIONEER_DDJ-SR',
	name: 'Pioneer DDJ-SR',
	author: 'Hilton Rudham &lt;hiltonrudham@gmail.com&gt;',
	description: 'Pioneer DDJ-SR configuration for 2 decks on midi channels 1 and 2'
};

gulp.task(
	'compile-xml',
	function() 
	{
		var mixer = require('./source/mappings/controls/mixer.js');
		var playlist = require('./source/mappings/controls/playlist.js');
		var channel = require('./source/mappings/controls/channel.js');
		var jogWheel = require('./source/mappings/controls/jog-wheel.js');
		var hotCue = require('./source/mappings/controls/performance-pads/hot-cue.js');
		var roll = require('./source/mappings/controls/performance-pads/roll.js');
		var sampler = require('./source/mappings/controls/performance-pads/sampler.js');
	
		return gulp
			.src('source/mappings/midi-mapping.xml')
			.pipe(
				ejs({ 
					settings: settings,
					controls: playlist
						.concat(mixer)
						.concat(channel)
						.concat(jogWheel)
						.concat(hotCue)
						.concat(roll)
						.concat(sampler)
					}))
			.pipe(rename(settings.filePrefix + '.midi.xml'))
			.pipe(gulp.dest('bin'));
	});

gulp.task(
	'compile-js',
	function() 
	{
		return gulp
			.src('source/scripts/scripts.js')
			.pipe(rename(settings.filePrefix + '-scripts.js'))
			.pipe(gulp.dest('bin'));
	});
	
gulp.task(
	'default',
	['compile-xml', 'compile-js'],
	function() 
	{
		return gulp.src(
			[
				'bin/**/*.*'
			])
			.pipe(gulp.dest(process.env.LOCALAPPDATA + '/Mixxx/controllers'));
	});