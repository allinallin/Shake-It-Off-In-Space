'use strict';
module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);
    
    // Configurable paths
    var config = {
        app: '.',
        dist: 'dist'
    };

	grunt.initConfig({
        config: config,
		connect: {
            options: {
                port: 9000,
                livereload: 35729,
                // Change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    open: true
                }
            },
            dist: {
                options: {
                    open: true,
                    base: '<%= config.dist %>',
                    livereload: false
                }
            }
        },
		watch: {
            gruntfile: {
                files: ['Gruntfile.js']
            },
			sass: {
				files: ['<%= config.app %>/scss/**/*.{scss,sass}'],
				tasks: ['sass', 'autoprefixer']
			},
			livereload: {
				options: { livereload: true },
				files: [
                    '<%= config.app %>/css/**/*.css', 
                    '<%= config.app %>/**/*.php', 
                    '<%= config.app %>/**/*.html', 
                    '<%= config.app %>/js/**/*.js', 
                    '<%= config.app %>/media/**/*.{png,jpg,jpeg,gif,webp,svg,mp3,mp4,webm,ogg,ogv}'
                ]
			}
		},
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: ['<%= config.dist %>/*']
                }]
            }
        },
        requirejs: {
          dist: {
            options: {
            baseUrl: '<%= config.app %>/js',
              mainConfigFile: '<%= config.app %>/js/main.js',
              name: 'main',
              out: '<%= config.dist %>/js/main.js'
            }
          }
        },
		sass: {
			dist: {
				files: {
					'<%= config.app %>/css/styles.css': '<%= config.app %>/scss/styles.scss'
				}
			}
		},
		autoprefixer: {
            options: {
                browsers: ['last 2 versions', 'ie >= 9', 'ios 6', 'android 4'],
                map: true
            },
            files: {
                expand: true,
                flatten: true,
                src: '<%= config.app %>/css/styles.css',
                dest: '<%= config.app %>/css'
            }
        },
        // cssmin: {
        //     options: {
        //         keepSpecialComments: 1
        //     },
        //     minify: {
        //         expand: true,
        //         cwd: 'css/styles.css',
        //         src: ['*.css', '!*.min.css'],
        //         ext: '.css'
        //     }
        // },
        // Renames files for browser caching purposes
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= config.dist %>/js/{,*/}*.js',
                        '<%= config.dist %>/css/{,*/}*.css',
                        '<%= config.dist %>/*.{ico,png}'
                    ]
                }
            }
        },
        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            options: {
                dest: '<%= config.dist %>'
            },
            html: '<%= config.app %>/index.html'
        },
        // Performs rewrites based on rev and the useminPrepare configuration
        usemin: {
            options: {
                assetsDirs: ['<%= config.dist %>', '<%= config.dist %>/media/images']
            },
            html: ['<%= config.dist %>/{,*/}*.html'],
            css: ['<%= config.dist %>/css/{,*/}*.css']
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/media/images',
                    src: '{,*/}*.{gif,jpeg,jpg,png}',
                    dest: '<%= config.dist %>/media/images'
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/media/images',
                    src: '{,*/}*.svg',
                    dest: '<%= config.dist %>/media/images'
                }]
            }
        },
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= config.app %>',
                        dest: '<%= config.dist %>',
                        src: [
                            '<%= config.app %>/.htaccess',
                            '<%= config.app %>/index.html', 
                            '<%= config.app %>/media/**/*.{webp,mp3,mp4,webm,ogg,ogv,wav}'
                        ]
                    }
                ]
            }
        }
	});

    grunt.registerTask('build', function() {
        grunt.task.run([
            'clean:dist', 
            'useminPrepare', 
            'sass', 
            'autoprefixer', 
            'imagemin', 
            'svgmin',
            'concat',
            'cssmin',
//            'uglify',
            'requirejs',
            'copy:dist',
            'rev', 
            'usemin'
        ]);
    });

	grunt.registerTask('serve', function() {
        grunt.task.run(['sass', 'autoprefixer']);
        grunt.task.run(['connect:livereload', 'watch']);
    });

	grunt.registerTask('default', function() {
        grunt.task.run(['build']);
    });
};