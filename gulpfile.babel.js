/*jshint esversion: 6 */
'use strict'

import gulp         from 'gulp'
import slim         from 'gulp-slim'
import sass         from 'gulp-sass'
import autoprefixer from 'gulp-autoprefixer'
import imagemin     from 'gulp-image'
import del          from 'del'
import plumber      from 'gulp-plumber'
import webserver    from 'gulp-webserver'

const SRC         = 'styleguide/src'
const SRC_ASSETS  = SRC + '/assets'
const DIST        = 'styleguide/dist'
const DIST_ASSETS = DIST + '/assets'
const BS_SRC      = 'scss'
const BS_DIST     = 'dist'

gulp.task('bootstrap', (done) => {
  gulp.src(BS_SRC + '/bootstrap.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulp.dest(BS_DIST + '/css'))
    .pipe(gulp.dest(DIST_ASSETS))
  done()
})

gulp.task('promotion', (done) => {
  gulp.src(BS_SRC + '/promotion.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulp.dest(BS_DIST + '/css'))
    .pipe(gulp.dest(DIST_ASSETS))
  done()
})

gulp.task('service', (done) => {
  gulp.src(BS_SRC + '/service.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulp.dest(BS_DIST + '/css'))
    .pipe(gulp.dest(DIST_ASSETS))
  done()
})

gulp.task('slim', (done) => {
  gulp.src([SRC + '/**/*.slim', '!' + SRC + '/views/_*.slim'])
    .pipe(plumber())
    .pipe(slim({
      pretty : true,
      require: 'slim/include',
      options: 'include_dirs=["' + SRC + '/views"]'
    }))
    .pipe(gulp.dest(DIST))
  done()
})

gulp.task('scss', (done) => {
  gulp.src(SRC_ASSETS + '/stylesheets/**/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulp.dest(DIST_ASSETS))
  done()
})

gulp.task('image', (done) => {
  gulp.src(SRC_ASSETS + '/images/**/*.+(jpg|jpeg|JPG|png|PNG|gif|GIF|svg|SVG|pdf)')
    .pipe(gulp.dest(DIST_ASSETS))
  done()
});

gulp.task('font', (done) => {
  gulp.src(SRC_ASSETS + '/fonts/**/*.+(eot|woff|svg|ttf|EOT|WOFF|SVG|TTF)')
    .pipe(gulp.dest(DIST_ASSETS))
  done()
})

gulp.task('optimize', () => {
  gulp.src(SRC_ASSETS + '/images/**/*.+(jpg|jpeg|JPG|png|PNG|gif|GIF|svg|SVG)')
    .pipe(plumber())
    .pipe(imagemin({
      pngquant: true,
      optipng: false,
      zopflipng: true,
      jpegRecompress: false,
      jpegoptim: true,
      mozjpeg: true,
      gifsicle: true,
      svgo: true,
      concurrent: 4
    }))
    .pipe(gulp.dest(DIST_ASSETS))
})

gulp.task('vendor', (done) => {
  gulp.src(SRC + '/vendor/assets/javascripts/*.js')
    .pipe(gulp.dest(DIST_ASSETS))
  gulp.src(SRC + '/vendor/assets/stylesheets/*.css')
    .pipe(gulp.dest(DIST_ASSETS))
  done()
})

gulp.task('webserver', () => {
  gulp.src(DIST)
    .pipe(webserver({
      host: 'localhost',
      livereload: false,
      port: 7070
    }))
})

gulp.task('compile', gulp.parallel('bootstrap', 'promotion', 'service', 'slim', 'scss', 'image', 'font', 'vendor'))

gulp.task('default', gulp.series('compile', () => {
  gulp.watch(BS_SRC     + '/**/*.*', gulp.parallel('bootstrap', 'promotion', 'service'))
  gulp.watch(SRC        + '/**/*.slim', gulp.series('slim'))
  gulp.watch(SRC_ASSETS + '/stylesheets/**/*.scss', gulp.series('scss'))
  gulp.watch(SRC_ASSETS + '/images/**/*.+(jpg|jpeg|JPG|png|PNG|gif|GIF|svg|SVG)', gulp.series('image'))
  gulp.watch(SRC_ASSETS + '/fonts/**/*.+(eot|woff|svg|ttf|EOT|WOFF|SVG|TTF)', gulp.series('font'))
  gulp.watch(SRC        + '/vendor/**/*.*', gulp.series('vendor'))
}))

gulp.task('clean', () => {
  del([DIST])
})
