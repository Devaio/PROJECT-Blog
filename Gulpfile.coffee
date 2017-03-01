gulp = require 'gulp'
plumber = require 'gulp-plumber'
browserify = require 'gulp-browserify'
coffee = require 'gulp-coffee'
gutil = require 'gulp-util'
stylus = require 'gulp-stylus'
nib = require 'nib'
cssmin = require 'gulp-cssmin'
rename = require 'gulp-rename'
jsmin = require 'gulp-jsmin'
nodemon = require 'gulp-nodemon'
runSequence = require('run-sequence')

gulp.task 'scripts:client', ->
	return gulp.src 'public/js/src/app.coffee', { read: false }
		.pipe plumber()
		.pipe browserify({ transform: ['coffeeify'], extensions: ['.coffee'] })
		.pipe rename 'scripts.js'
	    .pipe(gulp.dest('public/js/lib/'))

# gulp.task 'scripts:server', ->
# 	return gulp.src 'src/**/*.coffee'
# 		.pipe plumber()
# 		.pipe coffee({bare: true}).on('error', gutil.log)
# 		.pipe gulp.dest 'lib/'

gulp.task 'css', ->
	return gulp.src 'public/css/src/styles.styl'
		.pipe plumber()
		.pipe stylus({use : [nib()], errors : true })
		.pipe gulp.dest 'public/css/lib/'

gulp.task 'nodemon', ->
	nodemon({ script : 'lib/app.js', ignore : 'node_modules/**', watch : 'lib/**/*.js' })

gulp.task 'build', ->
	gulp.src 'public/js/lib/scripts.js'
		.pipe plumber()
	    .pipe jsmin()
	    .pipe rename 'build.min.js'
	    .pipe(gulp.dest('public/js/dist/'))
	    
	gulp.src 'public/css/lib/styles.css'
		.pipe cssmin()
		.pipe rename({suffix: '.min'})
		.pipe gulp.dest 'public/css/dist/'

gulp.task 'default', ['scripts:client', 'css'], ->
	runSequence 'nodemon', () ->
		gulp.watch 'public/css/src/**/*.styl', ['css']
		gulp.watch 'public/js/src/**/*.coffee', ['scripts:client']
		# gulp.watch 'src/**/*.coffee', ['scripts:server']
