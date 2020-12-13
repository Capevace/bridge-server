const Router = require('express').Router;
const transmitCode = require('433mhz');

const generateIntertechnoCode = require('../helpers/generate-intertechno-code');

const app = new Router();

app.get('/:code/:state', function (req, res) {
	const dryRun = !!req.query.dry;
	const state = req.params.state === 'on';
	const code = generateIntertechnoCode(String(req.params.code), state);

	// Check for code present or error out
	if (!code) {
		return res
			.status(400)
			.json({
				error: 'You need to pass a valid code.'
			});
	}

	console.log(`[Dispatch] Setting switch ${code} to: ${state ? 'On' : 'Off'}`);

	if (!dryRun) {
		transmitCode(code);
	}

	res.json({
		dryRun,
		code,
		state
	});
});

module.exports = app;