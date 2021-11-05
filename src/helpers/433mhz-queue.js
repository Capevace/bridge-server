const transmitCode = require('433mhz');

let queue = [];
let transmitting = false;

module.exports.queueTransmission = function queueTransmission(code) {
	if (transmitting) {
		queue.push(code);
	} else {
		transmitting = true;

		while(queue.length !== 0) {
			transmitCode(queue.shift());
		}

		transmitting = false;
	}
};