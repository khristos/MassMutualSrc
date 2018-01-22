var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync').create();
var del = require('del');

// Clean 'dist'
gulp.task('clean', function() {
  return del(['dist/*.html', 'dist/images']);
});

gulp.task('css', function() {
	return gulp.src('src/sass/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.stream())
});

gulp.task('images', function() {
	return gulp.src('src/images/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/images'))
});

gulp.task('copy', function() {
	return gulp.src('src/**/*.+(html|js|json)')
		.pipe(gulp.dest('dist'))
		.pipe(browserSync.stream())
});

gulp.task('browserSync', function() {
	browserSync.init({
		server: {
			baseDir: 'dist'
		}
	})
});

gulp.task('watch', ['browserSync', 'css'], function() {
	gulp.watch('src/sass/**/*.scss', ['css'])
	gulp.watch('src/**/*.+(html|js|json)', ['copy'])
})

/*gulp.task('name', function() {
	return gulp.src('source-folder/sass/styles.scss')
		.pipe(function)
		.pipe(anotherFunction)
		.pipe(gulp.destination('destination-folder'))
});*/