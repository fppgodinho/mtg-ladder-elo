var coverage = require('browserify-istanbul');

module.exports = function (config) {
	config.set({
		basePath: '',
		frameworks: ['browserify', 'mocha'],
		files: [
			'./client/index.js',
			'./tests/client/**/*.spec.js'
		],
		exclude: [],
		preprocessors: {
			'./client/index.js': ['browserify'],
			'./tests/client/**/*.js': ['browserify']
		},
		browserify: {
			debug: true,
			transform: [
				'brfs', coverage({ignore: ['**/*.spec.js']})
			]
		},
		'browserify-css': {
			autoInject: true,
			minify: true,
			rootDir: "."
		},
		reporters: ['progress', 'coverage'],
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: true,
		browsers: ['PhantomJS'],
		singleRun: true,
		concurrency: Infinity
	})
};
