var manager = require('./../../../../control-manager.js');

for (var channelIndex = 0; channelIndex < 4; channelIndex++) {
	for (var padIndex = 0; padIndex < 8; padIndex++) {
		manager.add(
			'Channel' + (channelIndex + 1),
			 'PioneerDDJSR.RollPerformancePad', 
			 0x97 + channelIndex,
			  0x10 + padIndex);
	}
}

module.exports = manager.controls;