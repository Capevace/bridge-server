module.exports = function representNumber(value) {
	return {
		decimal: value,
		hex: `0x${value.toString(16).toUpperCase()}`
	};
}