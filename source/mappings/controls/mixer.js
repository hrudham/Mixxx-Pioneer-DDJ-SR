var ControlManager = require('./../../../control-manager.js');

var manager = new ControlManager();

manager.add('Master', 'crossfader', 0xB6, 0x1F, 'soft-takeover');

module.exports = manager;