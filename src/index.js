const express = require('express');
const app = express();

const PORT = 4001;

const createBLERouter = require('./routes/ble');

app.use('/433mhz', require('./routes/433mhz'));
app.use('/infrared', require('./routes/infrared'));

const ledStrip = createBLERouter('72:16:03:00:D4:61');
app.use('/qhm-d461', ledStrip);
app.use('/ble', ledStrip);
app.use('/', require('./routes/docs'));

app.listen(PORT, function () {
	console.log(`[HTTP] Bridge Server listening on port ${PORT}`);
});
