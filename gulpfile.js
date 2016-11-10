var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var handlebars = require('gulp-compile-handlebars');
var rename = require('gulp-rename');
var glob = require('glob');
var dir = require('node-dir');

// tentar usando o glob http://stackoverflow.com/questions/22149966/iterating-over-directories-with-gulp
// ou https://github.com/fshost/node-dir

gulp.task('sass', function(){
  return gulp.src('src/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: require('node-bourbon').with('src/scss/')
    }).on('error', sass.logError)) // Using gulp-sass
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/css'))
});

// gulp.task('autoprefixer', function () {
//   var postcss      = require('gulp-postcss');
//   var sourcemaps   = require('gulp-sourcemaps');
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

gulp.task('handlebars', function() {
  var path = require('path');
  var partialsList = './src/templates/partials'+path;
  var partialsDir = './src/templates/partials';
  var dirName = path.dirname(partialsList);
  console.log(dirName);

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
        .pipe(gulp.dest('dist'));

    }
  });
});

//gulp.task('default', ['handlebars']);

gulp.task('watch', function(){
  gulp.watch(['src/scss/**/*.scss', 'src/templates/pages/**/*.hbs'], ['sass', 'handlebars']);
  // Other watchers
})
