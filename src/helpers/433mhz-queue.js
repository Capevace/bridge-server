const transmitCode = require('433mhz');

let queue = [];
let transmitting = false;

module.exports.queueTransmission = function queueTransmission(code) {
	console.log('[433MHz] Queueing', code);
	queue.push(code);

	if (!transmitting) {
		transmitting = true;

		while(queue.length !== 0) {
			const queuedCode = queue.shift();
			console.log('[433MHz] Transmitting', queuedCode);
			// transmitCode(queuedCode);
		}

		transmitting = false;
	}
};