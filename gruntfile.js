module.exports = function(grunt){
  "use strict";

  // ----------------------------------------------------
  grunt.initConfig({
    clean: {
      dist: ["dist"]
    },

    uglify: {
      options: {
        preserveComments: 'some'
      },
      main: {
        src: "js/slimtable.js",
        dest: "dist/js/slimtable.min.js"
      }
    },

    copy: {
      css: {
        expand: true,
        src: "css/*",
        dest: "dist/",
        filter: "isFile"
      }
    }
  });

  // ----------------------------------------------------
  grunt.loadNpmTasks( "grunt-contrib-clean" );
  grunt.loadNpmTasks( "grunt-contrib-uglify" );
  grunt.loadNpmTasks('grunt-contrib-copy');

  // ----------------------------------------------------
  grunt.registerTask( "default", [ "clean:dist", "uglify:main", "copy:css" ] );
}
