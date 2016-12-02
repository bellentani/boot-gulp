var gulp = require('gulp'),
sass = require('gulp-sass'),
compass = require('gulp-compass'),
neat = require('node-neat').includePaths,
sourcemaps = require('gulp-sourcemaps'),
handlebars = require('gulp-compile-handlebars'),
rename = require('gulp-rename'),
dir = require('node-dir'),
browserSync = require('browser-sync').create(),
del = require('del'),
useref = require('gulp-useref'),
uglify = require('gulp-uglify'),
gulpIf = require('gulp-if'),
cssnano = require('gulp-cssnano'),
imagemin = require('gulp-imagemin'),
runSequence = require('run-sequence'),
mainBowerFiles = require('main-bower-files'),
bower = require('gulp-bower'),
regexRename = require('gulp-regex-rename');

var config = {
  srcPath: 'src/',
  distPath: 'dist/',
  bowerDir: 'src/components'
};

require('gulp-stats')(gulp);

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: config.distPath,
    },
    port: 8080,
    startPath: 'main.html',
  })
});

gulp.task('sass', function(){
  return gulp.src(config.srcPath+'sass/**/*.+(scss|sass)')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: require('node-bourbon').with(config.distPath+'sass/').concat(neat)
    }).on('error', sass.logError)) // Using gulp-sass
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.distPath+'css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('compass', function() {
  gulp.src(config.srcPath+'sass/**/*.+(scss|sass)')
    .pipe(compass({
      css: config.distPath+'css/',
      sass: config.srcPath+'sass/',
      style: 'compressed',
      sourcemap: true
    }))
    .on('error', function(error) {
      // Would like to catch the error here
      console.log(error);
      this.emit('end');
    })
    //.pipe(minifyCSS())
    .pipe(gulp.dest(config.distPath+'css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('fonts', function() {
  return gulp.src([
    config.srcPath+'fonts/**/*',
    '!'+config.srcPath+'fonts/**/*.+(html|css)'
  ])
  .pipe(gulp.dest(config.distPath+'fonts'))
});

gulp.task('copy:root', function() {
  return gulp.src([
    config.srcPath+'/*.*',
    '!'+config.srcPath+'/*.+(zip|rar|psd)'
  ])
  .pipe(gulp.dest(config.distPath))
});

gulp.task('images', function() {
  return gulp.src([
    config.srcPath+'**/*.{png,jpg,gif,svg}',
    '!'+config.srcPath+'fonts/**/*.*'
  ])
  .pipe(gulp.dest(config.distPath))
});

gulp.task('images:opt', function() {
  return gulp.src([
    config.distPath+'**/*.{png,jpg,gif,svg}',
    '!'+config.srcPath+'fonts/**/*.*'
  ])
  .pipe(imagemin())
  .pipe(gulp.dest(config.distPath))
});

gulp.task('js', function() {
  return gulp.src([
    config.srcPath+'**/*.js',
    '!'+config.srcPath+'templates/**/*.*'
  ])
  .pipe(gulp.dest(config.distPath))
});

gulp.task('useref', function(){
  return gulp.src(config.distPath+'**/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest(config.distPath))
});

gulp.task('hbs', function() {
  //var path = require('path');
  //var partialsList = './'+config.srcPath+'templates/partials'+path;
  var partialsDir = config.srcPath+'templates/partials';
  //var dirName = path.dirname(partialsList);
  //console.log(dirName);

  var subdirsList = dir.subdirs(partialsDir, function(err, subdirs) {
    if (err) {
      throw err;
    } else {
      //console.log(subdirs);
      var batchList = subdirs;
      batchList.push('./'+config.srcPath+'templates/partials/');

      var content = require('./'+config.srcPath+'templates/data/main.json');
      var helper = require('./'+config.srcPath+'templates/helpers/main-helper.js');
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
          config.srcPath+'templates/pages/**/*.hbs',
          //'!'+config.srcPath+'templates/**/*.hbs',
        ])
        .pipe(handlebars(content, options))
        .pipe(rename({extname: '.html'}))
        .pipe(gulp.dest(config.distPath))
        .pipe(browserSync.reload({
          stream: true
        }))
    }
  });
});

gulp.task('clean:dist', function() {
  console.log('deleta');
  return del.sync(config.distPath);
})

gulp.task('watch', ['browserSync'], function(callback){
  runSequence('clean:dist',
    ['sass', 'js', 'hbs', 'images', 'fonts', 'copy:root'],
    callback
  );
  gulp.watch([
    config.srcPath+'templates/**/*.hbs',
    config.srcPath+'templates/data/**/*.*'
  ], ['hbs']);
  gulp.watch(config.srcPath+'sass/**/*.+(scss|sass)', ['sass']);
  gulp.watch([
    config.srcPath+'fonts/**/*',
    '!'+config.srcPath+'fonts/**/*.+(html|css)'
  ], ['fonts']);
  gulp.watch([
    config.srcPath+'**/*.js',
    '!'+config.srcPath+'templates/**/*.*'
  ], ['js']);
  gulp.watch([
    config.srcPath+'**/*.{png,jpg,gif,svg}',
    '!'+config.srcPath+'fonts/**/*.*'
  ], ['images']);
  gulp.watch([
    config.srcPath+'fonts/**/*',
    config.distPath+'js/**/*.js',
    config.distPath+'*.[html|css]',
    '!'+config.srcPath+'fonts/**/*.+(html|css)'
  ], browserSync.reload);
})

gulp.task('build', function (callback) {
  runSequence('clean:dist',
    ['sass', 'js', 'hbs', 'images', 'fonts', 'copy:root'],
    callback
  )
});

