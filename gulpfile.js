'use strict'

/*

the only important tasks are:

 - default (dev watcher)
 - dist (production build)
 - dev (development build)

*/

const argv  		= require('yargs').argv
const babel 	 	= require('gulp-babel')
const concat 	 	= require('gulp-concat')
const concatCss  	= require('gulp-concat-css')
const del 		 	= require('del')
const fs 			= require('fs')
const gulp 		 	= require('gulp')
const gutil			= require('gulp-util')
const hash          = require('gulp-hash')
const notify 	 	= require('gulp-notify')
const plumber 	 	= require('gulp-plumber')
const runSequence 	= require('run-sequence')
const sass 			= require('gulp-sass')
const uglify        = require('gulp-uglify')
const webpack 		= require('webpack')
const webpackStream = require('webpack-stream')
const WebpackServer = require('webpack-dev-server')

const paths = {
	app_js: 'src/app/**/*.js',
	browser_js: 'src/js/**/*.+(js|jsx)',
	js: 'src/**/*.+(js|jsx)',
	sass: 'src/sass/**/*.s?ss'
}

const babelrc = fs.readFileSync('./.babelrc');
let babelConfig = {};
babelConfig = JSON.parse(babelrc);

const hashOptions = {
    algorithm: 'md5',
    hashLength: 10,
    template: '<%= name %>.<%= hash %><%= ext %>'
};

const host = argv.host || 'localhost'
const port = argv.port || 3030

const productionLoaders = {
    loaders: [
        {
            test: /\.jsx?$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: babelConfig
        },
    ]
}

const devLoaders = {
    loaders: [
        {
            test: /\.jsx?$/,
            loaders: [
                'babel-loader?' + JSON.stringify(babelConfig)
            ],
            exclude: /node_modules/,
        },
    ]
}

const webpackConfig = {
    cache: true,
    context: __dirname + '/src/js',
    entry: {
        'main': './forge.jsx'
    },
    output: {
        path: __dirname + '/dist/js',
        filename: '[name].js',
        publicPath: 'http://'+host+':'+port+'/dist'
    },
    plugins: [
        // new webpack.ProvidePlugin({
        //     React: "react",
        //     "window.React": "react",
        //     Fluxxor: "fluxxor",
        //     $: "jquery",
        //     jQuery: "jquery",
        //     "windows.jQuery": "jquery"
        // })
    ],
    resolve: {
        root: [
            __dirname + '/app/js',
        ],
        extensions: ['', '.js', '.jsx'],
    },
}

//
// this probably doesn't need to be ran.
//
gulp.task('clean', cb => {
	del(['dist'], cb)
})

gulp.task('js', cb => {
	runSequence('js:build', 'js:bundle', cb)
})

gulp.task('js:build', cb => {
	return gulp.src(paths.app_js)
		.pipe(plumber())
		.pipe(babel({ presets: ['es2015', 'stage-0', 'react'], plugins: ["transform-regenerator", "transform-runtime"] }))
		.pipe(gulp.dest('dist/app'))
})

gulp.task('js:webpack', cb => {

    webpackConfig.module = productionLoaders
    webpackConfig.plugins.push(
        new webpack.DefinePlugin({
            __CLIENT__: true,
            __SERVER__: false,
            __DEVELOPMENT__: false,
            __DEVTOOLS__: false,  // <-------- DISABLE redux-devtools HERE
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    )

    return gulp.src(paths.browser_js)
        .pipe(webpackStream(webpackConfig))
        .pipe(gulp.dest('dist/js'))
})

gulp.task('js:minify', cb => {
    return gulp.src('dist/js/*.js')
            .pipe(uglify())
            //.pipe(hash(hashOptions))
            .pipe(gulp.dest("dist/js"))
})

gulp.task('js:dist', cb => {
    runSequence('js:webpack', 'js:minify', cb)
})

gulp.task('js:watch', cb => {
	gulp.watch(paths.app_js, ['js:build'])
})

gulp.task('sass', cb => {
	return gulp.src(paths.sass)
		.pipe(plumber())
		.pipe(sass().on('error', sass.logError))
		.pipe(concatCss('app.css'))
		.pipe(gulp.dest('dist/css'))
		.pipe(notify('SASS compiled.'))
})

gulp.task('sass:watch', cb => {
	gulp.watch(paths.sass, ['sass'])
})

const devCompiler = webpack(webpackConfig);

gulp.task("webpack-dev-server", function(cb) {
    // modify some webpack config options
    webpackConfig.module = devLoaders;
    webpackConfig.devtool = 'eval',
    webpackConfig.debug = true;

    for (var i in webpackConfig.entry) {
        var originalEntry = webpackConfig.entry[i];
        webpackConfig.entry[i] = [
            'webpack-dev-server/client?http://'+host+':'+port,
            'webpack/hot/only-dev-server',
            originalEntry
        ];
    }

    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
    webpackConfig.plugins.push(new webpack.NoErrorsPlugin());

    webpackConfig.plugins.push(
        new webpack.DefinePlugin({
            __CLIENT__: true,
            __SERVER__: false,
            __DEVELOPMENT__: true,
            __DEVTOOLS__: true,
        })
    );

    // Start a webpack-dev-server
    new WebpackServer(webpack(webpackConfig), {
        contentBase: "dist",
        publicPath: 'http://'+host+':'+port+'/dist',
        hot: true,
        headers: { 'Access-Control-Allow-Origin': '*' },
        stats: {
          colors: true,
          progress: true
        }
    }).listen(port, host, function(err) {
        if(err) throw new gutil.PluginError("webpack-dev-server", err);
        gutil.log("[webpack-dev-server]", 'http://'+host+':'+port+'/webpack-dev-server/index.html');
    });

    var gracefulShutdown = function() {
        process.exit()
    }

    // listen for INT signal e.g. Ctrl-C
    process.on('SIGINT', gracefulShutdown);
});

gulp.task('dist', ['clean', 'js:build', 'js:dist', 'sass'])
gulp.task('watch', ['sass:watch', 'js:watch', 'webpack-dev-server'])
gulp.task('dev', ['sass', 'js:build'])
gulp.task('default', ['watch', 'dev'])