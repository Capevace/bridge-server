const Net = require('net');

const HOST = process.env.IR_HOST;
const PORT = process.env.IR_PORT;
const IR_ENABLED = HOST && PORT;

const client = new Net.Socket();

let buffer = [];

client.on('connect', () => {
	console.log('[IR TCP] Connected to device');
});

client.on('ready', () => {
	console.log(`[IR TCP] Device ready, ${buffer.length} commands buffered`);

	while (buffer.length > 0) {
		sendIRCommand(buffer.shift());
	}
});

client.on('close', () => {
	console.log('[IR TCP] Connection closed, trying again in 2s...');

	setTimeout(connectToDevice, 2000);
});

client.on('error', (e) => {
	console.log('[IR TCP] Connection error, trying again in 2s...', e);

	setTimeout(connectToDevice, 2000);
});

client.on('data', data => {
	console.log('[IR TCP] Data:\n' + data.toString());	
});

function connectToDevice() {
	console.log('[IR TCP] Connecting to host', HOST, 'on', PORT);
	client.connect(PORT, HOST);
	client.setKeepAlive(true, 1000)
}

if (IR_ENABLED)
	connectToDevice();

/**
 *	Sends a String to an Arduino using a simple TCP connection.
 */
function sendIRCommand(string) {
	if (client.readyState !== 'open' && client.readyState !== 'writeOnly') {
		console.log('[IR TCP] Buffering command:', string);
		buffer.push(string);
	} else {
		console.log('[IR TCP] Sending command:', string);
		client.write(`${string}\n`);
	}
}

module.exports = sendIRCommand;