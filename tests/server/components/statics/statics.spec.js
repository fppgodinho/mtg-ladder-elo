var sinon = require('sinon');

var Routes = require('./../../../../src/server/components/statics/routes');

describe('The Routes Class', function () {
	var sandbox;

	beforeEach(function () {
		sandbox = sinon.sandbox.create();
	});

	afterEach(function () {
		sandbox.restore();
	});

	it('Should exist', function () {
		Routes.should.exist;
	});

	describe('As an instance', function () {
		var instance, staticsPath, index, req, res;

		beforeEach(function () {
			staticsPath = 'statics';
			index = 'index.html';
			instance = new Routes(staticsPath, index);
			req = {
				baseUrl: 'test/lib/test',
				headers: {},
				connection: {},
				get: function () {}
			};
			res = {
				sendFile: function () {}
			};
		});

		afterEach(function () {
			instance = null;
		});

		it('Should invoke the "next" callback paramenter', function () {
			var spy = sandbox.spy();

			instance.logger(req, {}, spy);

			spy.should.have.been.calledOnce;
		});

		it('Should send the requested file', function () {
			var spy = sandbox.spy(res, 'sendFile');

			req.baseUrl = 'lib/something';
			instance.staticAssets(req, res);

			spy.should.have.been.calledWith(staticsPath + '/something');
		});

		it('Should send the requested file', function () {
			var spy = sandbox.spy(res, 'sendFile');

			instance.staticIndex(req, res);

			spy.should.have.been.calledWith(index);
		});
	});
});
