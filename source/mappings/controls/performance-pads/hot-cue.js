var manager = require('./../../../../control-manager.js');

for (var i = 0; i < 4; i++)
{
	var group = 'Channel' + (i + 1);
	
	manager.add(group, 'hotcue_1_activate', 0x97 + i, 0x00);
	manager.add(group, 'hotcue_2_activate', 0x97 + i, 0x01);
	manager.add(group, 'hotcue_3_activate', 0x97 + i, 0x02);
	manager.add(group, 'hotcue_4_activate', 0x97 + i, 0x03);
	manager.add(group, 'hotcue_5_activate', 0x97 + i, 0x04);
	manager.add(group, 'hotcue_6_activate', 0x97 + i, 0x05);
	manager.add(group, 'hotcue_7_activate', 0x97 + i, 0x06);
	manager.add(group, 'hotcue_8_activate', 0x97 + i, 0x07);

	manager.add(group, 'hotcue_1_clear', 0x97 + i, 0x08);
	manager.add(group, 'hotcue_2_clear', 0x97 + i, 0x09);
	manager.add(group, 'hotcue_3_clear', 0x97 + i, 0x0A);
	manager.add(group, 'hotcue_4_clear', 0x97 + i, 0x0B);
	manager.add(group, 'hotcue_5_clear', 0x97 + i, 0x0C);
	manager.add(group, 'hotcue_6_clear', 0x97 + i, 0x0D);
	manager.add(group, 'hotcue_7_clear', 0x97 + i, 0x0E);
	manager.add(group, 'hotcue_8_clear', 0x97 + i, 0x0F);
}

module.exports = manager.controls;
