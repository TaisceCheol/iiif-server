var gulp = require('gulp');
var $    = require('gulp-load-plugins')();
var cssnano = require('gulp-cssnano');
var concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    filter = require('gulp-filter'),
    mainBowerFiles = require('main-bower-files'),
    flatten = require('gulp-flatten'),
    imagemin = require('gulp-imagemin');

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

gulp.task('min-css',function() {
  return gulp.src('css/*.css')
    .pipe(cssnano())
    .pipe(gulp.dest('dist/css'))
});

gulp.task('min-images',function() {
  return gulp.src("images/*")
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
})

gulp.task('min-bower-js', function() {
        var dest_path  = 'dist/'
        return gulp.src(mainBowerFiles('**/*.js'))
        .pipe(concat("bower.js"))
        .pipe(uglify())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest(dest_path + '/js'))

});

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

gulp.task('copy-js-folder',function() {
  return gulp.src("js/**")
    .pipe(gulp.dest('dist/js/'))
})

gulp.task('copy-html',function() {
  return gulp.src("*.html")
    .pipe(gulp.dest('dist/'))
})

gulp.task('copy-config',function() {
  return gulp.src("config.json")
    .pipe(gulp.dest('dist/'))
})

gulp.task('build-dist', ['sass','min-css','min-images','min-bower-js','min-bower-css','min-bower-fonts','copy-js-folder','copy-config'])

gulp.task('default', ['sass'], function() {
  gulp.watch(['scss/**/*.scss'], ['sass']);
});
