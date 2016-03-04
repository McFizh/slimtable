module.exports = function(grunt){
  "use strict";

  // ----------------------------------------------------
  grunt.initConfig({
    clean: {
      dist: ["dist"]
    },

    uglify: {
      options: {
        preserveComments: false,
		banner: "/*!\n" +
			" * slimtable ( http://slimtable.mcfish.org/ )\n" +
			" *\n" +
			" * Licensed under MIT license.\n" +
			" *\n" +
			" * @version 1.2.5\n" +
			" * @author Pekka Harjamäki\n" +
			" */"
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
    },

	jshint: {
		all: [ "gruntfile.js", "js/slimtable.js" ]
	},

	qunit: {
		all: [ "tests/*.html" ]
	}
  });

  // ----------------------------------------------------
  grunt.loadNpmTasks( "grunt-contrib-clean" );
  grunt.loadNpmTasks( "grunt-contrib-uglify" );
  grunt.loadNpmTasks( "grunt-contrib-copy" );
  grunt.loadNpmTasks( "grunt-contrib-qunit" );
  grunt.loadNpmTasks( "grunt-contrib-jshint" );

  // ----------------------------------------------------
  grunt.registerTask( "default", [ "clean:dist", "uglify:main", "copy:css" ] );
  grunt.registerTask( "test", [ "jshint:all", "qunit:all" ] );
};
