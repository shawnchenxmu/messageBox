const gulp = require('gulp')
const del = require('del')
const less = require('gulp-less')
const rename = require('gulp-rename')
const replace = require('gulp-replace')
const domain = process.env.NODE_ENV == 'development' ? 'http://localhost:4000' : 'https://www.alloween.xyz'

const paths = {
    src: {
        baseDir: 'src',
        imgDir: 'src/image',
        lessDir: 'src/assets/less',
        imageFiles: ['src/image/*.{png,jpg,jpeg,gif}'],
        lessFiles: 'src/**/*.less',
        baseFiles: ['src/**/*.{png,js,json}', '!src/assets/**/*', '!src/image/**/*'],
        wxmlFiles: 'src/**/*.wxml'
    },
    dist: {
        baseDir: 'dist',
        imgDir: 'dist/img',
        wxssFiles: 'dist/**/*.wxss',
        wxmlFiles: 'dist/**/*.wxml'
    },
    tmp: {
        baseDir: 'tmp'
    }
}

// less 编译
function lessCompile(){
    return gulp.src(paths.src.lessFiles)
        .pipe(
            less({plugins: []})
            .on('error', console.error)
        ).pipe(
            rename({'extname': '.wxss'})
        ).pipe(
            replace('.less', '.wxss')
        ).pipe(
            gulp.dest(paths.dist.baseDir)
        )
}

// 复制基础文件
function copyBasicFiles(){
    return gulp.src(paths.src.baseFiles, {})
        .pipe(replace('%domain%', domain))
        .pipe(gulp.dest(paths.dist.baseDir))
}

// 复制图片
function copyImage(){
    return gulp.src(paths.src.imageFiles, {})
        .pipe(gulp.dest(paths.dist.imgDir))
}

// 复制 WXML
function copyWXML(){
    return gulp.src(paths.src.wxmlFiles, {})
        .pipe(gulp.dest(paths.dist.baseDir))
}

function cleanDist(){
    return del(paths.dest.baseDir)
}

function cleanTmp(){
    return del(paths.tmp.baseDir)
}

gulp.task('watch', function(){
    gulp.watch('./src/**/*.js', gulp.series('default'))
    gulp.watch('./src/**/*.wxml', gulp.series('default'))
    gulp.watch('./src/**/*.less', gulp.series('default'))
})

gulp.task('default', gulp.series(
    cleanTmp,
    copyBasicFiles,
    copyImage,
    lessCompile,
    copyWXML
))

gulp.task('clean', gulp.parallel(
    cleanTmp,
    cleanDist
))