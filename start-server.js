new (require('./src/server/controllers/statics-controller'))(__dirname + '/statics', 3000).connect();
new (require('./src/server/controllers/xmpp-controller'))('localhost', 3001, function() {}).connect();
