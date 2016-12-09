var gulp = require("gulp"),
  babel = require("gulp-babel"),
  zip = require('gulp-zip'),
  shell = require('gulp-shell'),
  rm = require('gulp-rimraf');

gulp.task('build', function() {
  return gulp.src('./src/*.js')
    .pipe(zip('skill.zip'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('upload', ['build'], shell.task([
  'aws lambda update-function-code --zip-file fileb://dist/skill.zip --function-name FamilyFeud --profile ff'
]));

gulp.task('clean', function() {
  gulp.src('dist/*').pipe(rm());
});

gulp.task('default', ['upload']);
