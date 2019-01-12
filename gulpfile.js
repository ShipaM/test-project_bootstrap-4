const gulp = require('gulp'); //подключаем gulp;
const uglify = require('gulp-uglify'); //минифицирование файлов;
const concat = require('gulp-concat'); //склеивает файлы;
const minifyCss = require('gulp-minify-css'); //сжимает файлы
const imagemin = require('gulp-imagemin'); //оптимизация изображений
const clean = require('gulp-clean'); //удаляет файл или папку
const shell = require('gulp-shell');//очередность запуска
const browserSync = require ('browser-sync');//локальный сервер
const reload = browserSync.reload; //перезагрузка сервера
const runSequence = require('run-sequence'); //запускает задачи по очереди

const path = {
    src: {
        html: ['app/index.html'],
        styles: ['app/css/font-awesome.css', 'app/css/fonts.css', 'app/css/bootstrap.css', 'app/css/vendors/*.css',  'app/css/style.css' ],
        js: ['app/js/jquery-3.3.1.min.js', 'app/js/bootstrap.min.js'],
        fonts: 'app/fonts/**/*',
        images: 'app/images/**/*'
    },
    build: {
        js: 'build/js/',
        css: 'build/css/',
        html: 'build',
        fonts: 'build/fonts/',
        images: 'build/images/'
    }
};


gulp.task('js', function() {
    return gulp.src(path.src.js)
    .pipe(uglify())
    .pipe(concat("main.js"))
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({stream: true}));
});

gulp.task('css', function() {
    return gulp.src(path.src.styles)
    .pipe(minifyCss())
    .pipe(concat("main.css"))
    .pipe(gulp.dest(path.build.css))
    .pipe(reload({stream: true}));
});

gulp.task('html', function() {
    return gulp.src(path.src.html)
    .pipe(gulp.dest(path.build.html))
    .pipe(reload({stream: true}));
});

gulp.task('fonts', function() {
    return gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts));
});

gulp.task('images', function() {
    return gulp.src(path.src.images)
    .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.jpegtran({progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
             plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
            ]
        })
    ], 
    {
        verbose: true
    }
    )
    )
    .pipe(gulp.dest(path.build.images));
});

gulp.task('clean', function() {
    return gulp.src('build')
      .pipe(clean());
});

gulp.task('build', shell.task([
    'gulp clean',
    'gulp images',
    'gulp html',
    'gulp fonts',
    'gulp css',
    'gulp js'
    ]) 
);

gulp.task('browser-sync', function() {
    browserSync({
        startPath: "/",
        server: {
            baseDir: "build"
        },
        notify: false
    });
});

gulp.task('server', function() {
    runSequence('build', 'browser-sync', 'watch');
});

gulp.task('watch', function() {
    gulp.watch('app/index.html', ['html']);
    gulp.watch('app/css/**/*.css', ['css']);
    gulp.watch('app/js/**/*.js', ['js']);
});

gulp.task('default', ['server']);
