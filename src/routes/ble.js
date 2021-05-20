const Router = require('express').Router;
const { RGBLEDDriver } = require('ble-led-driver');
// const transmitCode = require('433mhz');

// const generateIntertechnoCode = require('../helpers/generate-intertechno-code');

module.exports = function createBLERouter(mac) {
	const app = new Router();
	const rgb = new RGBLEDDriver(mac);

	rgb.connect()
		.catch(console.error);

	app.all('/on', function (req, res) {
		rgb.setMode('solid');

		res.json({
			status: 200,
			mode: 'solid',
			rgb: rgb.currentMode.color
		});
	});

	app.all('/off', function (req, res) {
		rgb.setMode('blackout');

		res.json({
			status: 200,
			mode: 'solid',
			rgb: rgb.currentMode.color
		});
	});

	app.all('/rgb/:r/:g/:b', function (req, res) {
		const parse = x => Math.max(0, Math.min(255, parseInt(x))) || 0;
		const r = parse(req.params.r);
		const g = parse(req.params.g);
		const b = parse(req.params.b);

		rgb
			.setMode('solid')
			.setColor(r, g, b, 'rgb');

		res.json({
			status: 200,
			mode: 'solid',
			rgb: [r, g, b]
		});
	});

	app.all('/hue/:hue', function (req, res) {
		const parse = x => Math.max(0.0, Math.min(360.0, parseFloat(x))) || 0.0;
		const hue = parse(req.params.hue);

		rgb
			.setMode('solid')
			.setHue(hue);

		res.json({
			status: 200,
			mode: 'solid',
			rgb: rgb.currentMode.color
		});
	});

	app.all('/saturation/:saturation', function (req, res) {
		// :saturation is in percent
		const parse = x => Math.max(0.0, Math.min(100, parseFloat(x))) || 0.0;
		const saturation = parse(req.params.saturation);

		rgb
			.setMode('solid')
			.setSaturation(saturation / 100);

		res.json({
			status: 200,
			mode: 'solid',
			rgb: rgb.currentMode.color
		});
	});

	app.all('/brightness/:brightness', function (req, res) {
		// :brightness is in percent
		const parse = x => Math.max(0.0, Math.min(100, parseFloat(x))) || 0.0;
		const brightness = parse(req.params.brightness);

		rgb
			.setMode('solid')
			.setBrightness(brightness / 100);

		res.json({
			status: 200,
			mode: 'solid',
			rgb: rgb.currentMode.color
		});
	});

	app.all('/mode/rainbow', function (req, res) {
		const parse = x => Math.max(0.0, Math.min(255.0, parseFloat(x))) || 0.0;
		const speed = req.query.speed
			? parse(req.query.speed)
			: null;

		rgb.setMode('rainbow');

		if (speed)
			rgb.currentMode.setSpeed(speed);

		res.json({
			status: 200,
			mode: 'rainbow',
			speed: rgb.currentMode.speed
		});
	});

	app.all('/mode/random', function (req, res) {
		const parse = x => Math.max(0.0, parseFloat(x)) || 0.0;
		const speed = req.query.speed
			? parse(req.query.speed)
			: null;

		rgb.setMode('random');

		if (speed)
			rgb.currentMode.setSpeed(speed);

		res.json({
			status: 200,
			mode: 'random',
			speed: rgb.currentMode.speed
		});
	});

	return app;
};
