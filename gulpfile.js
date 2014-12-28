
// include gulp
var gulp = require('gulp'); 
 
// include plug-ins
var jshint = require('gulp-jshint');
var changed = require('gulp-changed');
var imagemin = require('gulp-imagemin');
var minifyHTML = require('gulp-minify-html');
var concat = require('gulp-concat');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var addsrc = require('gulp-add-src');
var autoprefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var chmod = require('gulp-chmod');
var ngAnnotate = require('gulp-ng-annotate');

src = "./src/";
dst = "./www/";

// JS hint task
gulp.task('jshint', function() {
  gulp.src(src + "js/*.js")
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// minify new images
gulp.task('imagemin', function() { 
  gulp.src(src + "img/*.png")
    .pipe(changed(dst + "img"))
    .pipe(imagemin())
    .pipe(gulp.dest(dst + "img"));
});

// minify new or changed HTML pages
gulp.task('htmlpage', function() {
  gulp.src(src + "**/*.html")
    .pipe(changed(dst))
    .pipe(minifyHTML())
    .pipe(gulp.dest(dst));
});

// Browserify dependencies
//gulp.task("scripts", function() {
//    gulp.src(src + "js/marble.js")
//    .pipe(browserify({
//        insertGlobals : true,
//        debug: true
//    }))  
////    .pipe(concat('marble.js'))
////    .pipe(stripDebug())
////    .pipe(uglify())
//    .pipe(gulp.dest(dst + "js"));
//});

// JS concat, strip debugging and minify
gulp.task('scripts', function() {
    gulp.src([
        src + "vendor/angular-scroll.min.js", 
        src + "vendor/angular-youtube-embed.min.js", 
        src + "js/*.js"
    ])
    .pipe(concat('marble.js'))
    .pipe(stripDebug())
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(chmod(664))
    .pipe(gulp.dest(dst + "js"));
});

// Preprocess Sass, concat all, autoprefix and minify
gulp.task('styles', function () {
    gulp.src(src + 'scss/*.scss')
        .pipe(sass())
        .pipe(concat('marble.css'))
        .pipe(autoprefix('last 2 versions'))
        .pipe(minifyCSS())
        .pipe(addsrc(src + "css/*.min.css"))  
        .pipe(gulp.dest(dst + "css"));
});

// just pipe the assets to the dst
gulp.task("assets", function() {
    gulp.src([src + "fonts/*", src + "stories/*.min.json"], {base: src})
        .pipe(gulp.dest(dst));
});

gulp.task('bower', function() {
  return bower()
    .pipe(gulp.dest(dst + "test"))
});

// default gulp task
gulp.task('default', ['imagemin', 'htmlpage', 'scripts', 'styles', "assets"], function() {
    
});
