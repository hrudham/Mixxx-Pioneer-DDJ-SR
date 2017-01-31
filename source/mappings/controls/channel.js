var ControlManager = require('./../../../control-manager.js');

var manager = new ControlManager();

// Generate mappings for four channels.
for (var channelIndex = 0; channelIndex < 4; channelIndex++) {
	var group = 'Channel' + (channelIndex + 1);

	manager.add(group, 'play', 0x90 + channelIndex, 0x0B);
	manager.add(group, 'pfl', 0x90 + channelIndex, 0x54);
	manager.add(group, 'beatsync', 0x90 + channelIndex, 0x58);
	manager.add(group, 'cue_default', 0x90 + channelIndex, 0x0C);		
	manager.add(group, 'LoadSelectedTrack', 0x96, 0x46 + channelIndex);	
	manager.add(group, 'pregain', 0xB0 + channelIndex, 0x04, 'soft-takeover');
	manager.add(group, 'volume', 0xB0 + channelIndex, 0x13, 'soft-takeover');

	// Rate / Tempo	
	manager.add(group, 'keylock', 0x90 + channelIndex, 0x1A);
	manager.add(group, 'PioneerDDJSR.TempoMsb', 0xB0 + channelIndex, 0x00);
	manager.add(group, 'PioneerDDJSR.TempoLsb', 0xB0 + channelIndex, 0x20);

	// EQ knobs
	manager.add(group, 'filterHigh', 0xB0 + channelIndex, 0x07, 'soft-takeover')
	manager.add(group, 'filterMid', 0xB0 + channelIndex, 0x0B, 'soft-takeover');
	manager.add(group, 'filterLow', 0xB0 + channelIndex, 0x0F, 'soft-takeover');

	// Low-pass / high-pass combo filters
	manager.add(group, 'PioneerDDJSR.LpfHpfToggle', 0x96, 0x74 + channelIndex);
	manager.add(group, 'PioneerDDJSR.FilterKnobLsb', 0xB6, 0x37 + channelIndex);
	manager.add(group, 'PioneerDDJSR.FilterKnobMsb', 0xB6, 0x17 + channelIndex);
}

module.exports = manager;