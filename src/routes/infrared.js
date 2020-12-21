const Router = require('express').Router;
const representNumber = require('../helpers/represent-number');
const sendIRCommand = require('../helpers/send-ir-command');
const generateNECString = require('../helpers/generate-nec-string');

const app = new Router();

const commands = {
	'panasonic': {
		'onoff': 0x123
	}
};

app.get('/nec/:address/:command', (req, res) => {
	const address = parseInt(req.params.address);
	const command = parseInt(req.params.command);
	console.log(address);
	if (isNaN(address)) {
		return res
			.status(400)
			.json({
				status: 400,
				error: `Address ${req.params.address} not a number`
			});
	} else if (isNaN(command)) {
		return res
			.status(400)
			.json({
				status: 400,
				error: `Command ${req.params.command} not a number`,
				address: representNumber(address),
			});
	}

	const necString = generateNECString(address, command);

	sendIRCommand(necString);

	res.json({
		status: 200,
		standard: 'nec',
		address: representNumber(address),
		command: representNumber(command),
		message: necString
	});
});

app.get('/device/:device/:command', (req, res) => {
	const deviceName = String(req.params.device).toLowerCase();
	const commandName = String(req.params.command).toLowerCase();

	if (!(deviceName in commands)) {
		return res
			.status(404)
			.json({
				status: 404,
				error: `Device ${deviceName} not found`,
				device: deviceName,
				command: commandName
			});
	}

	const device = commands[deviceName];

	if (!(commandName in device)) {
		return res
			.status(404)
			.json({
				status: 404,
				error: `Command ${commandName} not found`,
				device: deviceName,
				command: commandName
			});
	}

	const message = `C|${device[commandName].toString(16)}`;

	res.json({
		status: 200,
		device: deviceName,
		command: commandName,
		command_value: representNumber(device[commandName]),
		message
	});
});

module.exports = app;
