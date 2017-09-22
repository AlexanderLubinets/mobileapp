var gulp = require('gulp'),
		sass = require('gulp-sass'),
		browserSync = require('browser-sync').create(),
		reload = browserSync.reload,
		concat = require('gulp-concat'),
		cssnano = require('gulp-cssnano'),
		uglify = require('gulp-uglify'),
		pump   = require('pump'),
		autoprefixer = require('gulp-autoprefixer'),
		imagemin = require('gulp-imagemin'),
		spritesmith = require('gulp.spritesmith');


gulp.task('sass', function(){
	return gulp.src('app/scss/**/*.scss')
		.pipe(sass())
		.pipe(autoprefixer({
			browsers: ['last 3 versions'],
			cascade: false
		}))
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.stream())
});

gulp.task('concat', function(){
	return gulp.src(['app/libs/normalize-css/normalize.css',
										'app/libs/font-awesome/css/font-awesome.css',
										'app/libs/swiper/dist/css/swiper.css',
										'app/css/style.css'])
	.pipe(concat('style.min.css'))
	.pipe(gulp.dest('app/css'))
});

gulp.task('copy', function(){
	return gulp.src('app/index.html')
		.pipe(gulp.dest('dist'));
});

gulp.task('copySCSS', function(){
	return gulp.src('app/scss/*.scss')
		.pipe(gulp.dest('dist/scss'));
});

/*
gulp.task('browserSync', function(){
	browserSync.init({
		server: 'app'
	});
});*/

gulp.task('browserSync', function(){
	browserSync.init({
		server: 'dist'
	});
});

gulp.task('cssnano', function(){
	return gulp.src('app/css/style.min.css')
	.pipe(cssnano())
	.pipe(gulp.dest('dist/css'))
});


gulp.task('js', function(){
	return gulp.src(['app/libs/jquery/dist/jquery.min.js',
										'app/libs/swiper/dist/js/swiper.jquery.min.js'])
	.pipe(concat('libs.min.js'))
	.pipe(gulp.dest('dist/js'))
});

gulp.task('uglify', function(){
	pump([
	gulp.src('app/main.js'),
	uglify(),
	gulp.dest('dist/js')
		]
	);
});

gulp.task('sprite', function(){
	var spriteData =  gulp.src('app/images/sprite/*.png').pipe(spritesmith({
		imgName: 'sprite.png',
		cssName: 'sprite.scss'
	}));
	return spriteData.pipe(gulp.dest('app/sprites/'))
});

gulp.task('imagemin', function(){
	return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
	.pipe(imagemin({
		interlaced: true
	}))
	.pipe(gulp.dest('dist/images'))
});

gulp.task('watch', ['sass', 'browserSync'], function(){
	gulp.watch('app/scss/**/*.scss', ['sass'])
	gulp.watch('*.html', reload)
	gulp.watch('js/**/*.js', reload)
});

gulp.task('default', ['watch', 'sass', 'browserSync']);

