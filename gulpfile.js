var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var imagemin = require('gulp-imagemin');
var pngcrush = require('imagemin-pngcrush');

var path = {
scripts:['src/*.js','src/**/*.js'],
css:"src/css/*",
images:'src/img/*'
};

gulp.task('concat', function () {
    gulp.src(path.scripts)
        .pipe(concat('website-ui.js'))
        .pipe(gulp.dest('./build'));
});

gulp.task('jshint', function () {
    gulp.src(path.scripts)
        .pipe(jshint());
});

gulp.task('cssmin',function(){
  return gulp.src(path.css)
      .pipe(concat('all.min.css'))
      .pipe(gulp.dest('./build'));
});

gulp.task('uglify', function () {
    gulp.src(path.scripts)
        .pipe(uglify())
        .pipe(concat('website-ui.min.js'))
        .pipe(gulp.dest('./build'));
});
gulp.task('imagemin', function () {
  return gulp.src(path.images)
      .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngcrush()]
      }))
      .pipe(gulp.dest('./build/img'));
});

gulp.task('default', ['concat','jshint','uglify','cssmin','imagemin']);
