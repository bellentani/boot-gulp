var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var handlebars = require('gulp-compile-handlebars');
var rename = require('gulp-rename');
var dir = require('node-dir');
var browserSync = require('browser-sync').create();
var del = require('del');


gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    },
  })
});

gulp.task('sass', function(){
  return gulp.src('src/scss/**/*.+(scss|sass)')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: require('node-bourbon').with('src/scss/')
    }).on('error', sass.logError)) // Using gulp-sass
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// gulp.task('autoprefixer', function () {
//   var postcss      = require('gulp-postcss');
//   var autoprefixer = require('autoprefixer');
//
//   return gulp.src('dist/css/**/*.css')
//     .pipe(sourcemaps.init())
//     .pipe(postcss([ autoprefixer({
//       browsers: ['last 5 versions'],
//       cascade: false
//     }) ]))
//     //.pipe(sourcemaps.write('.'))
//     .pipe(gulp.dest('dist/css/'));
// });

gulp.task('fonts', function() {
  return gulp.src(['src/fonts/**/*', '!src/fonts/**/*.+(html|css)'])
  .pipe(gulp.dest('dist/fonts'))
})

gulp.task('handlebars', function() {
  //var path = require('path');
  //var partialsList = './src/templates/partials'+path;
  var partialsDir = './src/templates/partials';
  //var dirName = path.dirname(partialsList);
  //console.log(dirName);

  var subdirsList = dir.subdirs(partialsDir, function(err, subdirs) {
    if (err) {
      throw err;
    } else {
      //console.log(subdirs);
      var batchList = subdirs;
      batchList.push('src/templates/partials/');

      var content = require('./src/templates/data/main.json');
      var helper = require('./src/templates/helpers/main-helper.js');
      var options = {
        //ignorePartials: true,
        // partials : {
        //   footer : '<footer>the end</footer>'
        // },
        batch: batchList,
        helpers : helper
      }
      console.log(batchList);
      return gulp.src([
          'src/templates/pages/**/*.hbs',
          //'!src/templates/**/*.hbs',
        ])
        .pipe(handlebars(content, options))
        .pipe(rename({extname: '.html'}))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({
          stream: true
        }))
    }
  });
});

gulp.task('clean:dist', function() {
  return del.sync('dist');
})

//gulp.task('default', ['handlebars']);

gulp.task('watch', ['clean:dist', 'browserSync', 'sass', 'handlebars'], function(){
  gulp.watch(['src/templates/**/*.hbs', 'src/templates/data/**/*.*'], ['handlebars']);
  gulp.watch('src/scss/**/*.scss', ['sass']);
  gulp.watch(['src/fonts/**/*', '!src/fonts/**/*.+(html|css)'], ['fonts']);
  gulp.watch('dist/*.html', browserSync.reload);
  gulp.watch('dist/js/**/*.js', browserSync.reload);
  gulp.watch(['src/fonts/**/*', '!src/fonts/**/*.+(html|css)'], browserSync.reload);
})
