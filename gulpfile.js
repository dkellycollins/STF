var gulp = require('gulp');
var inject = require('gulp-inject');
var _ = require('lodash');

var paths = {
    scripts: {
        lib: ['./scripts/lib/*.js'],
        game: ['./scripts/*.js'],
    },
    styles: {
        game: ['./styles/*.scss']
    }
}

gulp.task('scripts:compile', function() {
    
});

gulp.task('scripts:inject', ['scripts:compile'], function() {
    var target = gulp.src('./index.html');

   var injectables = _.chain(_.values(paths.scripts)).values().flatten().value();
   var sources = gulp.src(injectables, {read: false});

   return target.pipe(inject(sources, {relative: true})).pipe(gulp.dest('./'));
});

gulp.task('styles:compile', function() {
    
});

gulp.task('styles:inject', ['styles:compile'], function() {
    
});

gulp.task('watch');