var Constructor = function () {};

Constructor.createHandshake = function () {
	return '<open xmlns="urn:ietf:params:xml:ns:xmpp-framing" version="1.0" to="localhost"/>';
};

Constructor.createKeepAlive = function () {

};

Constructor.createRegister = function (username, password) {

};

Constructor.createLogin = function (username, password) {
	var token = new Buffer(username + '@localhost' + '\0' + username + '\0' + password).toString('base64');

	return '<auth xmlns="urn:ietf:params:xml:ns:xmpp-sasl" mechanism="PLAIN">' + token + '</auth>';
};

Constructor.createBind = function () {
	//<iq type="set" id="bind"><bind xmlns="urn:ietf:params:xml:ns:xmpp-bind"/></iq>
	//<iq type="result" id="bind"><bind xmlns="urn:ietf:params:xml:ns:xmpp-bind"><jid>user@localhost/c6c3736010474f5bc2d2104b7f827dee</jid></bind></iq>
	//<iq type="set" to="localhost" id="sess"><session xmlns="urn:ietf:params:xml:ns:xmpp-session"/></iq>
	//<iq type="result" id="sess"><session xmlns="urn:ietf:params:xml:ns:xmpp-session"/></iq>
	return '<iq type="set" id="bind"><bind xmlns="urn:ietf:params:xml:ns:xmpp-bind"><resource>' + 'client' + '</resource></bind></iq>';
};

Constructor.createSession = function () {
	//<iq type="set" id="bind"><bind xmlns="urn:ietf:params:xml:ns:xmpp-bind"/></iq>
	//<iq type="result" id="bind"><bind xmlns="urn:ietf:params:xml:ns:xmpp-bind"><jid>user@localhost/c6c3736010474f5bc2d2104b7f827dee</jid></bind></iq>
	//<iq type="set" to="localhost" id="sess"><session xmlns="urn:ietf:params:xml:ns:xmpp-session"/></iq>
	//<iq type="result" id="sess"><session xmlns="urn:ietf:params:xml:ns:xmpp-session"/></iq>
	return '<iq type="set" to="localhost" id="session"><session xmlns="urn:ietf:params:xml:ns:xmpp-session"/></iq>';
};

Constructor.createPresence = function () {
	//<iq type="set" id="bind"><bind xmlns="urn:ietf:params:xml:ns:xmpp-bind"/></iq>
	//<iq type="result" id="bind"><bind xmlns="urn:ietf:params:xml:ns:xmpp-bind"><jid>user@localhost/c6c3736010474f5bc2d2104b7f827dee</jid></bind></iq>
	//<iq type="set" to="localhost" id="sess"><session xmlns="urn:ietf:params:xml:ns:xmpp-session"/></iq>
	//<iq type="result" id="sess"><session xmlns="urn:ietf:params:xml:ns:xmpp-session"/></iq>
	return '<presence />';
};

Constructor.createProfileRequest = function (id) {
	//return '<message to="profile-manager@localhost" ><body>Hummmm</body></message>';
	return '<iq id="' + id + '" to="profile-manager@localhost" type="get"><query xmlns="urn:ietf:params:xml:ns:profile"/></iq>';
};

Constructor.createMessage = function (message) {

};

module.exports = Constructor;
