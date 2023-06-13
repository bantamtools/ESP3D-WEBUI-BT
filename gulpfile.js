const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const gzip = require('gulp-gzip');
const inlineSource = require('gulp-inline-source');
const replace = require('gulp-replace');

// Copy original files to a temporary directory
function copyToTemp() {
    return gulp.src('dist/*')
        .pipe(gulp.dest('temp/'));
}

// Minify CSS
function minifyCSS() {
    return gulp.src('temp/styles.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest('temp'));
}

// Minify JS
function minifyJS() {
    return gulp.src('temp/script.js')
        .pipe(uglify())
        .pipe(gulp.dest('temp'));
}

// Minify HTML and inline CSS/JS
function minifyHTML() {
    return gulp.src('temp/index.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(inlineSource())
        .pipe(gulp.dest('temp'));
}

// Replace the src and href paths in the HTML
function replacePaths() {
    return gulp.src('temp/index.html')
        .pipe(replace('src="script.js"', 'src="temp/script.js"'))
        .pipe(replace('href="styles.css"', 'href="temp/styles.css"'))
        .pipe(gulp.dest('temp'));
}

// Compress HTML
function compressHTML() {
    return gulp.src('temp/index.html')
        .pipe(gzip({ gzipOptions: { level: 9} }))
        .pipe(gulp.dest('.'));
}

gulp.task('copyToTemp', copyToTemp);
gulp.task('minifyCSS', minifyCSS);
gulp.task('minifyJS', minifyJS);
gulp.task('replacePaths', replacePaths);
gulp.task('minifyHTML', minifyHTML);
gulp.task('compressHTML', compressHTML);

gulp.task('default', gulp.series(copyToTemp, minifyCSS, minifyJS, replacePaths, minifyHTML, compressHTML));
