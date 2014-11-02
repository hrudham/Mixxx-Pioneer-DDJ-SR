var manager = require('./../../../../control-manager.js');

for (var i = 0; i < 4; i++)
{
	var group = 'Channel' + (i + 1);

	for (var j = 0; j < 8; j++)
	{
		manager.add(group, 'PioneerDDJSR.RollPerformancePad', 0x97 + i, 0x10 + j);
	}
}

module.exports = manager.controls;