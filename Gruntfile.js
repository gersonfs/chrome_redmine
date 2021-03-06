module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        compress: {
            main: {
                options: {
                    archive: function () {
                        return 'dist/' + (new Date()).getTime() + '.zip';
                    },
                    pretty: true
                },
                expand: true,
                src: ['**/*', '!node_modules/**', '!nbproject/**', '!dist/**'],
            }
        }
    });

    grunt.registerTask('default', ['compress']);

};