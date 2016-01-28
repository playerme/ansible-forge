'use strict'

/*

the only important tasks are:

 - default (dev watcher)
 - dist (production build)
 - dev (development build)

*/

const babel = require('gulp-babel')
const bSync = require('browser-sync')
const browserify = require('browserify')
const buffer = require('vinyl-buffer')
const concat = require('gulp-concat')
const concatCss = require('gulp-concat-css')
const del = require('del')
const gulp = require('gulp')
const notify = require('gulp-notify')
const plumber = require('gulp-plumber')
const runSequence = require('run-sequence')
const sass = require('gulp-sass')
const source = require('vinyl-source-stream')

const paths = {
	app_js: 'src/app/**/*.js',
	browser_js: 'src/js/**/*.+(js|jsx)',
	js: 'src/**/*.+(js|jsx)',
	sass: 'src/**/*.s?ss'
}

//
// this probably doesn't need to be ran.
//
gulp.task('clean', cb => {
	del(['dist'])
})

gulp.task('js', cb => {
	runSequence('js:build', 'js:bundle', cb)
})

gulp.task('js:build', cb => {
	return gulp.src(paths.js)
		.pipe(plumber())
		.pipe(babel({ presets: ['es2015', 'stage-0', 'react'], plugins: ["transform-regenerator", "transform-runtime"] }))
		.pipe(gulp.dest('dist'))
})

// 
// This task is separated because there are JS files that only node touch and JS files that only the browser touches.
//
gulp.task('js:bundle', cb => {
	var b = browserify({
	    entries: './dist/js/forge.js',
	    debug: true,
	    ignore: paths.app_js,
 	})

	return b.bundle()
		.on('error', function(e) { console.error('[error in bundler]: ', e.message); this.emit('end') })
		.pipe(plumber())
		.pipe(source('bundle.js'))
		.pipe(buffer())
		.pipe(gulp.dest('dist/js'))
		.pipe(notify('JS bundled.'))
})

gulp.task('js:watch', cb => {
	gulp.watch(paths.app_js, ['js:build'])
	gulp.watch(paths.browser_js, ['js'])
})

gulp.task('sass', cb => {
	return gulp.src(paths.sass)
		.pipe(plumber())
		.pipe(sass().on('error', sass.logError))
		.pipe(concatCss('app.css'))
		.pipe(gulp.dest('dist/css'))
		.pipe(notify('SASS compiled.'))
})

gulp.task('sass:watch', cb => {
	gulp.watch(paths.sass, ['sass'])
})

//gulp.task('dist', ['js:dist', 'sass:dist'])
gulp.task('watch', ['js:watch', 'sass:watch'])
gulp.task('dev', ['js', 'sass'])
gulp.task('default', ['watch', 'dev'])