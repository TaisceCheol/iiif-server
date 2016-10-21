var gulp = require('gulp');
var $    = require('gulp-load-plugins')();
var cssnano = require('gulp-cssnano');
var concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    filter = require('gulp-filter'),
    mainBowerFiles = require('main-bower-files'),
    flatten = require('gulp-flatten'),
    ga = require('gulp-ga'),
    favicons = require("gulp-favicons"),
    htmlmin = require('gulp-htmlmin'),
    imagemin = require('gulp-imagemin'),
    print = require('gulp-print'),
    del = require('del'),
    fs = require('fs')

var sassPaths = [
  'bower_components/foundation-sites/scss',
  'bower_components/motion-ui/src'
];

gulp.task('sass', function() {
  return gulp.src('scss/app.scss')
    .pipe($.sass({
      includePaths: sassPaths,
      outputStyle: 'compressed' // if css compressed **file size**
    })
      .on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'ie >= 9']
    }))
    .pipe(gulp.dest('css'));
});

gulp.task('min-css',['sass'],function() {
  return gulp.src('css/*.css')
    .pipe(cssnano())
    .pipe(gulp.dest('dist/css'))
});

gulp.task('min-images',function() {
  return gulp.src("images/*")
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
})

gulp.task('min-bower-css', function() {
        var dest_path  = 'dist/'

        return gulp.src(mainBowerFiles('**/*.css'))
        .pipe(concat("bower.css"))
        .pipe(cssnano())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest(dest_path + '/css'))

});

gulp.task('min-bower-fonts', function() {
        var dest_path  = 'dist/'
        return gulp.src(mainBowerFiles('**/fontawesome**'))
        .pipe(flatten())
        .pipe(gulp.dest(dest_path + '/fonts'))

});

gulp.task('concat-bower-deps', function() {
    return gulp.src(mainBowerFiles('**/*.js'))
        .pipe(print())
        .pipe(concat("bower.js"))
        .pipe(gulp.dest("js/"))      

});

gulp.task('min-js',['concat-bower-deps'],function() {
    return gulp.src(['js/bower.js','js/app.js'])
        .pipe(print())    
        .pipe(concat("app.js"))    
        .pipe(uglify())
        .pipe(gulp.dest("dist/js/"))      
});

gulp.task('copy-html',function() {
  return gulp.src("*.html")
    .pipe(gulp.dest('dist/'))
})

gulp.task('copy-config',function() {
  return gulp.src("config.json")
    .pipe(gulp.dest('dist/'))
})

gulp.task('copy-html',function() {
  return gulp.src("*.html")
    .pipe(ga({url:'auto', uid: 'UA-55482452-6',tag:'body',sendPageView:true,minify:true,anonymizeIp: false}))  
    .pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))    
    .pipe(htmlmin({collapseWhitespace: true}))    
    .pipe(gulp.dest('dist/'))
})

var realFavicon = require ('gulp-real-favicon');
var fs = require('fs');

// File where the favicon markups are stored
var FAVICON_DATA_FILE = 'faviconData.json';

// Generate the icons. This task takes a few seconds to complete.
// You should run it at least once to create the icons. Then,
// you should run it whenever RealFaviconGenerator updates its
// package (see the check-for-favicon-update task below).
gulp.task('generate-favicon', function(done) {
  realFavicon.generateFavicon({
    masterPicture: 'images/logo.png',
    dest: 'dist/',
    iconsPath: '/',
    design: {
      ios: {
        pictureAspect: 'backgroundAndMargin',
        backgroundColor: '#ffffff',
        margin: '18%',
        assets: {
          ios6AndPriorIcons: false,
          ios7AndLaterIcons: false,
          precomposedIcons: false,
          declareOnlyDefaultIcon: true
        }
      },
      desktopBrowser: {},
      windows: {
        pictureAspect: 'whiteSilhouette',
        backgroundColor: '#b91d47',
        onConflict: 'override',
        assets: {
          windows80Ie10Tile: false,
          windows10Ie11EdgeTiles: {
            small: false,
            medium: true,
            big: false,
            rectangle: false
          }
        }
      },
      androidChrome: {
        pictureAspect: 'noChange',
        themeColor: '#ffffff',
        manifest: {
          name: 'Goodman Manuscripts',
          display: 'standalone',
          orientation: 'notSet',
          onConflict: 'override',
          declared: true
        },
        assets: {
          legacyIcon: false,
          lowResolutionIcons: false
        }
      },
      safariPinnedTab: {
        pictureAspect: 'blackAndWhite',
        threshold: 50,
        themeColor: '#5bbad5'
      }
    },
    settings: {
      scalingAlgorithm: 'Mitchell',
      errorOnImageTooSmall: false
    },
    markupFile: FAVICON_DATA_FILE
  }, function() {
    done();
  });
});

gulp.task('build-dist', ['generate-favicon','sass','min-css','min-images','min-js','min-bower-css','min-bower-fonts','copy-config','copy-html'])

gulp.task('default', ['build-dist'], function() {
    gulp.watch(['scss/**/*.scss'], ['build-dist']);
    gulp.watch(['*.html'], ['build-dist']);
    gulp.watch("js/app.js", ["min-js"]) 
});
