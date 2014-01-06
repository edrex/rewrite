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
        dest: './app/assets/app.css',
        src: [
          'app/styles/app.css',
          //place your Stylesheet files here
        ]
      },
      scripts: {
        options: {
          separator: ';'
        },
        files: {
          './app/assets/app.js': [
            'app/scripts/pages.js',
            'app/scripts/app.js'
          ],
          './app/assets/components.js': [
            'bower_components/lodash/dist/lodash.js',
            'bower_components/pouchdb-nightly.min.js/index.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-route/angular-route.js',
            // 'bower_components/angular-animate/angular-animate.js',
            'bower_components/angular-pouchdb/angular-pouchdb.js'
          ]
        } 
      },
    },

    'couch-compile': {
      couchapp: {
        files: {
          'tmp/couchapp.json': 'couchapp'
        }
      },
    },

    'couch-push': {
      localhost: {
        files: {
          'http://127.0.0.1:5984/pillowfork': 'tmp/couchapp.json'
        }
      }
    },

    watch: {
      options : {
        livereload: 7777
      },
      assets: {
        files: ['app/styles/**/*.css','app/scripts/**/*.js'],
        tasks: ['concat']
      },
      protractor: {
        files: ['couchapp/_attachments/scripts/*.js','couchapp/_attachments/*.html','test/e2e/**/*.js'],
        tasks: ['couch', 'protractor:auto']
      },
      couchapp: {
        files: ['couchapp/**/*'],
        tasks: ['couch']
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
        keepAlive: true,
        configFile: "./test/protractor.conf.js"
      },
      singlerun: {},
      auto: {
        keepAlive: true,
        options: {
          args: {
            seleniumPort: 4444
          }
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
      npm_install: {
        command: 'npm install'
      }
    }
  });

  //single run tests
  grunt.registerTask('test', ['jshint','test:unit', 'test:e2e']);
  grunt.registerTask('test:unit', ['karma:unit']);
  grunt.registerTask('test:e2e', ['connect:testserver','protractor:singlerun']);

  //autotest and watch tests
  grunt.registerTask('autotest', ['karma:unit_auto']);
  grunt.registerTask('autotest:unit', ['karma:unit_auto']);
  grunt.registerTask('autotest:e2e', ['shell:selenium','watch:protractor']);

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
