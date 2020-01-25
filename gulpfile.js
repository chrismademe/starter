const gulp = require("gulp");
const postcss = require("gulp-postcss");

const _ = {
    src: `./src`,
    dest: `./assets`
};

const compileCSS = function() {
    let plugins = [require("tailwindcss"), require("autoprefixer")];

    return gulp
        .src(`${_.src}/css/style.css`)
        .pipe(postcss(plugins))
        .pipe(gulp.dest(`${_.dest}/css`));
};

const watch = function(done) {
    gulp.watch(`${_.src}/css`, compileCSS);

    done();
};

exports.default = compileCSS;
exports.compileCSS = compileCSS;
exports.watch = gulp.parallel(watch);
