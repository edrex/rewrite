var gulp = require('gulp'),
    exec = require('gulp-exec'),
    protractor = require("gulp-protractor"),
    lr = require('tiny-lr'),
    livereload = require('gulp-livereload'),
    server = lr(),
    concat = require('gulp-concat');

var env = gulp.env.prod ? 'prod' : 'local';

// BUILD

var scripts = [
    'app/components/lodash/dist/lodash.js',
    'app/components/pouchdb-nightly/index.js',
    'app/components/angular/angular.js',
    'app/components/angular-route/angular-route.js',
    'app/components/angular-pouchdb/angular-pouchdb.js',
    'app/scripts/pages.js',
    'app/scripts/drafts.js',
    'app/scripts/app.js'
];

gulp.task('concat', function() {
  gulp.src(scripts)
    .pipe(concat('app.js'))
    .pipe(gulp.dest('app/assets/'));
});

gulp.task('push', function() { gulp.src('couchapp')
  .pipe(exec('erica push <%= file.path %> <%= options.env %>', {env: env}))
  .pipe(livereload(server))
});

gulp.task('default', function() {
  server.listen(7777, function (err) {
    if (err) return console.log(err);
    gulp.watch('couchapp/**/*', function(event) {
      console.log('File '+event.path+' was '+event.type+', pushing');
      gulp.run('push');
    });
  });
});

// TEST
gulp.task('webdriver', protractor.webdriver);

gulp.task('test', function() {
  gulp.src(["./tests/e2e"])
    .pipe(protractor.protractor({
      configFile: "test/protractor."+env+".conf.js"
    })) 
});

gulp.task('autotest', function() {
  if (env == 'local') {
    gulp.run('webdriver');
  }
  gulp.watch(['couchapp/**/*', 'test/e2e/**/*.js'], function(event) {
    console.log('File '+event.path+' was '+event.type+', running tests...');
    gulp.src(["./tests/e2e"])
      .pipe(protractor.protractor({
        configFile: "test/protractor.auto.conf.js"
      })) 
  });
});





