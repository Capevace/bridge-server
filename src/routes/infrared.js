const Router = require('express').Router;

const app = new Router();

const commands = {
	'device': {
		'command': 0x123
	}
}

app.get('/:device/:command', (req, res) => {

});

module.exports = app;
