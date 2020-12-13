const express = require('express');
const app = express();

const PORT = 4001;

app.use('/433mhz', require('./routes/433mhz'));
app.use('/infrared', require('./routes/intertechno'));

app.listen(PORT, function () {
	console.log(`Mission Control Bridge Server listening on port ${PORT}!`);
});
