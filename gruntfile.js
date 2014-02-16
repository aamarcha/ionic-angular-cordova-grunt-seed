/*global module: true */
module.exports = function (grunt) {
    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            all: ['<%=pkg.folders.build %>'],
        },
        jshint: {
            src: '<%=pkg.folders.jsSource %>' + '**/*.js',
            grunt: ['gruntfile.js'],
            options: {
                jshintrc: '.jshintrc',
                globals: {
                }
            }
        },
        copy: {
            index: {
                files: [
                {
                    expand: true,
                    dest: '<%= pkg.folders.build%>',
                    src: ['index.html', 'config.xml'],
                    cwd: '<%= pkg.folders.wwwRoot%>'
                }
                ]
            },
            css: {
                files: [
                {
                    expand: true,
                    dest: '<%= pkg.folders.build%>/css/',
                    src: ['*.css'],
                    cwd: '<%= pkg.folders.wwwRoot%>css/'
                }
                ]
            },
            templates: {
                files: [
                {
                    expand: true,
                    dest: '<%=pkg.folders.build %>/templates/',
                    src: ['**', '!**/*.js', "!**/README"],
                    cwd: '<%= pkg.folders.wwwRoot%>templates/'
                }
                ]
            },
            fonts: {
                expand: true,
                dest: '<%=pkg.folders.build %>fonts',
                src: ['**'],
                cwd: 'bower_components/ionic/release/fonts'
            },
            res: {
                expand: true,
                dest: '<%=pkg.folders.build %>/res',
                src: ['**','**/*'],
                cwd: '<%= pkg.folders.wwwRoot%>res'
            },
            images: {
                expand: true,
                dest: '<%=pkg.folders.build %>img',
                src: ['**'],
                cwd: '<%= pkg.folders.wwwRoot%>img'
            }
        },
        cssmin: {
            css: {
                files: {
                    '<%=pkg.folders.build%>css/app.css': [
                    'bower_components/ionic/release/css/ionic.min.css',
                    '<%=pkg.folders.build%>css/app.css'
                    ]
                }
            }
        },
        uglify: {
            options: {
                mangle: false
            },
            dist: {
                files: {
                    '<%= pkg.folders.build %>main.js': [
                    'bower_components/ionic/release/js/ionic.min.js',
                    'bower_components/angular/angular.min.js',
                    'bower_components/angular-animate/angular-animate.min.js',
                    'bower_components/angular-sanitize/angular-sanitize.js',
                    'bower_components/angular-ui-router/release/angular-ui-router.min.js',
                    'bower_components/ionic/release/js/ionic-angular.min.js',
                    '<%= pkg.folders.jsSource %>app.js',
                    '<%= pkg.folders.jsSource %>controllers.js',
                    '<%= pkg.folders.jsSource %>services.js'
                    ]
                }
            }
        },
        cordovacli: {
            options: {
                path: 'dist'
            },
            cordova: {
                options: {
                    command: ['create','platform','plugin','build'],
                    platforms: ['android'],
                    plugins: ['device','dialogs'],
                    path: 'dist',
                    id: 'io.yourcompany.istarter',
                    name: 'istarter'
                }
            },
            create: {
                options: {
                    command: 'create',
                    id: 'io.yourcompany.istarter',
                    name: 'istarter'
                }
            },
            add_platforms: {
                options: {
                    command: 'platform',
                    action: 'add',
                    platforms: ['android']
                }
            },
            add_plugins: {
                options: {
                    command: 'plugin',
                    action: 'add',
                    plugins: [
                    'battery-status',
                    'splashscreen'
                    ]
                }
            },
            build_ios: {
                options: {
                    command: 'build',
                    platforms: ['ios']
                }
            },
            build_android: {
                options: {
                    command: 'run',
                    platforms: ['android']
                }
            },
            emulate_android: {
                options: {
                    command: 'emulate',
                    platforms: ['android'],
                    args: ['--target','Nexus5']
                }
            }
        },
        release: {
            options: {
                npm: true
            }
        }
    });

grunt.registerTask("init", ['cordovacli:cordova']);

grunt.registerTask("install", "Create a deployable artifact in www",
    ['jshint',
    'clean:all',
    'uglify',
    'copy:css',
    'cssmin',
    'copy:templates',
    'copy:res',
    'copy:fonts',
    'copy:images',
    'copy:index',
    'cordovacli:build_android']
    );

grunt.registerTask('default', ['jshint']);

require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
};
