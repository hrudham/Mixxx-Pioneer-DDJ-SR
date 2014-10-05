function PioneerDDJSR() { }

PioneerDDJSR.init = function(id)
{
	this.getDeckNumber = function(baseAddress, status)
	{
		return status - baseAddress + 0x01;
	};
	
	// Hook up the 
	engine.connectControl("[Channel1]", "VuMeter", "PioneerDDJSR.vuMeter");
	engine.connectControl("[Channel2]", "VuMeter", "PioneerDDJSR.vuMeter");

	var alpha = 1.0 / 8;
	this.settings = 
		{
			alpha: alpha,
			beta: alpha / 32,
			jogResolution: 720,
			vinylSpeed: 33 + 1/3
		};
}

// Set the VU meter levels.
PioneerDDJSR.vuMeter = function (value, group, control) 
{
	print('value: ' + value + '| group: ' + group + '| control: ' + control);

	// VU meter range is 0 to 127 (or 0x7F).
	var level = parseInt(value * 0x7F);
	
	var channel = null;
	switch (group)
	{
		case '[Channel1]': 
			channel = 0xB0;
			break;
		case '[Channel2]': 
			channel = 0xB1;
			break;
	}
	
	midi.sendShortMsg(channel, 0x02, level);
}

// The button that enables/disables scratching
PioneerDDJSR.wheelTouch = function (channel, control, value, status) 
{
	var deck = PioneerDDJSR.getDeckNumber(0x90, status);

    if (value == 0x7F) 
	{    
		// If button down
        var alpha = 1.0 / 8;
        var beta = alpha / 32;
        engine.scratchEnable(
			deck, 
			PioneerDDJSR.settings.jogResolution, 
			PioneerDDJSR.settings.vinylSpeed, 
			PioneerDDJSR.settings.alpha, 
			PioneerDDJSR.settings.beta);
    }
    else 
	{    
		// If button up
        engine.scratchDisable(deck);
    }
};
 
// The wheel that actually controls the scratching
PioneerDDJSR.wheelTurn = function (channel, control, value, status) 
{
	var deck = PioneerDDJSR.getDeckNumber(0xB0, status);

    // See if we're scratching. If not, skip this.
    if (!engine.isScratching(deck)) 
	{
		return;
	}
	
    // The Wheel control centers on 0x40 (64); register it's movement.
    engine.scratchTick(deck, value - 64);
};

PioneerDDJSR.shutdown = function(id)
{
	// Turn off the VU meter control connection
	engine.connectControl("[Channel1]", "VuMeter", "PioneerDDJSR.vuMeter", true);
	engine.connectControl("[Channel2]", "VuMeter", "PioneerDDJSR.vuMeter", true);
	
	// Reset the VU meters so that we're not left 
	// with it displaying when nothing is playing.
	PioneerDDJSR.vuMeter(0, "[Channel1]", "VuMeter");
	PioneerDDJSR.vuMeter(0, "[Channel2]", "VuMeter");
};

