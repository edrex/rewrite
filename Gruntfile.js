module.exports = function(grunt) {

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'app/scripts/{,*/}*.js'
      ]
    },

    concat: {
      styles: {
        dest: 'app/assets/app.css',
        src: [
          'bower_components/Medium.js/medium.css',
          'app/styles/app.css'
        ]
      },
      app: {
        options: {
          separator: ';'
        },
        files: {
          'app/assets/app.js': [
            'app/scripts/pages.js',
            'app/scripts/drafts.js',
            'app/scripts/app.js'
          ]
        }
      },
      components: {
        options: {
          separator: ';'
        },
        files: {
          'app/assets/components.js': [
            'app/components/lodash/dist/lodash.js',
            'app/components/pouchdb-nightly/index.js',
            'app/components/angular/angular.js',
            'app/components/angular-route/angular-route.js',
            'app/components/angular-pouchdb/angular-pouchdb.js',
            'app/components/Medium.js/medium.js'
          ]
        }
      }
    },

    watch: {
      options : {
        livereload: 7777,
        atBegin: true
      },
      assets: {
        files: ['app/styles/**/*.css','app/scripts/**/*.js'],
        tasks: ['concat', 'push:local']
      },
      e2e: {
        options : {
          atBegin: false // test server needs time to start
        },
        files: ['app/scripts/*.js','app/*.html','test/e2e/**/*.js'],
        tasks: ['push:local', 'protractor:auto']
      },
      couchapp: {
        files: ['couchapp/**/*'],
        tasks: ['push:local']
      }
    },

    karma: {
      unit: {
        configFile: './test/karma-unit.conf.js',
        autoWatch: false,
        singleRun: true
      },
      unit_auto: {
        configFile: './test/karma-unit.conf.js',
        autoWatch: true,
        singleRun: false
      },
      unit_coverage: {
        configFile: './test/karma-unit.conf.js',
        autoWatch: false,
        singleRun: true,
        reporters: ['progress', 'coverage'],
        preprocessors: {
          'app/scripts/*.js': ['coverage']
        },
        coverageReporter: {
          type : 'html',
          dir : 'coverage/'
        }
      },
    },

    protractor: {
      options: {
        configFile: "./test/protractor.conf.js"
      },
      singlerun: {},
      auto: {
        options: {
          keepAlive: true,
          args: {
            seleniumAddress: 'http://127.0.0.1:4444/wd/hub'
          }
        }
      },
      sauce: {
        options: {
          configFile: "./test/protractor.conf.js"
        }
      }
    },

    connect: {
      options: {
        base: 'app/'
      },
      devserver: {
        options: {
          port: 8888
        }
      },
      testserver: {
        options: {
          port: 9999
        }
      }
    },

    open: {
      devserver: {
        path: 'http://localhost:8888'
      },
      coverage: {
        path: 'http://localhost:5555'
      }
    },

    shell: {
      options: {
        stdout: true
      },
      selenium: {
        command: 'node ./node_modules/protractor/bin/webdriver-manager start',
        options: {
          stdout: false,
          async: true
        }
      },
      protractor_install: {
        command: 'node ./node_modules/protractor/bin/webdriver-manager update'
      },
      npm_install: { command: 'npm install' },
      push_local: { command: 'erica push couchapp local' },
      push_prod: { command: 'erica push couchapp prod' }
    }
  });

  grunt.registerTask('build', ['jshint', 'concat']);

  //couchapp
  grunt.registerTask('push:local', ['shell:push_local']);
  grunt.registerTask('push:prod', ['shell:push_prod']);

  //single run tests
  grunt.registerTask('test', ['jshint','test:unit', 'test:e2e']);
  grunt.registerTask('test:unit', ['karma:unit']);
  grunt.registerTask('test:e2e', ['connect:testserver','protractor:singlerun']);

  //autotest and watch tests
  grunt.registerTask('autotest', ['karma:unit_auto']);
  grunt.registerTask('autotest:unit', ['karma:unit_auto']);
  grunt.registerTask('autotest:e2e', ['shell:selenium','watch:e2e']);

  //coverage testing
  grunt.registerTask('test:coverage', ['karma:unit_coverage']);
  grunt.registerTask('coverage', ['karma:unit_coverage','open:coverage','connect:coverage']);

  //installation-related
  grunt.registerTask('install', ['update','shell:protractor_install']);
  grunt.registerTask('update', ['shell:npm_install', 'concat']);

  //defaults
  grunt.registerTask('default', ['dev']);

  //development
  grunt.registerTask('dev', ['update', 'connect:devserver', 'open:devserver', 'watch:assets']);
};
