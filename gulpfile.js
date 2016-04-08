'use strict';

var gulp = require('gulp');
var rename = require('gulp-rename');
var usemin = require('gulp-usemin');
var rev = require('gulp-rev');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var rimraf = require('rimraf');
var templateCache = require('gulp-angular-templatecache');
var webserver = require('gulp-webserver');
var jshint = require('gulp-jshint');
var inject_string = require('gulp-inject-string');

var API_URI_PREFIX = {
	local: 'http://localhost:8000/api/v1',
	prod: 'https://editais.cultura.df.gov.br/api/v1'
};

var paths = {
	root: '.',
	src: './src',
	app: {
		root: './src/app',
		js: './src/app/**/*.js',
		html: './src/app/**/*.html',
		constants: './src/app/app.constant.js'
	},
	public: {
		index: './src/public/index.html',
		html: './src/public/*.html',
		pages: './src/public/pages/**/*.html',
		js: {
			app: 'src/public/build/js/app.js',
			all: ['src/public/build/js/app.js']
		},
		img: {
			root: './src/public/build/img',
			images: './src/public/build/img/**/*',
		},
		fonts: {
			material: './src/public/vendors/material-design-icons/iconfont/**/*'
		}
	},
	dist: {
		root: './src/public/dist',
		app: {
			root: './src/public/dist/app',
			html: './src/public/dist/app/html',
		},
		public: {
			pages: './src/public/dist/pages',
			css: './src/public/dist/css',
			js: './src/public/dist/js',
			img: './src/public/dist/img',
			fonts: './src/public/dist/fonts'
		}
	}
};

/**
 * removes css- and js-dist folder.
 */
gulp.task('clean', function() {
	rimraf.sync(paths.dist.root);
});

gulp.task('usemin:local', function () {
	return gulp.src('./src/public/index.html')
	.pipe(usemin({
		enableHtmlComment: false,
		jsAttributines: {
			async: false
		},
		css: [minifyCSS({rebase: false}), 'concat', rev()],
		layout_css: [minifyCSS(), 'concat', rev()],
		vendor_css: [minifyCSS(), 'concat', rev()],
		vendor_print: [minifyCSS(), 'concat', rev()],
		layout_js: [uglify(), rev()],
		layout_config: [uglify(), rev()],
		lib: [uglify(), rev()],
		app: [uglify(), rev()]
	}))
	.pipe(gulp.dest(paths.dist.root));
});

gulp.task('usemin:prod', ['inject:api_uri_prod'], function () {
	return gulp.src('./src/public/index.html')
	.pipe(usemin({
		enableHtmlComment: false,
		jsAttributines: {
			async: false
		},
		css: [minifyCSS({rebase: false}), 'concat', rev()],
		layout_css: [minifyCSS(), 'concat', rev()],
		vendor_css: [minifyCSS(), 'concat', rev()],
		vendor_print: [minifyCSS(), 'concat', rev()],
		layout_js: [uglify(), rev()],
		layout_config: [uglify(), rev()],
		lib: [uglify(), rev()],
		app: [uglify(), rev()]
	}))
	.pipe(gulp.dest(paths.dist.root));
});

gulp.task('usemin:fonts', function() {
	return gulp.src([paths.public.fonts.material])
	.pipe(gulp.dest(paths.dist.public.fonts));
});

gulp.task('inject:api_uri_local', function() {
	return gulp.src(paths.app.constants)
		.pipe(inject_string.replace(
			API_URI_PREFIX.prod, API_URI_PREFIX.local
		))
		.pipe(gulp.dest(paths.app.root));
});

gulp.task('inject:api_uri_prod', function() {
	return gulp.src(paths.app.constants)
		.pipe(inject_string.replace(
			API_URI_PREFIX.local, API_URI_PREFIX.prod
		))
		.pipe(gulp.dest(paths.app.root));
});

gulp.task('imagemin', function() {
	return gulp.src(paths.public.img.images)
	.pipe(imagemin({ progressive: true }))
	.pipe(gulp.dest(paths.dist.public.img));
});

gulp.task('html', function () {
	return gulp.src(paths.app.html)
	.pipe(templateCache({
		module: 'metaidApp'
	}))
	.pipe(gulp.dest(paths.dist.app.html));
});

gulp.task('html:pages', function() {
	return gulp.src(paths.public.pages)
	.pipe(gulp.dest(paths.dist.public.pages));
});

gulp.task('watch', function () {
	gulp.watch([paths.app.js, paths.app.html, paths.public.html, paths.public.pages, paths.public.index], ['clean', 'usemin:local', 'usemin:fonts', 'imagemin', 'html', 'html:pages']);
});

gulp.task('uglify:app', function () {
	return gulp
	.src(paths.app.js)
	.pipe(rename('app.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest(paths.dist.app));
});

gulp.task('jshint', function () {
	return gulp
	.src('dist/js/app.js')
	.pipe(jshint())
	.pipe(jshint.reporter('default'))
	;
});

gulp.task('webserver', function() {
	//gulp.src('./src')
	gulp.src(paths.dist.root)
	.pipe(webserver({
		host: '0.0.0.0',
		port: 5000
	}));
});

gulp.task('build', ['clean', 'usemin:local', 'usemin:fonts', 'imagemin', 'html', 'html:pages']);

gulp.task('build:prod', ['clean', 'usemin:prod', 'usemin:fonts', 'imagemin', 'html', 'html:pages']);

gulp.task('default', ['build']);
