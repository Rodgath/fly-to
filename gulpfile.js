const { src, dest, series, parallel, watch, task } = require('gulp');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const header = require('gulp-header');
const shell = require('gulp-shell');
const pkg = require('./package.json');

const sourceBranch = 'main';
const targetBranch = 'gh-pages';
const folderToCopy = 'demo';

/* Copy folder between branches */
const copyFolder = () => {
  return shell.task([
    `git checkout ${targetBranch}`,
    `git checkout ${sourceBranch} -- ${folderToCopy}`,
    `git add ${folderToCopy}`,
    `git commit -m "Copy '${folderToCopy}' folder from ${sourceBranch}"`,
    `git push origin ${targetBranch}`,
    `git checkout ${sourceBranch}`
  ]);
}

/* Format string */
const formatString = (inputString) => {
  
  const words = inputString.split('-');

  /* Capitalize the first letter of each word and join them with a space */
  const formattedString = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return formattedString;
}

/* Banner crest */
const banner = [
  '/**',
  ` * ${formatString(pkg.name)}`,
  ` * @name        ${pkg.name}`,
  ` * @description ${pkg.description}`,
  ` * @link        ${pkg.homepage}`,
  ` * @author      ${pkg.author.name}, ${pkg.author.web}`,
  ` * @version     v${pkg.version}`,
  ` * @created     Sep 12, 2023`,
  ` * @updated     Sep 17, ${new Date().getFullYear()}`,
  ` * @copyright   Copyright (C) 2023-${new Date().getFullYear()}, ${pkg.author.name}`,
  ` * @license     ${pkg.license}`,
  ` * @licenseMIT  ${pkg.homepage}/blob/main/LICENSE`,
  ` * @demoExample https://rodgath.github.io/fly-to/demo/`,  
  ' */',
  ''
].join('\n');

/* Set banner for dist files */
const setBannerDist = () => {
	return src('./dist/{css,js}/**/*.{js,css}')
  .pipe(header(banner))
  .pipe(dest('./dist'))
}

/* Set banner for demo files */
const setBannerDemo = () => {
	return src('./demo/{css,js}/**/fly-to*.{js,css}')
  .pipe(header(banner))
  .pipe(dest('./demo'))
}

const compressJs = () => {
  return src('src/*.js')
        .pipe(dest('./demo/js')) // Send original script file to /demo
        .pipe(dest('./dist/js')) // Send original script file to /dist
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(rename( { suffix: '.min' } ))
        .pipe(dest('./demo/js'))
        .pipe(dest('./dist/js'))
}

const watchTask = () => {
  watch(['./src/*.js', './demo/*.html'], { events: 'all' }, series(compressJs, setBannerDist, setBannerDemo))
}

const buildTask = () => {
  return series(compressJs, setBannerDist, setBannerDemo)
}

/* Tasks */
task('copy:demo', copyFolder());
task('set:banner', setBanner);
task('compress:js', compressJs);
task('watch', watchTask);
task('build', buildTask());

exports.default = buildTask();