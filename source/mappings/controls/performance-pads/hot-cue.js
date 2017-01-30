var ControlManager = require('./../../../../control-manager.js');

var manager = new ControlManager();

for (var channelIndex = 0; channelIndex < 4; channelIndex++) {
	var group = 'Channel' + (channelIndex + 1);
	
	for (var padIndex = 0; padIndex < 8; padIndex++) {
		var activateKey = 'hotcue_' + (padIndex + 1) + '_activate';
		var clearKey = 'hotcue_' + (padIndex + 1) + '_clear';
		manager.add(group, activateKey, 0x97 + channelIndex, 0x00 + padIndex);
		manager.add(group, clearKey, 0x97 + channelIndex, 0x08 + padIndex);
	}
}

module.exports = manager;