gulp.task('build:min', function (callback) {
  runSequence('clean:dist',
    ['sass', 'js', 'hbs', 'useref', 'images', 'images:opt', 'fonts', 'copy:root'],
    callback
  )
});

//Funciona quando usando o Compass - depende do Rails + Sass + Compass instalados e configurados na máquina
gulp.task('watch-compass', ['browserSync'], function(callback){
  runSequence('hbs', //clean:dist e a task original aqui, removida porque deu problema no windows
    ['compass', 'js', 'useref', 'images', 'fonts'],
    callback
  );
  gulp.watch([
    config.srcPath+'templates/**/*.hbs',
    config.srcPath+'templates/data/**/*.*'
  ], ['hbs']);
  gulp.watch(config.srcPath+'sass/**/*.+(scss|sass)', ['compass']);
  gulp.watch([
    config.srcPath+'fonts/**/*',
    '!'+config.srcPath+'fonts/**/*.+(html|css)'
  ], ['fonts']);
  gulp.watch([
    config.srcPath+'**/*.js',
    '!'+config.srcPath+'templates/**/*.*'
  ], ['js']);
  gulp.watch([
    config.srcPath+'**/*.{png,jpg,gif,svg}',
    '!'+config.srcPath+'fonts/**/*.*'
  ], ['images']);
  gulp.watch([
    config.srcPath+'fonts/**/*',
    config.distPath+'js/**/*.js',
    config.distPath+'*.[html|css]',
    '!'+config.srcPath+'fonts/**/*.+(html|css)'
  ], browserSync.reload);
})

gulp.task('build-compass', function (callback) {
  runSequence('clean:dist',
    ['compass', 'js', 'hbs', 'images', 'fonts'],
    callback
  )
});

gulp.task('build-compass:min', function (callback) {
  runSequence('clean:dist',
    ['compass', 'js', 'hbs', 'useref', 'images', 'images:opt', 'fonts'],
    callback
  )
});

/*/------------------//
   Controles do Bower
/-------------------/*/
gulp.task('bowerInit', function() {
  return bower()
});
//Copia JS do Bower
gulp.task('jsVendors', function() {
  return gulp.src([
    config.srcPath+'components/jquery/dist/jquery.js',
    config.srcPath+'components/jquery/dist/jquery.min.js',
    config.srcPath+'components/isMobile/isMobile.js',
    config.srcPath+'components/isMobile/isMobile.min.js'
  ])
  .pipe(gulp.dest(config.srcPath+'js/vendors/'))
});
gulp.task('jsPlugins', function() {
  return gulp.src([
    config.srcPath+'components/owl.carousel/dist/owl.carousel.js',
    config.srcPath+'components/owl.carousel/dist/owl.carousel.min.js'
  ])
  .pipe(gulp.dest(config.srcPath+'js/plugins/'))
});
gulp.task('scssPlugins', function() {
  //owl.carousel specifics
  gulp.src([
    config.srcPath+'components/owl.carousel/src/scss/*.scss',
  ])
  .pipe(gulp.dest(config.srcPath+'sass/plugins/owl.carousel'));
  //iCheck css
  gulp.src([
    config.srcPath+'components/iCheck/skins/**/*.css'
  ])
  //.pipe(gulpif(condition, rename({prefix: '_', extname: '.scss'}) ))
  .pipe(rename({prefix: '_', extname: '.scss'}))
  .pipe(gulp.dest(config.srcPath+'sass/plugins/icheck/'));
  //iCheck img
  gulp.src([
    config.srcPath+'components/iCheck/skins/**/*.png'
  ])
  .pipe(gulp.dest(config.srcPath+'sass/plugins/icheck/'));
});

gulp.task('bittersRefillsScss', function() {
  //refills
  gulp.src([
    config.srcPath+'components/refills/source/stylesheets/**/*.scss',
    config.srcPath+'components/refills/source/stylesheets/**/*.css'
  ])
  .pipe(gulp.dest(config.srcPath+'sass/project/refills/'));
  //bitters
  gulp.src([config.srcPath+'components/bitters/core/*.scss'])
  .pipe(gulp.dest(config.srcPath+'sass/project/bitters'));
  //console.log('bitters')
});

gulp.task('refillsHbs', function() {
  //refills
  gulp.src([
    config.srcPath+'components/refills/source/**/*.html.erb'
  ])
  .pipe(regexRename(/\.html\.erb$/, '.hbs'))
  .pipe(rename({prefix: 'ref'}))
  .pipe(gulp.dest(config.srcPath+'templates/partials/reffils'));

  //images
  gulp.src([
    config.srcPath+'components/refills/source/images/**/*.*'
  ])
  .pipe(gulp.dest(config.srcPath+'images/'));

  //svg
  gulp.src([
    config.srcPath+'components/refills/source/svgs/**/*.*'
  ])
  .pipe(gulp.dest(config.srcPath+'svgs/'));

  //javascripts
  gulp.src([
    config.srcPath+'components/refills/source/javascripts/**/*.*'
  ])
  .pipe(gulp.dest(config.srcPath+'js/'));
});

gulp.task('bowerBuild', function (callback) {
  runSequence('clean:dist',
    ['bowerInit', 'jsVendors', 'jsPlugins', 'scssPlugins', 'bittersRefillsScss', 'refillsHbs'],
    callback
  )
});


//Tarefa padrão do Gulp
gulp.task('default', function (callback) {
  runSequence(['build', 'browserSync', 'watch'],
    callback
  )
});
