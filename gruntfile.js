module.exports = function (grunt) {
  "use strict";

  // ----------------------------------------------------
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    clean: {
      dist: ["dist"],
    },

    uglify: {
      options: {
        preserveComments: false,
        banner:
          "/*!\n" +
          " * slimtable ( https://slimtable.mcfish.org/ )\n" +
          " *\n" +
          " * Licensed under MIT license.\n" +
          " *\n" +
          " * @version <%= pkg.version %>\n" +
          " * @author Pekka Harjamäki\n" +
          " */",
      },
      main: {
        src: "src/slimtable.js",
        dest: "dist/js/slimtable.min.js",
      },
    },

    copy: {
      css: {
        expand: true,
        cwd: "src/",
        src: "css/*",
        dest: "dist/",
        filter: "isFile",
      },
    },

    qunit: {
      all: ["tests/*.html"],
    },
  });

  // ----------------------------------------------------
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-qunit");

  // ----------------------------------------------------
  grunt.registerTask("default", ["clean:dist", "uglify:main", "copy:css"]);
  grunt.registerTask("test", ["qunit:all"]);
};
