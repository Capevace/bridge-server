const Router = require('express').Router;
const { RGBLEDDriver } = require('ble-led-driver');
// const transmitCode = require('433mhz');

// const generateIntertechnoCode = require('../helpers/generate-intertechno-code');

module.exports = function createBLERouter(mac) {
	const app = new Router();
	const rgb = new RGBLEDDriver(mac);

	rgb.connect()
		.catch(console.error);

	app.get('/rgb/:r/:g/:b', function (req, res) {
		const parse = x => Math.max(0, Math.min(255, parseInt(x))) || 0;
		const r = parse(req.params.r);
		const g = parse(req.params.g);
		const b = parse(req.params.b);

		rgb
			.setMode('solid')
			.setColor(r, g, b, 'rgb');
	});

	app.get('/mode/rainbow', function (req, res) {
		const parse = x => Math.max(0.0, Math.min(255.0, parseFloat(x))) || 0.0;
		const speed = req.query.speed
			? parse(req.query.speed)
			: null;

		rgb.setMode('rainbow');

		if (speed)
			rgb.setSpeed(speed);
	});

	app.get('/mode/random', function (req, res) {
		const parse = x => Math.max(0.0, parseFloat(x)) || 0.0;
		const speed = req.query.speed
			? parse(req.query.speed)
			: null;

		rgb.setMode('random');

		if (speed)
			rgb.setSpeed(speed);
	});

	return app;
};
