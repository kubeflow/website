'use strict';

// 'false' for development mode. turning on will minify and strip out debug comments, etc.
var IN_PRODUCTION = false;

// include gulp
var gulp = require('gulp');

// #### PLUGINS ####//
// bourbon and neat framework: https://bourbon.io/ https://neat.bourbon.io/
var bourbon = require("bourbon").includePaths;
var neat = require("bourbon-neat").includePaths;


var jshint = require('gulp-jshint'); // JS error reporting. Docs: http://jshint.com/docs/
// var replace = require('gulp-replace');
var rename = require('gulp-rename'); // renames files
var changed = require('gulp-changed'); // only updates the files that changed
var imagemin = require('gulp-imagemin'); // minify gif, jpg, png, svg
var concat = require('gulp-concat'); // concatenates files in order specified in the task
var stripDebug = require('gulp-strip-debug'); // Strip console, alert, and debugger statements from JavaScript code
var minifyHTML = require('gulp-htmlmin'); // minify html files. Options/docs: https://github.com/kangax/html-minifier
var autoprefix = require('gulp-autoprefixer'); // cleans and adds browser prefixes automatically: https://github.com/postcss/autoprefixer
var sourcemaps = require('gulp-sourcemaps'); // write css and javascript sourcemaps 
var sass = require('gulp-sass'); // sass compiler. Docs: https://github.com/dlmanning/gulp-sass
var csso = require('gulp-csso'); // minifies CSS. supports sourcemaps. Docs: https://github.com/ben-eb/gulp-csso
var uglify = require('gulp-uglify'); // minify files with UglifyJS: https://github.com/terinjokes/gulp-uglify
var gulpif = require('gulp-if'); // ternerary plugin. conditionally run a task


// id JS bugs
gulp.task('jshint', function () {
	gulp.src('./src/scripts/*.js')
		.pipe(jshint())
		.pipe(jshint({asi:'true'}))
		.pipe(jshint.reporter('default'));
});

// minify new images
gulp.task('imagemin', function() {
	var imgSrc = './src/images/**/*',
		imgDst = '../static/images/';

	gulp.src(imgSrc)
		.pipe(changed(imgDst))
		.pipe(imagemin())
		.pipe(gulp.dest(imgDst));
});

// copy fonts into _assets
gulp.task('fonts', function() {
	var fontSrc = './src/styles/fonts/**/*',
		fontDst = './public/_assets/styles/fonts/';

	gulp.src(fontSrc)
		.pipe(changed(fontDst))
		.pipe(gulp.dest(fontDst));
});

// copy third_party into assets
gulp.task('third_party', function() {
	var thirdPartySrc = './src/third_party/**/*',
		thirdPartyDst = './public/_assets/third_party/';

	gulp.src(thirdPartySrc)
		.pipe(changed(thirdPartyDst))
		.pipe(gulp.dest(thirdPartyDst));
});

// create and minify html pages from those in src directory
gulp.task('htmlpage', function() {
	var htmlSrc = ['./src/*.html'],
		htmlDst = './public/';

	gulp.src(htmlSrc)
		.pipe(changed(htmlDst))
		.pipe(gulpif(IN_PRODUCTION, minifyHTML()))
		.pipe(gulp.dest(htmlDst));
});

// concat, de-comment & log, minify scripts
gulp.task('scripts', function() {
	var scriptsArray = [
		'./src/scripts/third_party/jquery.migrate.min.js',
		'./src/scripts/third_party/jquery.breakpoints.js',
		'./src/scripts/third_party/jquery.matchHeight-min.js',
		'./src/scripts/*.js'
	];
	gulp.src(scriptsArray)
		.pipe(gulpif(!IN_PRODUCTION, sourcemaps.init()))
		.pipe(concat('scripts.js'))
		.pipe(gulpif(!IN_PRODUCTION, sourcemaps.write()))
		.pipe(gulpif(IN_PRODUCTION, stripDebug()))
		.pipe(gulpif(IN_PRODUCTION, uglify()))
		.pipe(gulp.dest('../static/js/'));
});

// SASS
gulp.task('sass', function () {
	var cssDest = '../static/css/';
	var stylesArray = ['./src/styles/styles.sass'];
	gulp.src(stylesArray)
		.pipe(gulpif(!IN_PRODUCTION, sourcemaps.init()))
		.pipe(sass({
            includePaths: ['sass'].concat(bourbon, neat)
        }).on('error', sass.logError))
		.pipe(autoprefix('last 4 versions'))
		.pipe(concat('styles.css'))
		.pipe(gulpif(IN_PRODUCTION, csso()))
		.pipe(gulpif(!IN_PRODUCTION, sourcemaps.write()))
		// .pipe(replace('../../images', '../images'))
		.pipe(gulp.dest(cssDest));
});

// default gulp task
gulp.task('default', ['jshint', 'imagemin', 'scripts', 'sass'], function() {
	// watch for JS changes
	gulp.task('src/scripts/*.js', ['jshint', 'scripts']);

	// watch for image changes
	gulp.task('src/images/**/*', ['imagemin']);

	// watch for font files
	//gulp.watch('src/styles/fonts/**/*', ['fonts']);

	// watch for third_party files
	// gulp.watch('src/third_party/**/*', ['third_party']);

	// watch for html page changes
	// gulp.watch(['src/*.html','src/**/*.html'], ['htmlpage']);

	// watch for CSS changes
	gulp.task('src/styles/**/*.sass', ['sass']);

});
