var manager = require('./../../../control-manager.js');

// Generate mappings for four channels.
for (var channelIndex = 0; channelIndex < 4; channelIndex++)
{
	var group = 'Channel' + (channelIndex + 1);

	manager.add(group, 'play', 0x90 + channelIndex, 0x0B);
	manager.add(group, 'pfl', 0x90 + channelIndex, 0x54);
	manager.add(group, 'keylock', 0x90 + channelIndex, 0x1A);
	manager.add(group, 'beatsync', 0x90 + channelIndex, 0x58);
	manager.add(group, 'cue_default', 0x90 + channelIndex, 0x0C);		
	manager.add(group, 'LoadSelectedTrack', 0x96, 0x46 + channelIndex);	
	manager.add(group, 'pregain', 0xB0 + channelIndex, 0x04, 'soft-takeover');
	manager.add(group, 'rate', 0xB0 + channelIndex, 0x00, 'soft-takeover');
	manager.add(group, 'volume', 0xB0 + channelIndex, 0x13, 'soft-takeover');

	// EQ 
	manager.add(group, 'filterHigh', 0xB0 + channelIndex, 0x07, 'soft-takeover')
	manager.add(group, 'filterMid', 0xB0 + channelIndex, 0x0B, 'soft-takeover');
	manager.add(group, 'filterLow', 0xB0 + channelIndex, 0x0F, 'soft-takeover');

	// Low-pass / high-pass filters
	manager.add(group, 'PioneerDDJSR.LpfHpfToggle', 0x96, 0x74 + channelIndex);
	manager.add(group, 'PioneerDDJSR.filterKnobLSB', 0xB6, 0x17 + channelIndex);
	manager.add(group, 'PioneerDDJSR.filterKnobMSB', 0xB6, 0x37 + channelIndex);
}

module.exports = manager.controls;