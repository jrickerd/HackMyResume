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
      test: ['test/sandbox', 'out']
    },

    eslint: {
      target: ['Gruntfile.js', 'src/**/*.js', 'test/*.js']
    },
    
    shell: {
        resume: {
            command: [
                'node src/cli/index.js build resume.json to out/resume-nopii.all -t themes/compact',
                'node src/cli/index.js build resume.json pii.json to out/resume.all -t themes/compact',
                '/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --headless --print-to-pdf=out/resume-nopii.pdf --no-pdf-header-footer out/resume-nopii.html',
                '/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --headless --print-to-pdf=out/resume.pdf --no-pdf-header-footer out/resume.html'
            ].join(';')
        },
        publish: {
            command: [
                'cp out/resume.html ./jrickerd.github.io/resume.html',
                'cp out/resume.md ./jrickerd.github.io/resume_md.md',
                'cp out/resume.txt ./jrickerd.github.io/resume.txt'
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
  grunt.registerTask('default', [ 'resume' ]);

};
