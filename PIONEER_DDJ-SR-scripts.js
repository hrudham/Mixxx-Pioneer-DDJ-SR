function PioneerDDJSR() { }

PioneerDDJSR.init = function(id)
{
	this.getDeckNumber = function(baseAddress, status)
	{
		return status - baseAddress + 0x01;
	};
	
	var alpha = 1.0 / 8;
	this.settings = 
		{
			alpha: alpha,
			beta: alpha / 32,
			jogResolution: 720,
			vinylSpeed: 33 + 1/3
		};
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
};

