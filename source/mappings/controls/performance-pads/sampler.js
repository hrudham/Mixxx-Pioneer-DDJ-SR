var manager = require('./../../../../control-manager.js');

// Iterate through channels
for (var channelIndex = 0; channelIndex < 4; channelIndex++)
{
	// Iterate though samplers
	for (var padIndex = 0; padIndex < 6; padIndex++)
	{
		var group = 'Sampler' + (padIndex + 1);
		manager.add(group, 'start_play', 0x97 + channelIndex, 0x30 + padIndex);
	}	
}

module.exports = manager.controls;