new (require('./src/server/main'))({
	statics: {
		path: __dirname + '/statics/',
		port: process.argv[2] || 3000
	},
	xmpp: {
		host: 'localhost',
		port: process.argv[3] || 3001
	}
});
