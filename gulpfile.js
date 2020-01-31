const gulp = require("gulp");
const postcss = require("gulp-postcss");
const playwright = require("playwright");
const postcssPlugins = [require("tailwindcss"), require("autoprefixer")];

const _ = {
    src: `./src`,
    dest: `./assets`,
    browserTesting: {
        url: `http://localhost:8080`,
        screenshotDir: `testing`,
        browsers: ["chromium", "firefox", "webkit"],
        devices: ["iPad Mini", "iPhone 6", "iPhone SE"]
    }
};

const compileCSS = function() {
    return gulp
        .src(`${_.src}/css/style.css`)
        .pipe(postcss(postcssPlugins))
        .pipe(gulp.dest(`${_.dest}/css`));
};

const watch = function(done) {
    gulp.watch(`${_.src}/css`, compileCSS);
    gulp.watch(`./tailwind.config.js`, compileCSS);

    done();
};

const browserTest = function(done) {
    let { browsers, devices, screenshotDir, url } = _.browserTesting;

    // Create a screenshot for each browser
    browsers.forEach(async browser => {
        devices.forEach(async device => {
            const currentDevice = playwright.devices[device];
            const instance = await playwright[browser].launch();
            const context = await instance.newContext({
                viewport: currentDevice.viewport,
                userAgent: currentDevice.userAgent
            });
            const page = await context.newPage(url);

            await page.screenshot({
                path: `./${screenshotDir}/${browser}-${device}.png`
            });
            await page.close();
        });
    });

    done();
};

exports.default = compileCSS;
exports.compileCSS = compileCSS;
exports.browserTest = browserTest;
exports.watch = gulp.parallel(watch);
