new (require('./server/static-assets'))(__dirname + '/server/public', 3000).connect();
new (require('./server/xmpp'))(3001).connect();
