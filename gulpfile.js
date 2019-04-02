"use strict";

const gulp = require("gulp"),
  autoprefixer = require("autoprefixer"),
  browsersync = require("browser-sync").create(),
  postcss = require("gulp-postcss"),
  sass = require("gulp-sass"),
  webpack = require("webpack"),
  webpackConfig = require("./webpack.config"),
  webpackStream = require("webpack-stream");

function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./app"
    },
    port: 3000
  });
  done();
}
function browserSyncReload(done) {
  browsersync.reload();
  done();
}
function css() {
  return gulp
    .src("./app/assets/scss/**/*.scss")
    .pipe(sass())
    .pipe(
      postcss([
        autoprefixer({
          browsers: ["last 99 versions"],
          cascade: false
        })
      ])
    )
    .pipe(gulp.dest("./app/temp/css/"))
    .pipe(browsersync.stream());
}

function scripts() {
  return gulp
    .src("[./app/assets/scripts/**/*]")
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(gulp.dest("./app/temp/scripts/"))
    .pipe(browsersync.stream());
}

function watchFiles() {
  gulp.watch("./app/assets/scss/**/*.scss", css);
  gulp.watch("./app/assets/scripts/**/*", scripts);
  gulp.watch("./app/*.html", browserSyncReload);
}

const watch = gulp.parallel(watchFiles, browserSync);

exports.css = css;
exports.watch = watch;
exports.default = watch;
exports.js = scripts;
