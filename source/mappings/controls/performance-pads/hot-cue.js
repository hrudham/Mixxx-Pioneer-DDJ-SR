var manager = require('./../../../../control-manager.js');

for (var i = 0; i < 4; i++)
{
	var group = 'Channel' + (i + 1);
	
	for (var j = 0; j < 8; j++)
	{
		var activateKey = 'hotcue_' + (i + 1) + '_activate';
		var clearKey = 'hotcue_' + (i + 1) + '_clear';
		manager.add(group, activateKey, 0x97 + i, 0x00 + j);
		manager.add(group, clearKey, 0x97 + i, 0x08 + j);
	}
}

module.exports = manager.controls;
