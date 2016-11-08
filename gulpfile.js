var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('hello', function() {
  // Stuff here
  console.log('Hello Zell');
});

gulp.task('sass', function(){
  return gulp.src('src/scss/**/*.scss')
    .pipe(sass({
      outputStyle: 'compressed',
      sourceMap: true,
    })) // Using gulp-sass
    .pipe(gulp.dest('dist/css'))
});

gulp.task('autoprefixer', function () {
    var postcss      = require('gulp-postcss');
    var sourcemaps   = require('gulp-sourcemaps');
    var autoprefixer = require('autoprefixer');

    return gulp.src('dist/css/**/*.css')
        .pipe(sourcemaps.init())
        .pipe(postcss([ autoprefixer({
          browsers: ['last 5 versions'],
          cascade: false
        }) ]))
        //.pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/css/'));
});

gulp.task('watch', function(){
  gulp.watch('src/scss/**/*.scss', ['sass']);
  // Other watchers
})
