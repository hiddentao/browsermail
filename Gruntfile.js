/*jshint camelcase: false*/
// Generated on 2013-06-28 using generator-chrome-extension 0.2.2
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // configurable paths
  var yeomanConfig = {
    app: 'src',
    dist: 'build'
  };

  grunt.initConfig({
    yeoman: yeomanConfig,
    watch: {
      options: {
        spawn: false
      },
      compass: {
        files: ['<%= yeoman.app %>/sass/{,*/}*.{scss,sass}'],
        tasks: ['compass:server']
      },
      build: {
        files: [
          '.tmp/css/*.*',
          '<%= yeoman.app %>/img/*.*',
          '<%= yeoman.app %>/js/*.*',
          '<%= yeoman.app %>/_locales/*.*',
          '<%= yeoman.app %>/*'
        ],
        tasks: ['build']
      }
    },
    clean: {
      build: {
        files: [
          {
            dot: true,
            src: [
              '.tmp',
              '<%= yeoman.dist %>/*',
              '!<%= yeoman.dist %>/.git*'
            ]
          }
        ]
      },
      server: '.tmp',
      release: 'release'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/src/{,chrome/,node-polyfills/}*.js'
      ]
    },
    compass: {
      options: {
        sassDir: '<%= yeoman.app %>/sass',
        cssDir: '.tmp/css',
        generatedImagesDir: '.tmp/img/generated',
        imagesDir: '<%= yeoman.app %>/img',
        javascriptsDir: '<%= yeoman.app %>/js',
        fontsDir: '<%= yeoman.app %>/sass/fonts',
        importPath: '<%= yeoman.app %>/bower_components',
        httpImagesPath: '/img',
        httpGeneratedImagesPath: '/img/generated',
        relativeAssets: false
      },
      build: {}
    },
    useminPrepare: {
      options: {
        dest: '<%= yeoman.dist %>'
      },
      html: [
        '<%= yeoman.app %>/index.html'
      ]
    },
    usemin: {
      options: {
        dirs: ['<%= yeoman.dist %>']
      },
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/css/{,*/}*.css']
    },
    imagemin: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.app %>/img',
            src: '{,*/}*.{png,jpg,jpeg}',
            dest: '<%= yeoman.dist %>/img'
          }
        ]
      }
    },
    svgmin: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.app %>/img',
            src: '{,*/}*.svg',
            dest: '<%= yeoman.dist %>/img'
          }
        ]
      }
    },
    cssmin: {
      dist: {
        files: {
          '<%= yeoman.dist %>/css/style.css': [
            '.tmp/css/style.css'
          ]
        }
      }
    },
    htmlmin: {
      dist: {
        options: {
          /*removeCommentsFromCDATA: true,
           // https://github.com/yeoman/grunt-usemin/issues/44
           //collapseWhitespace: true,
           collapseBooleanAttributes: true,
           removeAttributeQuotes: true,
           removeRedundantAttributes: true,
           useShortDoctype: true,
           removeEmptyAttributes: true,
           removeOptionalTags: true*/
        },
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.app %>',
            src: '*.html',
            dest: '<%= yeoman.dist %>'
          }
        ]
      }
    },
    // Put files not handled in other tasks here
    copy: {
      build: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: '<%= yeoman.app %>',
            dest: '<%= yeoman.dist %>',
            src: [
              '*.{ico,png,txt}',
              'img/{,*/}*.{webp,gif}',
              '_locales/{,*/}*.json',
              'js/chrome/*.js',
              'manifest.json'
            ]
          },
          {
            expand: true,
            cwd: '.tmp/img',
            dest: '<%= yeoman.dist %>/img',
            src: [
              'generated/*'
            ]
          }
        ]
      }
    },
    concurrent: {
      server: [
        'compass:server'
      ],
      test: [
        'compass'
      ],
      build: [
        'compass:build',
        'imagemin',
        'svgmin',
        'htmlmin'
      ]
    },
    shell: {
      weber: {
        command: 'node_modules/.bin/weber build'
      }
    },
    compress: {
      build: {
        options: {
          archive: 'release/browsermail.zip'
        },
        files: [
          {
            expand: true,
            cwd: 'build/',
            src: ['**'],
            dest: ''
          }
        ]
      }
    }
  });

  grunt.registerTask('build', [
    'jshint',
    'clean',
    'useminPrepare',
    'concurrent:build',
    'cssmin',
    'copy',
    'usemin',
    'shell:weber'
  ]);

  grunt.registerTask('release', [
    'build',
    'compress'
  ]);

};
