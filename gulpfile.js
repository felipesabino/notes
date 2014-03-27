/**
 * The gulpfile controls the "meta" level of this project. Namely,
 * coordinating, validating, etc. the various sub-projects. This file is most
 * appropriate for contributors to the project as a whole, and **not**
 * developers looking to use the `skeleton` or `full` implementations of
 * the examples.
 */
var fs = require("fs"),
  path = require("path"),
  gulp = require("gulp"),
  jshint = require("gulp-jshint"),
  exec = require("gulp-exec"),

  // Oh, gulp, you disappoint me.
  runSeq = require("run-sequence");

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------
// Strip comments from JsHint JSON files (naive).
var _jsonCfg = function (name) {
  var raw = fs.readFileSync(name).toString();
  return JSON.parse(raw.replace(/\/\/.*\n/g, ""));
};

// Wrapper for gulp-exec to bridge easily to grunt tasks.
var _execTask = function (cmd, args) {
  return exec(
    "echo \"Running '<%= options.cmd %> <%= options.args %>' in " +
    "'<%= options.dirname(file.path) %>'\" && " +
    "cd \"<%= options.dirname(file.path) %>\" && " +
    "<%= options.cmd %> <%= options.args %>", {
      dirname: path.dirname,
      args: args,
      cmd: cmd
    });
};

var _gruntTask = function (name) {
  return _execTask("./node_modules/.bin/grunt", name);
};

// ----------------------------------------------------------------------------
// JsHint
// ----------------------------------------------------------------------------
gulp.task("jshint:frontend", function () {
  gulp
    .src("*/*/Gruntfile.js")
    .pipe(_gruntTask("jshint"));
});

gulp.task("jshint:backend", function () {
  gulp
    .src([
      "*.js",
      "*/*/Gruntfile.js"
    ])
    .pipe(jshint(_jsonCfg("./_dev/.jshintrc-backend.json")))
    .pipe(jshint.reporter("default"))
    .pipe(jshint.reporter("fail"));
});

gulp.task("jshint", ["jshint:frontend", "jshint:backend"]);

// ----------------------------------------------------------------------------
// Builders
// ----------------------------------------------------------------------------
// File globs.
var FILES = {
  AMD: {
    GRUNT: "*/amd/Gruntfile.js",
    SOURCES: [
      "full/amd/{.,}*",
      "!full/amd/README.md",

      "full/amd/app/*.html",
      "full/amd/app/js/*.js",
      "full/amd/app/css/**",
      "full/amd/test/*/*.html",
      "full/amd/test/*/js/*.js",

      "!full/amd/bower_components/{.,}**/{.,}*",
      "!full/amd/node_modules/{.,}**/{.,}*"

    ]
  }
};

// Generally speaking, `full` implementations control `skeleton`
// implementations. These tasks bring the skeletons into sync with the fulls.
gulp.task("sync:amd", function () {
  gulp
    .src(FILES.AMD.SOURCES, { base: "full/amd" })
    .pipe(gulp.dest("skeleton/amd"));
});

gulp.task("install:amd", function () {
  gulp
    .src(FILES.AMD.GRUNT)
    .pipe(_execTask("npm", "install"));
});

gulp.task("build:amd", function () {
  gulp
    .src(FILES.AMD.GRUNT)
    .pipe(_gruntTask("build"));
});

// ----------------------------------------------------------------------------
// Aggregated Tasks
// ----------------------------------------------------------------------------
gulp.task("sync",       ["sync:amd"]);
gulp.task("install",    ["install:amd"]);
gulp.task("build",      ["build:amd"]);
gulp.task("check",      ["jshint"]);

gulp.task("default", function (cb) {
  // Need tasks **completely** done to get **new** files to run tasks on.
  // Wrap with a `reduceRight` and then execute the outer wrapper.
  [
    "sync",
    "install",
    "build",
    "check"
  ].reduceRight(function (memo, name) {
    return function () { runSeq([name], memo); };
  }, cb)();
});
