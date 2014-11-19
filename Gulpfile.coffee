gulp = require "gulp"
coffee = require "gulp-coffee"
uglify = require "gulp-uglify"
del = require "del"
rename = require "gulp-rename"
size = require "gulp-size"

# Compile CoffeeScript to JavaScript, minify, uglify, rename, and output
gulp.task "scripts", ->
  gulp.src "src/*.coffee"
    .pipe coffee()
    .pipe uglify()
    .pipe rename "jquery.lazySortableTable-1.0.0.min.js"
    .pipe size()
    .pipe gulp.dest "dist"
    .pipe gulp.dest "examples/javascripts"

# Delete the dist directory
gulp.task "clean", ->
  del "dist"

# Default task
gulp.task "default", ["clean", "scripts"], ->