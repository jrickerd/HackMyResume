module.exports = function (grunt) {

  'use strict';

  var opts = {

    pkg: grunt.file.readJSON('package.json'),

    simplemocha: {
      options: {
        globals: ['expect', 'should'],
        timeout: 3000,
        ignoreLeaks: false,
        ui: 'bdd',
        reporter: 'spec'
      },
      all: { src: ['test/*.js'] }
    },

    clean: {
      test: ['test/sandbox', 'out/*']
    },

    eslint: {
      target: ['Gruntfile.js', 'src/**/*.js', 'test/*.js']
    },
    
    shell: {
        resume: {
            command: 'node src/cli/index.js build resume.json to out/resume.all -t compact'
        },
        publish: {
            command: [
                'cp out/resume.html ./jrickerd.github.io/resume.html',
                'cp out/resume.md ./jrickerd.github.io/resume.md',
                'cp out/resume.pdf ./jrickerd.github.io/resume.pdf',
                'cp out/resume.doc ./jrickerd.github.io/resume.doc'
            ].join(';')
        }
    }

  };

  grunt.initConfig(opts);
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-shell');

  // Use 'grunt test' for local testing
  grunt.registerTask('test', 'Test the HackMyResume application.',
    function() {
      grunt.task.run(['clean:test','build','eslint','simplemocha:all']);
    }
  );

  // Use 'grunt build' to build HMR
  grunt.registerTask('build', 'Build the HackMyResume application.',
    function() {
      grunt.task.run( ['eslint'] );
    }
  );

  grunt.registerTask('resume', 'shell:resume');
  grunt.registerTask('publish', ['shell:resume', 'shell:publish']);
  
  // Default task does everything
  grunt.registerTask('default', [ 'test' ]);

};
