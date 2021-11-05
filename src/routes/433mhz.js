const Router = require('express').Router;

const { queueTransmission } = require('../helpers/433mhz-queue');
const generateIntertechnoCode = require('../helpers/generate-intertechno-code');

const app = new Router();

app.get('/:code/:state', function (req, res) {
	const dryRun = !!req.query.dry;
	const state = String(req.params.state).toLowerCase() === 'on';
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
		queueTransmission(code);
	}

	res.json({
		dryRun,
		code,
		state
	});
});

module.exports = app;