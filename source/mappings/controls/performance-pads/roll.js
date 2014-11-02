var manager = require('./../../../../control-manager.js');

for (var channelIndex = 0; channelIndex < 4; channelIndex++)
{
	var group = 'Channel' + (channelIndex + 1);

	for (var padIndex = 0; padIndex < 8; padIndex++)
	{
		manager.add(group, 'PioneerDDJSR.RollPerformancePad', 0x97 + channelIndex, 0x10 + padIndex);
	}
}

module.exports = manager.controls;