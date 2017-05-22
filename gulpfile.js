var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
// var imagemin = require('gulp-imagemin');
// var pngcrush = require('imagemin-pngcrush');

var path = {
scripts:['src/*.js','src/**/*.js'],
css:"src/css/*",
images:'src/img/*'
};
var projectPath = '../AdminLTE-template/lib/bower-website-ui/';

gulp.task('concat', function () {
    gulp.src(path.scripts)
        .pipe(concat('website-ui.js'))
        .pipe(gulp.dest('./bower-website-ui/js'))
});

gulp.task('jshint', function () {
    gulp.src(path.scripts)
        .pipe(jshint());
});

gulp.task('cssmin',function(){
  return gulp.src(path.css)
      .pipe(concat('all.min.css'))
      .pipe(gulp.dest('./bower-website-ui/css'));
});

gulp.task('uglify', function () {
    gulp.src(path.scripts)
        .pipe(uglify())
        .pipe(concat('website-ui.min.js'))
        .pipe(gulp.dest('./bower-website-ui/js'))
});
// gulp.task('imagemin', function () {
//   return gulp.src(path.images)
//       .pipe(imagemin({
//         progressive: true,
//         svgoPlugins: [{removeViewBox: false}],
//         use: [pngcrush()]
//       }))
//       .pipe(gulp.dest('./bower-website-ui/img'))
// });

gulp.task('concat_dev', function () {
  gulp.src(path.scripts)
      .pipe(concat('website-ui.js'))
      .pipe(gulp.dest(projectPath+'js'))
});


gulp.task('cssmin_dev',function(){
  return gulp.src(path.css)
      .pipe(concat('all.min.css'))
      .pipe(gulp.dest(projectPath+'css'));
});

gulp.task('uglify_dev', function () {
  gulp.src(path.scripts)
      .pipe(uglify())
      .pipe(concat('website-ui.min.js'))
      .pipe(gulp.dest(projectPath+'/js'))
});
// gulp.task('imagemin_dev', function () {
//   return gulp.src(path.images)
//       .pipe(imagemin({
//         progressive: true,
//         svgoPlugins: [{removeViewBox: false}],
//         use: [pngcrush()]
//       }))
//       .pipe(gulp.dest(projectPath+'img'))
// });


gulp.task('default', ['concat','jshint','uglify','cssmin']);
gulp.task('dev', ['concat_dev','jshint','uglify_dev','cssmin_dev'],function(){
  gulp.watch([path.scripts,path.css],['dev']);
});
