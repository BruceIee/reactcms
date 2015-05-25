var gulp = require('gulp');
var gutil = require('gulp-util');
var react = require('gulp-react');

var path = {
  JS: ['site/public/script/common/src/*.js'],
  DEST_SRC: 'site/public/script/common/dist'
};

gulp.task('transform', function(){
  gulp.src(path.JS)
    .pipe(react())
    .pipe(gulp.dest(path.DEST_SRC));
});

gulp.task('default',  ['transform']);


