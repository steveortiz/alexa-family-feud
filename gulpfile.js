var gulp = require("gulp");
var babel = require("gulp-babel");
var zip = require('gulp-zip');

gulp.task('default', function() {
  return gulp.src('./src/*.js')
    .pipe(zip('skill.zip'))
    .pipe(gulp.dest('./dist/'));
});
