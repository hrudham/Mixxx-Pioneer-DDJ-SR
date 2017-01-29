var manager = require('./../../../control-manager.js');

// Generate mappings for four channels.
for (var channelIndex = 0; channelIndex < 4; channelIndex++) {
	var group = 'Channel' + (channelIndex + 1);

	manager.add(group, 'PioneerDDJSR.jogScratchTouch', 0x90 + channelIndex, 0x36);
	manager.add(group, 'PioneerDDJSR.jogSeekTouch',	0x90 + channelIndex, 0x35);
	manager.add(group, 'PioneerDDJSR.jogScratchTurn', 0xB0 + channelIndex, 0x22);
	manager.add(group, 'PioneerDDJSR.jogPitchBend', 0xB0 + channelIndex, 0x21);
	manager.add(group, 'PioneerDDJSR.jogSeekTurn', 0xB0 + channelIndex, 0x23);
}
			 
module.exports = manager.controls;