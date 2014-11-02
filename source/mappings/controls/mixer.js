var manager = require('./../../../control-manager.js');

manager.add('Master', 'crossfader', 0xB6, 0x1F, 'soft-takeover');

module.exports = manager.controls;