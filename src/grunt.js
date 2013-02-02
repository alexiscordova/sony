/*global module:false*/
mymod = 'editorial';

module.exports = function(grunt) {

// Project configuration.
  grunt.initConfig({
    lint: {
      files: ['js/bundle/**/*.js', 'html/data/**/*.json']
    },
    jshint: {
        options: {
          node: true,
          jquery: true,
          browser: true,
          es5: true,
          boss: true,
          curly: true,
          expr: true,
          globalstrict: true,
          immed: false,
          indent: 2,
          strict: false,
          supernew: true,
          white: false
        },
        globals: {
          iQ: true,
          $: true,
          jQuery: true,
          Modernizr: true,
          IScroll: true,
          window: true,
          document: true
        }
    },
    watch: {
      js:{
        files: ['js/**/*.js'],
        tasks: ['debug-js'],
        options: {
          forceWatchMethod: 'old'
        }
      },
      css:{
        files: ['css/scss/**/*.scss'],
        tasks: ['debug-css'],
        options: {
          forceWatchMethod: 'old'
        }
      },
      html:{
        files: ['html/**/*.*'],
        tasks: ['debug-html'],
        options: {
          forceWatchMethod: 'old'
        }
      },
      images:{
        files: ['img/**/*.*'],
        tasks: ['debug-img'],
        options: {
          forceWatchMethod: 'old'
        }
      }

    },
    compass: {
        debug: {
            src: 'css/scss/',
            dest: '../build/debug/css',
            outputstyle: 'expanded',
            linecomments: true,
            forcecompile: true,
            debugsass: false,
            images: '../build/debug/img',
            relativeassets: true
        },
        deploy: {
            src: 'css/scss/',
            dest: 'css/temp',
            outputstyle: 'compressed',
            linecomments: false,
            forcecompile: true,
            debugsass: false,
            images: '../build/deploy/img',
            relativeassets: true
        },
        docs: {
            src: 'css/scss/',
            dest: '../docs/css',
            outputstyle: 'expanded',
            linecomments: true,
            forcecompile: true,
            debugsass: false,
            images: '../docs/img',
            relativeassets: true
        },
        docs_extra: {
            src: 'css/docs/',
            dest: '../docs/css',
            outputstyle: 'expanded',
            linecomments: true,
            forcecompile: true,
            debugsass: false,
            images: '../docs/img',
            relativeassets: true
        }
    },
    min:{
      require:{
        src: 'js/bundle/require/*.js',
        dest: '../build/deploy/js/require.min.js'
      },
      secondary:{
        src: 'js/bundle/secondary/*.js',
        dest: '../build/deploy/js/secondary.min.js'
      },
      polyfill:{
        src: 'js/libs/polyfill/*.js',
        dest: '../build/deploy/js/polyfill.min.js'
      }
    },
    cssmin:{
      deploy:{
         src: ['css/temp/**/*.css'],
            dest: '../build/deploy/css/styles.min.css',
            seperator:';'
      }
    },
    clean:{
      debug:['../build/debug/'],
      deploy:['../build/deploy/'],
      docs:['../docs/']
    },
    copy:{
      debug:{
        files:{
          '../build/debug/img/'     : 'img/build/**',
          '../build/debug/js/'     : 'js/**',
          '../build/debug/ico/'     : 'img/ico/**',
          '../build/debug/fonts/'   : 'fonts/**'
        }
      },
      debuglight:{
        files:{
          '../build/debug/js/'     : 'js/**'
        }
      },
      debugimg:{
        files:{
          '../build/debug/img/'     : 'img/build/**',
          '../build/debug/ico/'     : 'img/ico/**'
        }
      },
      deploy:{
        files:{
          '../build/deploy/js/bundle/defer/'     : 'js/bundle/defer/**',
          '../build/deploy/js/libs/'   : 'js/libs/*',
          '../build/deploy/img/'     : 'img/build/**',
          '../build/deploy/ico/'     : 'img/ico/**',
          '../build/deploy/fonts/'   : 'fonts/**'
        }
      },
      docs:{
        files:{
          '../docs/js/libs/'       : 'js/libs/*',
          '../docs/js/docs/'       : 'js/docs/*',
          '../docs/ico/'         : 'img/ico/**',
          '../docs/fonts/'       : 'fonts/**',
          '../docs/img/'         : 'img/build/**',
          '../docs/img/'         : 'img/docs/**',
          '../docs/css/'         : 'css/docs/*.css'
        }
      },
      docslight:{
        files:{
          '../docs/css/'         : 'css/docs/*.css'
        }
      },
      docsimg:{
        files:{
          '../docs/img/'         : 'img/build/**',
          '../docs/img/'         : 'img/docs/**',
          '../docs/ico/'         : 'img/ico/**',
        }
      }

    },
    doccoh: {
      main: {
        src: ['js/bundle/**/*.js'],
        options: {
          output: '../docs/docco/'
        }
      }
    },
    shell:{
      docpad_debug:{
        command:'docpad generate --env debug',
            stdout: true,
            failOnError: true
      },
      docpad_mbuilder:{
        command:'docpad generate --env mbuilder',
            stdout: true,
            failOnError: true
      },
      docpad_deploy:{
        command:'docpad generate --env deploy',
            stdout: true,
            failOnError: true
      },
      docpad_docs:{
        command:'docpad generate --env docs',
            stdout: true,
            failOnError: true
      }
    }
  });

  // Load NPM Modules
  grunt.loadNpmTasks('grunt-clear');
  grunt.loadNpmTasks('grunt-compass');
  grunt.loadNpmTasks('grunt-yui-compressor');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-doccoh');

  // Define task list aliases
  grunt.registerTask('debug', 'clear lint compass-clean compass:debug copy:debug  shell:docpad_debug');
  grunt.registerTask('mbuilder', 'shell:docpad_mbuilder')
  grunt.registerTask('debug-light', 'lint compass:debug copy:debuglight shell:docpad_debug');
  grunt.registerTask('debug-html', 'lint shell:docpad_debug');
  grunt.registerTask('debug-js', 'lint copy:debuglight');
  grunt.registerTask('debug-css', 'compass:debug');
  grunt.registerTask('debug-img', 'copy:debugimg');
  grunt.registerTask('docs', 'clear compass-clean compass:docs compass:docs_extra copy:docs docs-js shell:docpad_docs');
  grunt.registerTask('docs-light', 'compass-clean compass:docs compass:docs_extra copy:docslight shell:docpad_docs');
  grunt.registerTask('docs-js', 'doccoh');
  grunt.registerTask('docs-img', 'copy:docsimg');
  grunt.registerTask('deploy', 'clear lint compass-clean compass:deploy min cssmin:deploy copy:deploy  shell:docpad_deploy');
  grunt.registerTask('default', 'debug');
  grunt.registerTask('all', 'clean debug deploy docs');
  
  // Define specialized tasks
  grunt.registerTask('lint-target', 'A task that lints a specific file, or set of files.', function(target) {
    if (arguments.length === 0) {
      // If no target is provided, just run lint with the regular config set above.
      grunt.task.run('lint');
    } else {
      // Else, set lint with the target as defined.

      var existingLintRules = grunt.config.get('jshint');

      grunt.initConfig({
        lint: {
          files: target
        },
        jshint: existingLintRules
      });

      grunt.task.run('lint');
    }
  });

};
