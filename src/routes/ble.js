const Router = require('express').Router;
const { RGBLEDDriver } = require('ble-led-driver');
const mockLED = require('../helpers/mock-led');
// const transmitCode = require('433mhz');

// const generateIntertechnoCode = require('../helpers/generate-intertechno-code');

module.exports = function createBLERouter(mac) {
	const app = new Router();
	const rgb = new RGBLEDDriver(mac);

	// In debug mode we print a color box to stdout
	// instead of connecting to the BLE LED
	if (Array.from(process.argv).includes('--debug')) {
		// Mocked connect
		rgb.led = mockLED(rgb);
		rgb.setTickSpeed(rgb.tickSpeed);
	} else {
		rgb.connect()
			.catch(console.error.bind(console));
	}

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

	app.get('/status', function (req, res) {
		res.send(rgb.currentMode.type === 'blackout' ? '0' : '1');
	});

	app.get('/status', function (req, res) {
		res.send(rgb.currentMode.type === 'blackout' ? '0' : '1');
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

	app.get('/hue', function (req, res) {
		const mode = rgb.currentMode;
		const hue = mode.hueColor
			? mode.hueColor[0]
			: mode.chroma(...mode.color, 'rgb').hsl()[0];

		res.send(String(hue));
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

	app.get('/saturation', function (req, res) {
		const mode = rgb.currentMode;
		const saturation = mode.hueColor
			? mode.hueColor[1]
			: mode.chroma(...mode.color, 'rgb').hsl()[1];

		res.send(String(saturation * 100));
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

	app.get('/brightness', function (req, res) {
		const mode = rgb.currentMode;
		const brightness = mode.hueColor
			? mode.hueColor[2]
			: mode.chroma(...mode.color, 'rgb').hsl()[2];

		res.send(String(brightness * 100));
	});

	app.get('/mode', function (req, res) {
		res.json({
			mode: rgb.currentMode.type
		});
	});

	app.get('/mode/:mode/status', function (req, res) {
		res.send(rgb.currentMode.type === req.params.mode ? '1' : '0');
	});

	// Turn on solid mode, without setting a color (inherit previous)
	app.get('/mode/solid', function (req, res) {
		rgb.setMode('solid');

		res.json({
			status: 200,
			mode: 'solid'
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

	let notificationTimeout = null;

	app.all('/mode/notification', function (req, res) {
		const duration = 1000;
		let oldMode = rgb.currentMode;

		if (notificationTimeout) {
			// We still have a notification displaying
			// Count this as "all good" cause we don't need to display two right away
			return res
				.status(202)
				.json({
					status: 202,
					mode: 'notification',
					duration: 1,
				});
		}
		
		rgb.setMode('notification')
			.setDuration(duration);

		notificationTimeout = setTimeout(() => {
			rgb.setMode(oldMode.type);

			notificationTimeout = null;
		}, duration);

		res.json({
			status: 200,
			mode: 'notification',
			duration: duration
		});
	});

	return app;
};
