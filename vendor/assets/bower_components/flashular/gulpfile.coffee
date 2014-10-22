config = require "./gulpconfig"
gulp = require "gulp"
coffee = require "gulp-coffee"
coffeelint = require "gulp-coffeelint"
ngAnnotate = require "gulp-ng-annotate"
rename = require "gulp-rename"
rimraf = require "rimraf"
size = require "gulp-size"
uglify = require "gulp-uglify"
watch = require "gulp-watch"
{protractor} = require "gulp-protractor"
http = require "http"
express = require "express"
testApp = express()
  .use "/#{config.testServerVendorPath}", express.static config.vendorDir
  .use "/#{config.testServerBuildPath}", express.static config.buildDir
  .use "/#{config.testServerAppPath}", express.static config.testAppDir
testServer = http.createServer testApp

gulp.task "clean", (done) ->
  rimraf config.buildDir, done

gulp.task "build", ["clean"], ->
  gulp
    .src config.script
    .pipe coffeelint
      arrow_spacing: level: "error"
      max_line_length: level: "ignore"
    .pipe coffeelint.reporter()
    .pipe coffee()
    .pipe size showFiles: yes
    .pipe gulp.dest config.buildDir
    .pipe ngAnnotate()
    .pipe uglify mangle: no
    .pipe rename suffix: ".min"
    .pipe size showFiles: yes
    .pipe gulp.dest config.buildDir

gulp.task "watch", ["build"], ->
  watch config.script, -> gulp.start "build"

gulp.task "serve", ["build"], (done) ->
  testServer.listen config.testServerPort, -> done()

gulp.task "test", ["serve"], ->
  gulp
    .src config.testScript, read: no
    .pipe coffee()
    .pipe protractor
      configFile: config.testConfig
      args: ["--baseUrl", "http://#{testServer.address().address}:#{testServer.address().port}/#{config.testServerAppPath}"]
    .on "error", -> testServer.close()
    .on "end", -> testServer.close()

gulp.task "default", ->
  # The default task (i.e. "gulp" via the CLI).
  gulp.start "build"
