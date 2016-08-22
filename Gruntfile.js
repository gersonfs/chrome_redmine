module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        compress: {
            main: {
                options: {
                    archive: function () {
                        return (new Date()).getTime() + '.zip';
                    },
                    pretty: true
                },
                expand: true,
                src: ['**/*', '!node_modules/**', '!nbproject/**'],
                dest: '/'
            }
        }
    });

    grunt.registerTask('default', ['compress']);

};