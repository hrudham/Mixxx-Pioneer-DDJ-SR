var manager = require('./../../../../control-manager.js');

for (var i = 0; i < 4; i++)
{
	var group = 'Channel' + (i + 1);

	manager.add(group, 'PioneerDDJSR.RollPerformancePad', 0x97, 0x10);
	manager.add(group, 'PioneerDDJSR.RollPerformancePad', 0x97, 0x11);
	manager.add(group, 'PioneerDDJSR.RollPerformancePad', 0x97, 0x12);
	manager.add(group, 'PioneerDDJSR.RollPerformancePad', 0x97, 0x13);
	manager.add(group, 'PioneerDDJSR.RollPerformancePad', 0x97, 0x14);
	manager.add(group, 'PioneerDDJSR.RollPerformancePad', 0x97, 0x15);
	manager.add(group, 'PioneerDDJSR.RollPerformancePad', 0x97, 0x16);
	manager.add(group, 'PioneerDDJSR.RollPerformancePad', 0x97, 0x17);	 
}

module.exports = manager.controls;