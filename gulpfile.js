const gulp = require('gulp');

const paths = {
    src: {
        baseDir: 'src',
        imgDir: 'src/img',
        lessDir: 'src/assets/less',
        lessFiles: 'src/**/*.less',
        baseFiles: ['src/**/*.{png,js,json}', '!src/assets/**/*', '!src/image/**/*']
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
            gulp.dest(paths.dest(paths.dist.baseDir))
        )
}

// 复制基础文件
function copyBasicFiles(){
    return gulp.src(paths.src.baseFiles, {})
        .pipe(gulp.dest(paths.dist.baseDir))
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

gulp.task('default', gulp.series(
    cleanTmp,
    copyBasicFiles,
    lessCompile,
    copyWXML
))

gulp.task('clean', gulp.parallel(
    cleanTmp,
    cleanDist
))