var manager = require('./../../../control-manager.js');

// Generate mappings for four channels.
for (var i = 0; i < 4; i++)
{
	var group = 'Channel' + (i + 1);

	manager.add(group, 'play', 0x90 + i, 0x0B);
	manager.add(group, 'pfl', 0x90 + i, 0x54);
	manager.add(group, 'keylock', 0x90 + i, 0x1A);
	manager.add(group, 'beatsync', 0x90 + i, 0x58);
	manager.add(group, 'cue_default', 0x90 + i, 0x0C);	
	
	
	// TODO: Fix this.
	manager.add(group, 'LoadSelectedTrack', 0x96, 0x46 + i);
	
	manager.add(group, 'pregain', 0xB0 + i, 0x04, 'soft-takeover');
	manager.add(group, 'filterHigh', 0xB0 + i, 0x07, 'soft-takeover')
	manager.add(group, 'filterMid', 0xB0 + i, 0x0B, 'soft-takeover');
	manager.add(group, 'filterLow', 0xB0 + i, 0x0F, 'soft-takeover');
	manager.add(group, 'rate', 0xB0 + i, 0x00, 'soft-takeover');
	manager.add(group, 'volume', 0xB0 + i, 0x13, 'soft-takeover');
}

module.exports = manager.controls;