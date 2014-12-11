'use strict';
module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);

	grunt.initConfig({
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
            }
        },
		watch: {
            gruntfile: {
                files: ['Gruntfile.js']
            },
			sass: {
				files: ['scss/**/*.{scss,sass}'],
				tasks: ['sass', 'autoprefixer', 'cssmin']
			},
			livereload: {
				options: { livereload: true },
				files: ['css/**/*.css', '**/*.php', '**/*.html', 'js/**/*.js', 'media/**/*.{png,jpg,jpeg,gif,webp,svg,mp3,mp4,webm,ogg,ogv}']
			}
		},
		sass: {
			dist: {
				files: {
					'css/styles.css': 'scss/styles.scss'
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
                src: 'css/styles.css',
                dest: 'css'
            },
        },
        cssmin: {
            options: {
                keepSpecialComments: 1
            },
            minify: {
                expand: true,
                cwd: 'css/styles.css',
                src: ['*.css', '!*.min.css'],
                ext: '.css'
            }
        }
	});

    grunt.registerTask('build', function() {
        grunt.task.run(['autoprefixer', 'sass']);
    });

	grunt.registerTask('serve', function() {
        grunt.task.run(['build']);
        grunt.task.run(['connect:livereload', 'watch']);
    });

	grunt.registerTask('default', function() {
        grunt.task.run(['build']);
    });
};