const del = require('del');
const env = require('gulp/env');
const gulp = require('gulp');
const gulp_if = require('gulp-if');
const livereload = require('gulp-livereload');
const path = require('path');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');

const output_dir =  path.join(env.outputDirectory, 'assets', 'css');
const sources_dir = 'sources/sass';

const sources = (env.isDevelopment
	? path.join(sources_dir, '**/*.scss')
	: path.join(sources_dir, 'style.scss'));

gulp.task('sass-clean', () => del(output_dir));

gulp.task('sass', () => gulp.src(sources)
	.pipe(gulp_if(env.isDevelopment, sourcemaps.init()))
	.pipe(sass({
		includePaths: [sources_dir],
		outputStyle: 'compressed'
	})).on('error', sass.logError)
	.pipe(gulp_if(env.isDevelopment, sourcemaps.write()))
	.pipe(gulp.dest(output_dir))
	.pipe(livereload())
);

gulp.task('sass-watch', ['sass'], () => gulp.watch(sources, ['sass']));

module.exports = {
	build: 'sass',
	clean: 'sass-clean',
	watch: 'sass-watch'
};
