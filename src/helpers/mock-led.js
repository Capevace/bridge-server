const chalk = require('chalk');
const readline = require('readline');

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = function mockLED(rgb) {
	return {
		setRGB(r, g, b) {
			logColor(r,g,b, rgb.mode);
		}
	}
}

const clear = true;
function logColor(r, g, b, mode) {
    // readline.clearLine(process.stdout);
    const text = chalk.rgb(r, g, b)('██████████ ') + mode;

    if (clear) {
    	readline.clearLine(process.stdout);
    	readline.cursorTo(process.stdout, 0);
    	process.stdout.write(text);
    } else {
    	console.log(text);
    }
}