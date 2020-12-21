module.exports = function generateNECString(address, command) {
	return `N|${address.toString(16)}|${command.toString(16)}`;
}