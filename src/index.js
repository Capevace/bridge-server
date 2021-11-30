#!/usr/bin/env node

try {
	const path = require('path');
	const express = require('express');
	const app = express();

	const PORT = process.env.PORT || 4001;

	const createBLERouter = require('./routes/ble');

	app.use((req, res, next) => {
		console.log(new Date().toISOString(), req.method, req.url, res.statusCode);
		next();
	});

	app.use('/433mhz', require('./routes/433mhz'));
	app.use('/infrared', require('./routes/infrared'));

	const ledStrip = createBLERouter('72:16:03:00:D4:61');
	app.use('/qhm-d461', ledStrip);
	app.use('/ble', ledStrip);
	app.use('/resources', express.static(path.resolve(__dirname, '../resources')));
	app.use('/', require('./routes/docs'));

	app.listen(PORT, function () {
		console.log(`[HTTP] Bridge Server listening on port ${PORT}`);
		console.log('DEBUG: ' + process.env.DEBUG);
	});

} catch (e) {
	console.error(e);
}