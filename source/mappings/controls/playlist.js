var ControlManager = require('./../../../control-manager.js');

var manager = new ControlManager();

manager.add('Playlist', 'PioneerDDJSR.RotarySelectorClick', 0x96, 0x41);
manager.add('Playlist', 'PioneerDDJSR.RotarySelector', 0xB6, 0x40);

module.exports = manager;