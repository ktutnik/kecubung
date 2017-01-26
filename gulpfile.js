"use strict";


var gulp = require("gulp"),
    tsc = require("gulp-typescript"),
    del = require("del"),
    runSequence = require("run-sequence"),
    mocha = require("gulp-mocha"),
    istanbul = require("gulp-istanbul");
//********CLEAN ************

gulp.task("clean-source", function (cb) {
    return del([
        "./src/**/*.js",
        "./src/**/*.d.ts",
        "./src/**/*.js.map"], cb)
})

gulp.task("clean-test", function (cb) {
    return del([
        "./test/**/*.js",
        "./test/**/*.d.ts",
        "./test/**/*.js.map"], cb)
})

gulp.task("clean-lib", function (cb) {
    return del([
        "./lib/**/*.js",
        "./lib/**/*.d.ts",
        "./lib/**/*.js.map"], cb)
})


gulp.task("clean", function (cb) {
    runSequence("clean-source", "clean-test", "clean-lib", cb);
});

//******** BUILD *************

var tsProject = tsc.createProject("tsconfig.json", {
    declaration: false,
    noResolve: false,
    typescript: require("typescript")
});

gulp.task("build-source", function () {
    return gulp.src([
        "src/**/**.ts"
    ])
        .pipe(tsProject())
        .on("error", function (err) {
            process.exit(1);
        })
        .pipe(gulp.dest("src/"));
});

var tsTestProject = tsc.createProject("tsconfig.json", {
    declaration: false,
    noResolve: false,
    typescript: require("typescript")
});

gulp.task("build-test", function () {
    return gulp.src([
        "test/**/**.ts"
    ])
        .pipe(tsTestProject())
        .on("error", function (err) {
            process.exit(1);
        })
        .pipe(gulp.dest("test"));
});


gulp.task("build", function (cb) {
    runSequence("build-source", "build-test", cb);
});


//******** TEST *************
gulp.task("mocha", function () {
    return gulp.src([
        "test/**/**.js"
    ])
        .pipe(mocha({ ui: "bdd" }))
        .pipe(istanbul.writeReports());
});

gulp.task("istanbul:hook", function () {
    return gulp.src(["src/**/**.js"])
        // Covering files
        .pipe(istanbul())
        // Force `require` to return covered files
        .pipe(istanbul.hookRequire());
});

gulp.task("test", function (cb) {
    runSequence("istanbul:hook", "mocha", cb);
});

//******** DISTRIBUTION *************
gulp.task("dist", function () {
    return gulp.src(["src/**/*.js", "src/**/*.d.ts"])
        .pipe(gulp.dest("lib/"));
});

//******** DEFAULT *************
gulp.task("default", function (cb) {
    runSequence(
        "build",
        "test",
        "dist",
        cb);
}); 