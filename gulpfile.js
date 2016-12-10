var gulp = require("gulp"),
    rm = require('gulp-rimraf'),
    shell = require('gulp-shell'),
    webpack = require('webpack-stream'),
    zip = require('gulp-zip');

gulp.task('clean', function() {
  gulp.src('dist/*').pipe(rm());
});

gulp.task('build', ['clean'], function() {
  return gulp.src('./src/index.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('./dist/')); // produces dist/index.js
});

gulp.task('zip', ['build'], function() {
  return gulp.src('./dist/index.js')
    .pipe(zip('skill.zip'))
    .pipe(gulp.dest('./dist/')); // produces skill.zip
});

gulp.task('upload', ['zip'], shell.task([
  'aws lambda update-function-code --zip-file fileb://dist/skill.zip --function-name FamilyFeud'
]));

gulp.task('default', ['upload']);
