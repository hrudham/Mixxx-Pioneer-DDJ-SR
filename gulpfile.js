var gulp = require('gulp');

gulp.task(
	'default',
	function() 
	{
		return gulp.src(
			[
				'**/*-scripts.js',
				'**/*midi.xml',
			])
			.pipe(gulp.dest(process.env.LOCALAPPDATA + '/Mixxx/controllers'));
	});