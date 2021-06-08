/* eslint-disable strict */

'use strict';

/* eslint-enable strict */
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();

const runSequence = require('run-sequence');
const S = require('string');

delete require.cache[require.resolve('./meta.json')]
const gulp = require('./gulp')([
  'assets',
  'aws-test',
  'browserify',
  'clear-test',
  'plain-images',
  'optimize-images',
  'resize-images',
  'scss',
  'templates',
  'server',
  'watchify',
]);
const meta = require('./meta.json');


const appName = S(meta.name).slugify().s;

gulp.task('default', [
  'assets',
  'img',
  'styles',
  'scss',
  'watchify',
  'templates',
  'server',
], function() {
  gulp.watch('sass/**/*.scss', ['styles']);
  gulp.watch('/index.html', ['copy-html']);
  browserSync.init({
    server: './'
  });
});

gulp.task('img', (cb) => {
  runSequence('optimize-images', 'resize-images', 'plain-images', cb);
});

gulp.task('styles', function() {
  gulp.src('sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});

gulp.task('deploy', () => src('./dist/**/*').pipe(ghPages()));

gulp.task('build', ['assets', 'img', 'scss', 'templates', 'browserify']);


// gulp.task('publish', (cb) => { runSequence('build', 'aws', 'clear-test', cb); });


// gulp.task('publish-test', (cb) => { runSequence('build', 'aws-test', cb); });
