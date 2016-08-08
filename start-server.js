new (require('./src/server/main'))({
	statics: {
		path: __dirname + '/statics',
		port: 3000
	},
	xmpp: {
		host: 'localhost',
		poert: 3001
	}
});
