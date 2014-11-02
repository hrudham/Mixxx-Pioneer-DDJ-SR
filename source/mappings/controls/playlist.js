var manager = require('./../../../control-manager.js');

manager.add('Playlist', 'PioneerDDJSR.RotarySelectorClick', 0x96, 0x41);
manager.add('Playlist', 'PioneerDDJSR.RotarySelector', 0xB6, 0x40);

module.exports = manager.controls;