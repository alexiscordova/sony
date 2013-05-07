module.exports = function(grunt) {

  var gruntconfig = {};

  if ( grunt.file.exists('.gruntconfig') ) {
    gruntconfig = grunt.file.readJSON('.gruntconfig');
  }

  //cachable jade values
  var c = {
    // modulecss: grunt.file.expand('packages/modules/**/css/*.scss').map(function(a){return a.split('/').pop()}).filter(function(a){return !a.match(/^_responsive/)}),
    polyfills: grunt.file.expand('packages/common/js/libs/polyfill/*.js').map(function(a){return a.split('/').pop()}),
    polyfillsie7: grunt.file.expand('packages/common/js/libs/polyfill-lte-ie7/*.js').map(function(a){return a.split('/').pop()}),
    plugins: grunt.file.expand('packages/common/js/plugins/*.js').map(function(a){return a.split('/').pop()}),
    secondary: grunt.file.expand('packages/common/js/secondary/*.js').map(function(a){return a.split('/').pop()}),
    defer: grunt.file.expand('packages/modules/**/js/*.js').map(function(a){return a.split('/').pop()})
  };

  var jadeconfig = {

    spawnProcesses: gruntconfig.maxProcesses,
    compileDebug: false,

    data:{
      partial: function(templatePath, dataObj){
        var template = grunt.file.read(templatePath);

        if(typeof(dataObj) === String){
          dataObj = grunt.file.readJSON(dataObj)
        }

        if(templatePath.match(/.jade/g)){
          return require('grunt-contrib-jade/node_modules/jade').compile(template, {filename: templatePath})(dataObj);
        }else{
          return template;
        }
      },
      data: function(path){
        return grunt.file.readJSON(path);
      },
      locals:{
        getConfigFile:function(path){
          return grunt.file.readJSON(path);
        },
        getEnvironments:function(){
          return grunt.option('deploy') ? 'deploy' : 'debug'
        },
        plusify : function(str){
          return str.replace(/\[\+\]/g , '<i class="fonticon-30-plus"></i>');
        },
        // modulescss:function(){
          // return c.modulecss;
        // },
        polyfills:function(){
          return c.polyfills;
        },
        polyfillsie7:function(){
          return c.polyfillsie7;
        },
        plugins:function(){
          return c.plugins;
        },
        secondary:function(){
          return c.secondary;
        },
        defer:function(){
          return c.defer;
        },
        doccoModules:function(){
          return grunt.file.expand('../docs/docco/modules/*.html').map(function(a){return a.split('/').pop()}).filter(function(a){return !a.match(/index.html/g)});
        },
        doccoSecondary:function(){
          return grunt.file.expand('../docs/docco/secondary/*.html').map(function(a){return a.split('/').pop()}).filter(function(a){return !a.match(/index.html/g)});
        },
        doccoGlobal:function(){
          return grunt.file.expand('../docs/docco/global/*.html').map(function(a){return a.split('/').pop()}).filter(function(a){return !a.match(/index.html/g)});
        },
        pages:function(){
          return grunt.file.expand('packages/pages/*.jade').map(function(a){return a.split('/').pop().replace(/.jade/g, '.html')}).filter(function(a){return a.match(/-pagebuild.html/g)});
        },
        demos:function(){
          return grunt.file.expand('packages/modules/**/demo/*.jade').map(function(a){return a.split('/').pop().replace(/.jade/g, '.html')}).filter(function(a){return a.match(/-demo.html/g)});
        },
        generateddemos:function(){
          return grunt.file.expand('packages/pages/*.jade').map(function(a){return a.split('/').pop().replace(/.jade/g, '.html')}).filter(function(a){return a.match(/-demo.html/g)});
        },
        layouts:function(){
          return grunt.file.expand('packages/modules/**/demo/*.jade').map(function(a){return a.split('/').pop().replace(/.jade/g, '.html')}).filter(function(a){return a.match(/-layouts.html/g)});
        },
        demostyles:function(){
          return grunt.file.expand('packages/modules/**/demo/*.jade').map(function(a){return a.split('/').pop().replace(/.jade/g, '.html')}).filter(function(a){return a.match(/-styles.html/g)});
        },
        data: function(path){
          return jadeconfig.data.data(path);
        },
        partial: function(templatePath, dataObj){
          return jadeconfig.data.partial(templatePath, dataObj);
        }

      }
    }
  }

  grunt.config.init({

    pkg: grunt.file.readJSON('package.json'),

    clean:{
     options:{
        force:true
      },
      debug: ['../build/debug/'],
      deploy: ['../build/deploy/'],
      deployRequireJSTemp: ['../build/deploy-requirejs-temp/'],
      docs: ['../docs/']
    },

    jshint: {
      files: ['packages/**/*.js', 'packages/**/*.json', '!packages/docs/**', '!**/libs/*.js'],
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
        strict: false,
        supernew: true,
        white: false,
        globals: {
          log: true,
          SONY: true,
          iQ: true,
          $: true,
          jQuery: true,
          Modernizr: true,
          IScroll: true,
          window: true,
          alert: true,
          document: true
        }
      }
    },

    copy:{
      common_debug:{
        files:[
          {expand: true, cwd:'packages/common/img/',      src: ['**'], dest: '../build/debug/img/'},
          {expand: true, cwd:'packages/common/fonts/',    src: ['**'], dest: '../build/debug/fonts/'},
          {expand: true, cwd:'packages/common/js/',       src: ['**'], dest: '../build/debug/js/'}
        ]
      },
      common_deploy:{
        files:[
          {expand: true, cwd:'packages/common/img/',      src: ['**'], dest: '../build/deploy/img/'},
          {expand: true, cwd:'packages/common/fonts/',    src: ['**'], dest: '../build/deploy/fonts/'},
          {expand: true, cwd:'packages/common/js/',       src: ['**'], dest: '../build/deploy/js/'}
        ]
      },
      module_debug:{
        files: function(){
          var mod, arr = [];
          grunt.file.expand('packages/modules/**/img/').forEach(function(path){
            mod = path.split('/')[2];
            arr.push({expand:true, cwd:path, src:['**'], dest:'../build/debug/img/'+mod+'/',});
          });
          grunt.file.expand('packages/modules/**/js/').forEach(function(path){
            mod = path.split('/')[2];
            arr.push({expand:true, cwd:path, src:['**'], dest:'../build/debug/js/modules/' + mod});
          });
          return arr;
        }()
      },
      module_deploy:{
        files: function(){
          var mod, arr = [];
          grunt.file.expand('packages/modules/**/img/').forEach(function(path){
            mod = path.split('/')[2];
            arr.push({expand:true, cwd:path, src:['**'], dest:'../build/deploy/img/'+mod+'/'})
          });
          return arr;
        }()
      },
      rjs_deploy: {
        files: [
          {expand: true, cwd:'../build/deploy-requirejs-temp/js/',      src: ['**'], dest: '../build/deploy/js/'},
        ]
      },
      docs:{
        files:[
          {expand: true, cwd:'packages/common/img/',      src: ['**'], dest: '../docs/img/'},
          {expand: true, cwd:'packages/common/fonts/',    src: ['**'], dest: '../docs/fonts/'},
          {expand: true, cwd:'packages/common/js/',       src: ['**'], dest: '../docs/js/'},
          {expand: true, cwd:'packages/docs/js/',         src: ['**'], dest: '../docs/js/'},
          {expand: true, cwd:'packages/docs/img/',        src: ['**'], dest: '../docs/img/'},
          {expand: true, cwd:'packages/docs/css/',        src: ['*.css'], dest: '../docs/css/'}
        ]
      }

    },

    compass:{
      common_debug:{
        options:{
          sassDir: 'packages/common/css',
          cssDir: '../build/debug/css',
          outputStyle: 'expanded',
          noLineComments: false,
          force: true,
          images: '../build/debug/img',
          relativeAssets: true,
          environment: 'development'
        }
      },
      common_deploy:{
        options:{
          sassDir: 'packages/common/css',
          cssDir: '../build/deploy/css',
          outputStyle: 'compressed',
          noLineComments: true,
          force: true,
          images: '../build/deploy/img',
          relativeAssets: true,
          environment: 'production'
        }
      },
      module_debug:{
        options:{
          cssDir: '../build/debug/css/modules',
          importPath: 'packages/common/css',
          outputStyle: 'expanded',
          noLineComments: false,
          force: true,
          images: '../build/debug/img',
          relativeAssets: true,
          environment: 'development'
        }
      },
      module_deploy:{
        options:{
          cssDir: '../build/deploy/css/modules',
          importPath: 'packages/common/css',
          outputStyle: 'compressed',
          noLineComments: true,
          force: true,
          images: '../build/deploy/img',
          relativeAssets: true,
          environment: 'production'
        }
      },
      common_docs:{
        options:{
          sassDir: 'packages/common/css',
          cssDir: '../docs/css',
          outputStyle: 'expanded',
          noLineComments: false,
          force: true,
          images: '../docs/img',
          relativeAssets: true,
          environment: 'development'
        }
      },
      docs:{
        options:{
          sassDir: 'packages/docs/css',
          cssDir: '../docs/css',
          outputStyle: 'expanded',
          noLineComments: false,
          force: true,
          images: '../docs/img',
          relativeAssets: true,
          environment: 'development'
        }
      }
    },

    jade:{
      docs:{
        options:jadeconfig,
        files:[
          {expand:true, cwd:'packages/docs/html', src:['*.jade'], dest:'../docs/', ext:'.html', flatten:true}
        ]
      },
      pages_debug:{
        options:jadeconfig,
        files:[
          {expand:true, cwd:'packages/pages/', src:['*.jade'], dest:'../build/debug/', ext:'.html', flatten:true}
        ]
      },
      pages_deploy:{
        options:jadeconfig,
        files:[
          {expand:true, cwd:'packages/pages/', src:['*.jade'], dest:'../build/deploy/', ext:'.html', flatten:true}
        ]
      },
      build_debug:{
        options:jadeconfig,
        files:[
          {expand:true, cwd:'packages/modules/', src:['**/demo/*.jade'], dest:'../build/debug/', ext:'.html', flatten:true}
        ]
      },
      build_deploy:{
        options:jadeconfig,
        files:[
          {expand:true, cwd:'packages/modules/', src:['**/demo/*.jade'], dest:'../build/deploy/', ext:'.html', flatten:true}
        ]
      }
    },

    watch:{
      common:{
        files:['packages/common/**/*.*', '!packages/common/css/responsive-modules.scss'],
        tasks:['common']
      },
      js:{
        files:['packages/modules/**/js/*.js'],
        tasks:['js']
      },
      css:{
        files:['packages/modules/**/css/*.scss'],
        tasks:['css']
      },
      html:{
        files:['packages/common/html/**/*.jade', 'packages/modules/**/*.jade', 'packages/modules/**/*.json'],
        tasks:['html']
      },
      assets:{
        files:['packages/modules/**/img/**/*.*'],
        tasks:['assets']
      },
      docs: {
        files:['packages/docs/**/*.*'],
        tasks:['docs']
      }
    },

    doccoh: {
      modules: {
        src: grunt.file.expand('packages/modules/**/js/*.js').filter(function(a){return !a.match(/index.js/g)}),
        options: {
          output: '../docs/docco/modules'
        }
      },

      secondary: {
        src: grunt.file.expand('packages/common/js/secondary/**/*.js').filter(function(a){return !a.match(/index.js/g)}),
        options: {
          output: '../docs/docco/secondary'
        }
      },

      global: {
        src: grunt.file.expand('packages/common/js/require/**/*.js').filter(function(a){return !a.match(/index.js/g)}),
        options: {
          output: '../docs/docco/global'
        }
      }
    },

    requirejs: {
      std: {
        options: {
          appDir: '../build/deploy',
          mainConfigFile: '../build/deploy/js/common.js',
          dir: '../build/deploy-requirejs-temp',
          fileExclusionRegExp: /css|fonts|img/,
          logLevel: 1,
          preserveLicenseComments: false,
          modules: (function(){
            var arr = [
              {
                name: 'common',
              },
              {
                name: 'plugins/index',
                exclude: ['common']
              },
              {
                name: 'require/index',
                exclude: ['common', 'plugins/index']
              },
              {
                name: 'secondary/index',
                exclude: ['common', 'plugins/index', 'require/index']
              },
            ];

            grunt.file.expand('../build/deploy/js/modules/**/index.js').forEach(function(path){
              arr.push({
                name: path.split('../build/deploy/js/')[1].split('.js')[0],
                exclude: ['common', 'plugins/index', 'require/index', 'secondary/index']
              });
            })

            return arr;

          })()
        }
      }
    }
  });

  //load grunt plugin tasks
  grunt.loadNpmTasks('grunt-clear');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-yui-compressor');
  grunt.loadNpmTasks('grunt-requirejs');
  grunt.loadNpmTasks('grunt-doccoh');

  //define task scripts
  grunt.registerTask('default', ['build']);

  grunt.registerTask('docs', ['clean:docs', 'compass:common_docs', 'compass:docs', 'copy:docs', 'doccoh', 'jade:docs']);

  grunt.registerTask('lint', ['jshint']);

  grunt.registerTask('debug', function(){
    grunt.option('deploy', false);
    grunt.task.run('build');
  });

  grunt.registerTask('deploy', function(){
    grunt.option('deploy', true);
    grunt.task.run('build');
  });

  grunt.registerTask('pages_debug', function(){
    grunt.option('deploy', false);
    grunt.task.run('pages');
  });

  grunt.registerTask('pages_deploy', function(){
    grunt.option('deploy', true);
    grunt.task.run('pages');
  });

  grunt.registerTask('requirejs_deploy', function(){
    grunt.option('deploy', true);
    grunt.task.run(['copy:common_deploy', 'requirejs', 'copy:rjs_deploy', 'clean:deployRequireJSTemp']);
  });

  grunt.registerTask('all', ['clean', 'debug', 'deploy', 'docs', 'pages_debug', 'pages_deploy']);

  //******************************************************************************
  //all of the following can be called with --deploy otherwise they assume --debug
  //******************************************************************************

  grunt.registerTask('pages', function(){
    var env = grunt.option('deploy') ? 'deploy' : 'debug';
    grunt.config('jshint.files', ['packages/pages/data/**/*.json']);
    grunt.task.run(['jshint', 'jade:pages_'+env]);
  });

  grunt.registerTask('common', 'lint, scss, copy', function(){
    var env = grunt.option('deploy') ? 'deploy' : 'debug';

    grunt.config('jshint.files', ['packages/common/js/require/*.js', 'packages/common/js/secondary/*.js']);
    grunt.task.run('jshint');

    var str = '@import "_base/variables"; \n@import "_base/mixins"; \n';
    grunt.file.expand('packages/modules/**/css/*.scss').filter(function(a){return a.match(/_responsive/g)}).forEach(function(path){
      str += '@import "' + path.replace(/packages/g, '../..') +'"; \n';
    })

    grunt.file.write('packages/common/css/responsive-modules.scss', str);

    grunt.task.run('compass:common_' + env);

    grunt.task.run('copy:common_' + env);

  });

  //****************************************************************************************
  //all of the following can also be called with :your-module-name otherwise they assume all
  //****************************************************************************************

  grunt.registerTask('css', 'run compass on *.scss', function(module){
    module = module || '**';
    var env = grunt.option('deploy') ? 'deploy' : 'debug';

    grunt.file.expand('packages/modules/'+ module +'/css').forEach(function(path){
      grunt.registerTask(path, function(){
        grunt.config('compass.module_'+env+'.options.sassDir', path.toString());
        grunt.task.run('compass:module_' + env);
      });
      grunt.task.run(path);
    })

   var str = '@import "_base/variables"; \n@import "_base/mixins"; \n';
    grunt.file.expand('packages/modules/**/css/*.scss').filter(function(a){return a.match(/_responsive/g)}).forEach(function(path){
      // console.log(path);

      str += '@import "' + path.replace(/packages/g, '../..') +'"; \n';
    })

    grunt.file.write('packages/common/css/responsive-modules.scss', str);
    grunt.config('compass.common_'+env+'.options.specify', 'packages/common/css/responsive-modules.scss')
    grunt.task.run('compass:common_'+env);

  });

  grunt.registerTask('assets', 'copy all images', function(module){
    module = module || '**';
    var env = grunt.option('deploy') ? 'deploy' : 'debug';
    var mod, arr = [];

    grunt.file.expand('packages/modules/'+module+'/img/').forEach(function(path){
      mod = path.split('/')[2];
      arr.push({expand:true, cwd:path, src:['**'], dest:'../build/'+ env +'/img/'+mod+'/'})
    });
    grunt.config('copy.module_'+env+'.files', arr);
    grunt.task.run('copy:module_' + env);
  });

  grunt.registerTask('html', 'lint and compile demo/*.html.jade pages against demo/data/*.json files', function(module){
    module = module || '**';

    if ( module.search('common_') >= 0 ) {
      module = '**';
    }

    var env = grunt.option('deploy') ? 'deploy' : 'debug';
    var mod, arr = [];

    grunt.config('jshint.files', ['packages/modules/' + module + '/**/*.json']);
    grunt.task.run('jshint');

    grunt.file.expand('packages/modules/'+module+'/demo/').forEach(function(path){
      mod = path.split('/')[2];
      arr.push({expand:true, cwd:path, src:['*.jade'], dest:'../build/'+ env, ext:'.html', flatten:true})
    });
    grunt.config('htmlStartStamp', new Date());
    grunt.registerTask('htmlCompleteTime', function(m){
      console.log('Completed in ' + ((new Date()) - grunt.config('htmlStartStamp')) / 1000 + ' seconds.');
    });
    grunt.config('jade.build_'+env+'.files', arr);
    grunt.task.run('jade:build_'+env);
    grunt.task.run('htmlCompleteTime');

  });

  grunt.registerTask('js', 'lint js/*.js files then minify and copy', function(module){
    module = module || '**';
    var env = grunt.option('deploy') ? 'deploy' : 'debug'
    var mod, arr = [];

    grunt.config('jshint.files', ['packages/modules/' + module + '/js/*.js']);
    grunt.task.run('jshint');

    grunt.file.expand('packages/modules/'+module+'/js/').forEach(function(path){
      mod = path.split('/')[2];
      arr.push({expand:true, cwd:path, src:['**'], dest:'../build/'+ env +'/js/modules/' + mod})
    });
    grunt.config('copy.module_'+env+'.files', arr);
    grunt.task.run('copy:module_' + env);

  });

  grunt.registerTask('light', function(module){
    module = module ? ":" + module : ""
    grunt.task.run(['css'+module, 'js'+module, 'html'+module])
  });

  grunt.registerTask('build', function(module){
    module = module ? ":" + module : ""
    grunt.task.run(['clear', 'common', 'assets'+module, 'light'+module])

    if(grunt.option('deploy')){
      grunt.task.run('requirejs_deploy');
    }
  });

  grunt.registerTask('w', function(module){
    module = module || '**';

    var jsWatch = ['packages/modules/' + module + '/js/*.js'],
        cssWatch = ['packages/modules/' + module + '/css/*.scss'],
        htmlWatch = ['packages/modules/' + module + '/**/*.jade', 'packages/modules/' + module + '/**/*.json'],
        imgWatch = ['packages/modules/' + module + '/img/*.*'];

    var jsTask = ['js:'+module],
        cssTask = ['css:'+module],
        htmlTask = ['html:'+module],
        imgTask = ['assets:'+module];

    for ( var i = 1; i < arguments.length; i++ ) {
      jsWatch.push('packages/modules/' + arguments[i] + '/js/*.js');
      cssWatch.push('packages/modules/' + arguments[i] + '/css/*.scss');
      htmlWatch.push('packages/modules/' + arguments[i] + '/**/*.jade');
      htmlWatch.push('packages/modules/' + arguments[i] + '/**/*.json');
      imgWatch.push('packages/modules/' + arguments[i] + '/img/*.*');

      jsTask.push('js:'+arguments[i]);
      cssTask.push('css:'+arguments[i]);
      htmlTask.push('html:'+arguments[i]);
      imgTask.push('assets:'+arguments[i]);
    }

    grunt.config('watch.js.files', jsWatch);
    grunt.config('watch.css.files', cssWatch);
    grunt.config('watch.html.files', htmlWatch);
    grunt.config('watch.assets.files', imgWatch);

    if(module !== '**'){

      grunt.config('watch.js.tasks', jsTask);
      grunt.config('watch.css.tasks', cssTask);
      grunt.config('watch.html.tasks', htmlTask);
      grunt.config('watch.assets.tasks', imgTask);
    }

    grunt.task.run('watch');
  });

  grunt.registerTask('dummygen', function(module){
    if (!module) return
    // write module-variations.jade page into module/demo

    var set = grunt.file.expand('packages/modules/'+module+'/demo/data/dummy/*.json').map(function(a){return a.split('/').pop()});

    var file = "include ../../../common/html/jade-helpers.jade\n";
    file += "doctype 5\n";
    file += "include ../../../common/html/ieconditionals.html\n";
    file += "\n";
    file += "head\n";
    file += "  include ../../../common/html/head.jade\n";
    file += "\n";
    file += "body\n";

    for (var i in set){

      file += "  h6 "+set[i].split('.json')[0]+":\n";
      file += "  +partial('"+module+"/html/"+module+".jade', 'packages/modules/"+module+"/demo/data/dummy/"+set[i]+"')\n"
      file += "  hr\n";
      file += "\n";

    }

    file += "  include ../../../common/html/foot.jade\n";
    file += "</html>\n";

    grunt.file.write('packages/modules/'+module+'/demo/'+module+'-variations.jade', file);

  });







  //*************************************
  // The following are utility functions.
  //*************************************

  // Use in conjunction with timerEnd to test performance/load of your commands.
  // ex. `grunt timerStart command-foo timerEnd

  grunt.registerTask('timer-start', function() {
    grunt.config('timerStartStamp', new Date());
  });

  grunt.registerTask('timer-end', function() {
    console.log('Completed in ' + ((new Date()) - grunt.config('timerStartStamp')) / 1000 + ' seconds.')
  });

};
