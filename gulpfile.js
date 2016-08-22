var gulp = require('gulp');
var zip = require('gulp-zip');

gulp.task('default', function() {
  return gulp.src(['**/*', '!{node_modules,node_modules/**,nbproject,nbproject/**}'])
        .pipe(zip((new Date()).getTime() + '.zip'))
        .pipe(gulp.dest('.'));
});