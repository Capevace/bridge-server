const getIntertechnoCode = require('./intertechno');
const transmitCode = require('433mhz');

const express = require('express');
const app = express();

const PORT = 4001;

app.get('/433mhz/:code/:state', function (req, res) {
	const dryRun = !!req.query.dry;
	const state = req.params.state === 'on';
	const code = getIntertechnoCode(String(req.params.code), state);

	// Check for code present or error out
        if (!code) {
                res
                        .status(400)
                        .json({
                                error: 'You need to pass a valid code.'
                        });
                return;
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

app.listen(PORT, function () {
	console.log(`Example app listening on port ${PORT}!`);
});
