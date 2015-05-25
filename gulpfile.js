var gulp = require('gulp');
var gutil = require('gulp-util');

var path = {
  HTML: 'src/index.html',
  ALL: ['src/js/*.js', 'src/js/**/*.js', 'src/index.html'],
  JS: ['src/js/*.js', 'src/js/**/*.js'],
  MINIFIED_OUT: 'build.min.js',
  DEST_SRC: 'dist/src',
  DEST_BUILD: 'dist/build',
  DEST: 'dist'
};

/*
gulp.task('transform', function(){
  gulp.src(path.JS)
    .pipe(react())
    .pipe(gulp.dest(path.DEST_SRC));
});
*/

gulp.task('default', function(){
    // place code for your default task here
});


