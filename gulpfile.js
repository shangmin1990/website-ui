var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');

var path = {
scripts:['src/*.js','src/**/*.js']
};

gulp.task('concat', function () {
    gulp.src(path.scripts)
        .pipe(concat('website-ui.js'))
        .pipe(gulp.dest('./bower-website-ui'));
});

gulp.task('jshint', function () {
    gulp.src(path.scripts)
        .pipe(jshint());
});

gulp.task('uglify', function () {
    gulp.src(path.scripts)
        .pipe(uglify())
        .pipe(concat('goodjs-ui.min.js'))
        .pipe(gulp.dest('./bower-website-ui'));
});

gulp.task('default', ['concat','jshint','uglify']);
