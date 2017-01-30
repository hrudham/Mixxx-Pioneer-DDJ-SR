var ControlManager = require('./../../../control-manager.js');

var manager = new ControlManager();

// Left effect bank
manager.add('EffectRack1_EffectUnit1', 'PioneerDDJSR.FxSelect', 0x94, 0x47);
manager.add('EffectRack1_EffectUnit2', 'PioneerDDJSR.FxSelect', 0x94, 0x48);

// Right effect bank
manager.add('EffectRack1_EffectUnit3', 'PioneerDDJSR.FxSelect', 0x95, 0x47);
manager.add('EffectRack1_EffectUnit4', 'PioneerDDJSR.FxSelect', 0x95, 0x48);

module.exports = manager;