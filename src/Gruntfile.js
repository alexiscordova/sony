module.exports = function(grunt) {
  var jadeconfig = {
    data:{
      partial: function(templatePath, dataObj){
        var template = grunt.file.read(templatePath);
        
        if(typeof(dataObj) === String){
          dataObj = grunt.file.readJSON(dataObj)
        }
        
        if(templatePath.match(/.jade/g)){
          return require('grunt-contrib-jade/node_modules/jade').compile(template, {})(dataObj);
        }else{
          return template;
        }  
      },
      data: function(path){
        return grunt.file.readJSON(path);
      },
      locals:{
        getEnvironments:function(){
          return grunt.option('deploy') ? 'deploy' : 'debug'
        },
        plusify : function(str){
          return str.replace(/\[\+\]/g , '<i class="fonticon-30-plus"></i>');
        },
        modulescss:function(){
          return grunt.file.expand('packages/modules/**/css/*.scss').map(function(a){return a.split('/').pop()}).filter(function(a){return !a.match(/^_responsive/)});
        },
        polyfills:function(){
          return grunt.file.expand('packages/common/js/libs/polyfill/*.js').map(function(a){return a.split('/').pop()});
        },
        polyfillsie7:function(){
          return grunt.file.expand('packages/common/js/libs/polyfill-lte-ie7/*.js').map(function(a){return a.split('/').pop()});
        },
        plugins:function(){
          return grunt.file.expand('packages/common/js/plugins/*.js').map(function(a){return a.split('/').pop()});
        },
        secondary:function(){
          return grunt.file.expand('packages/common/js/secondary/*.js').map(function(a){return a.split('/').pop()});
        },
        defer:function(){
          return grunt.file.expand('packages/modules/**/js/*.js').map(function(a){return a.split('/').pop()});
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
      debug:['../build/debug/'],
      deploy:['../build/deploy/'],
      docs:['../docs/']
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
          {expand: true, cwd:'packages/common/js/libs/',  src: ['**'], dest: '../build/debug/js/libs/'}
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
            arr.push({expand:true, cwd:path, src:['**'], dest:'../build/debug/js/bundle/defer/'});
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
      docs:{
        files:[
        
        ]
      }
      
    },
    compass:{
      common_debug:{
        options:{
          sassDir: 'packages/common/css/',
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
          sassDir: 'packages/common/css/',
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
      docs:{
        options:{
          
        }
      }
    },
    min:{
      plugins:{
        src: 'packages/common/js/plugins/*.js',
        dest: '../build/deploy/js/plugins.min.js'
      },
      require:{
        src: [
          'packages/common/js/require/sony-global.js',
          'packages/common/js/require/sony-global-settings.js',
          'packages/common/js/require/sony-global-analytics.js',
          'packages/common/js/require/sony-global-utilities.js',
          'packages/common/js/require/exports.js',
          'packages/common/js/require/iq.js',
        ],
        dest: '../build/deploy/js/require.min.js'
      },
      secondary:{
        src: 'packages/common/js/secondary/*.js',
        dest: '../build/deploy/js/secondary.min.js'
      },
      defer:{
        src: 'packages/modules/**/js/*.js',
        dest: '../build/deploy/js/defer.min.js'
      },
      polyfill:{
        src: 'packages/common/js/libs/polyfill/*.js',
        dest: '../build/deploy/js/polyfill.min.js'
      }
    },
    jade:{
      docs:{
        
      },
      pages:{
        
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
  grunt.loadNpmTasks('grunt-doccoh');
  
  //define task scripts
  grunt.registerTask('default', ['build']);
  
  grunt.registerTask('docs', []);
  
  grunt.registerTask('pages', []);
  
  grunt.registerTask('lint', ['jshint']);
  
  grunt.registerTask('debug', function(){
    grunt.option('deploy', false);
    grunt.task.run('build');
  });
  
  grunt.registerTask('deploy', function(){
    grunt.option('deploy', true);
    grunt.task.run('build');
  });
  
  grunt.registerTask('all', ['clean', 'debug', 'deploy', 'docs', 'pages']);

  //all of the following can be called with --deploy otherwise they assume --debug
  grunt.registerTask('common', 'lint, scss, min js, copy images-fonts-js', function(){
    var env = grunt.option('deploy') ? 'deploy' : 'debug';
    
    grunt.config('jshint.files', ['packages/common/js/require/*.js', 'packages/common/js/secondary/*.js']);
    grunt.task.run('jshint');
    
    var str = '@import "_base/variables"; \n@import "_base/mixins"; \n';
    grunt.file.expand('packages/modules/**/css/*.scss').filter(function(a){return a.match(/_responsive/g)}).forEach(function(path){
      console.log(path);
      
      str += '@import "' + path.replace(/packages/g, '../..') +'"; \n';
    })
    
    grunt.file.write('packages/common/css/responsive-modules.scss', str);
    
    grunt.task.run('compass:common_' + env);
    if(grunt.option('deploy')){
      grunt.task.run(['min:plugins', 'min:require', 'min:secondary', 'min:polyfill']); 
    }
    
    grunt.task.run('copy:common_' + env);
    
  });
  
  //all of the following can also be called with :your-module-name otherwise they assume all
  grunt.registerTask('css', 'run compass on *.scss', function(module){
    module = module || '**';
    var env = grunt.option('deploy') ? 'deploy' : 'debug';
    
    grunt.file.expand('packages/modules/'+ module +'/css').forEach(function(path){
      grunt.registerTask(path, function(){
        grunt.config('compass.module_'+env+'.options.sassDir', path);
        grunt.task.run('compass:module_' + env);        
      });
      grunt.task.run(path);
    })
    
   var str = '@import "_base/variables"; \n@import "_base/mixins"; \n';
    grunt.file.expand('packages/modules/**/css/*.scss').filter(function(a){return a.match(/_responsive/g)}).forEach(function(path){
      console.log(path);
      
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
    var env = grunt.option('deploy') ? 'deploy' : 'debug';
    var mod, arr = [];
        
    grunt.config('jshint.files', ['packages/modules/' + module + '/**/*.json']);
    grunt.task.run('jshint');
    
    grunt.file.expand('packages/modules/'+module+'/demo/').forEach(function(path){
      mod = path.split('/')[2];
      arr.push({expand:true, cwd:path, src:['*.jade'], dest:'../build/'+ env, ext:'.html', flatten:true})
    });
    grunt.config('jade.build_'+env+'.files', arr);
    grunt.task.run('jade:build_'+env);  
    
  });
  
  grunt.registerTask('js', 'lint js/*.js files then minify and copy', function(module){
    module = module || '**';
    var env = grunt.option('deploy') ? 'deploy' : 'debug'
    var mod, arr = [];
    
    grunt.config('jshint.files', ['packages/modules/' + module + '/js/*.js']);
    grunt.task.run('jshint');
    
    grunt.file.expand('packages/modules/'+module+'/js/').forEach(function(path){
      mod = path.split('/')[2];
      arr.push({expand:true, cwd:path, src:['**'], dest:'../build/'+ env +'/js/defer/'})
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
  });
};