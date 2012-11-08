/*global module:false*/
module.exports = function(grunt) {

// Project configuration.
	grunt.initConfig({
		lint: {
			files: ['js/bundle/*.js']
		},
		jshint: {
  			options: {
   				curly: true,
    			eqeqeq: true,
    			immed: true,
			    latedef: true,
			    newcap: true,
			    noarg: true,
			    sub: true,
			    undef: true,
			    boss: true,
			    eqnull: true,
			    node: true,
			    es5: true,
			    strict: false
    		},
		},
		watch: {
			files: ['css/scss/*.scss', 
					'js/**/*.js', 
					'html/**/*.*'],
			tasks: ['default']
		},
		compass: {
		    debug: {
		        src: 'css/scss/',
		        dest: '../build/debug/css',
		        outputstyle: 'expanded',
		        linecomments: true,
		        forcecompile: true,
		        debugsass: true,
		        images: '../build/debug/img',
		        relativeassets: true
		    },
		    deploy: {
		        src: 'css/scss',
		        dest: 'css/temp',
		        outputstyle: 'compressed',
		        linecomments: false,
		        forcecompile: true,
		        debugsass: false,
		        images: '../build/deploy/img',
		        relativeassets: true
		    },
		    docs: {
		        src: 'css/scss',
		        dest: '../docs/css',
		        outputstyle: 'expanded',
		        linecomments: true,
		        forcecompile: true,
		        debugsass: true,
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
			defer:{
				src: 'js/bundle/defer/*.js',
				dest: '../build/deploy/js/defer.min.js'
			},
			polyfill:{
				src: 'js/bundle/polyfill/*.js',
				dest: '../build/deploy/js/polyfill.min.js'
			}
		},
		cssmin:{
			deploy:{
				 src: ['css/libs/*.css','css/temp/*.css'],
		        dest: '../build/deploy/css/styles.min.css',
		        seperator:';'
			}
		},
		clean:{
			debug:'../build/debug/',
			deploy:'../build/deploy/',
			docs:'../docs/'
		},
		copy:{
			debug:{
				files:{
					'../build/debug/img/' 		: 'img/build/**',
					'../build/debug/js/' 		: 'js/**',
					'../build/debug/ico/' 		: 'img/ico/**',
					'../build/debug/fonts/' 	: 'fonts/**'
				}
			},
			deploy:{
				files:{
					'../build/deploy/img/' 		: 'img/build/**',
					'../build/deploy/ico/' 		: 'img/ico/**',
					'../build/deploy/fonts/' 	: 'fonts/**'
				}
			},
			docs:{
				files:{
					'../docs/js/libs/' 			: 'js/libs/*',
					'../docs/ico/' 				: 'img/ico/**',
					'../docs/fonts/' 			: 'fonts/**',
					'../docs/img/' 				: 'img/docs/**'
				}
			},
			
		},
		shell:{
			docpad_debug:{
				command:'docpad generate --env debug'
			},
			docpad_deploy:{
				command:'docpad generate --env deploy'
			},
			docpad_docs:{
				command:'docpad generate --env docs'
			}

		}
	});

	grunt.loadNpmTasks('grunt-clear');
	grunt.loadNpmTasks('grunt-compass');
	grunt.loadNpmTasks('grunt-yui-compressor');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-shell');

	grunt.registerTask('debug', 'clear clean:debug lint compass-clean compass:debug copy:debug  shell:docpad_debug');
	grunt.registerTask('docs', 'clear clean:docs compass-clean compass:docs copy:docs shell:docpad_docs');
	grunt.registerTask('deploy', 'clear clean:deploy lint compass-clean compass:deploy min cssmin:deploy copy:deploy  shell:docpad_deploy');
	grunt.registerTask('default', 'debug');
	grunt.registerTask('all', 'debug deploy docs');
};
