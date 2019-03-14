const gulp		= require( 'gulp' ),
	terser		= require( 'gulp-terser' ),
	typescript	= require( 'gulp-typescript' ),
	rename 		= require( 'gulp-rename' ),
	replace		= require( 'gulp-replace' );


const transpile = ( target, module ) => {
	return gulp.src( 'src/*.ts' )

		// First, we transpile back to JS.
		.pipe( typescript({
			"target": target,
			"module": module
		}) )

		// Next, uglify it.
		.pipe( terser({ 
		    output: {
		        comments: "/^!/"
		    }
		}) );
};

/** Save plugin to be used without UMD pattern or ES6 module. */
const js = ( cb ) => {
	return transpile( 'es5', 'es6' )
		.pipe( rename( 'dotdotdot.js' ) )
		.pipe( replace( 'export default Dotdotdot;', '' ) )
		.pipe( gulp.dest( 'dist' ) )
};

/** Save plugin to be used as an ES6 module. */
const jsES6 = ( cb ) => {
	return transpile( 'es6', 'es6' )
		.pipe( rename( 'dotdotdot.es6.js' ) )
		.pipe( gulp.dest( 'dist' ) );
};

/** Save plugin to be used with UMD pattern. */
const jsUMD = ( cb ) => {
	return transpile( 'es5', 'umd' )
		.pipe( rename( 'dotdotdot.umd.js' ) )
		.pipe( gulp.dest( 'dist' ) );
};

exports.default = gulp.parallel( js, jsES6, jsUMD );

// Watch task 'gulp watch': Starts a watch on JS tasks
const watch = ( cb ) => {
	gulp.watch( 'src/*.ts', gulp.parallel( js, jsES6, jsUMD ) );
	cb();
};
exports.watch = watch;