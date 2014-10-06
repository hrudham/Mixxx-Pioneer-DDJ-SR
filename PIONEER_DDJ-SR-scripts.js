function PioneerDDJSR() { }

PioneerDDJSR.init = function(id)
{
	// Hook up the VU meters
	engine.connectControl('[Channel1]', 'VuMeter', 'PioneerDDJSR.vuMeter');
	engine.connectControl('[Channel2]', 'VuMeter', 'PioneerDDJSR.vuMeter');
	
	// Enable soft-taker on certain controls
	engine.softTakeover('[Channel1]', 'rate', true);
	engine.softTakeover('[Channel2]', 'rate', true);

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
PioneerDDJSR.vuMeter = function(value, group, control) 
{
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

// Work out the jog-wheel change / delta
PioneerDDJSR.getJogWheelDelta = function(value)
{
	// The Wheel control centers on 0x40; find out how much it's moved by.
	return value - 0x40;
}

// Toggle scratching for a channel
PioneerDDJSR.toggleScratch = function(channel, isEnabled)
{
	var deck = channel + 1; 
	if (isEnabled) 
	{
        engine.scratchEnable(
			deck, 
			PioneerDDJSR.settings.jogResolution, 
			PioneerDDJSR.settings.vinylSpeed, 
			PioneerDDJSR.settings.alpha, 
			PioneerDDJSR.settings.beta);
    }
    else 
	{
        engine.scratchDisable(deck);
    }
};

// Pitch bend a channel
PioneerDDJSR.pitchBend = function(channel, movement) 
{
	var deck = channel + 1; 
	var group = '[Channel' + deck +']';
	
	// Limit movement to the range of -3 to 3.
	movement = movement > 3 ? 3 : movement;
	movement = movement < -3 ? -3 : movement;
	
	engine.setValue(group, 'jog', movement);	
};

// Detect when the user touches and releases the jog-wheel while 
// jog-mode is set to vinyl to enable and disable scratching.
PioneerDDJSR.jogScratchTouch = function(channel, control, value, status) 
{
	PioneerDDJSR.toggleScratch(channel, value == 0x7F);
};
 
// Scratch or seek with the jog-wheel.
PioneerDDJSR.jogScratchTurn = function(channel, control, value, status) 
{
	var deck = channel + 1; 
	
    // Only scratch if we're in scratching mode, when 
	// user is touching the top of the jog-wheel.
    if (engine.isScratching(deck)) 
	{
		// The Wheel control centers on 0x40; find out how much it's moved by.
		engine.scratchTick(deck, PioneerDDJSR.getJogWheelDelta(value));
	}
};

// Called when the jog-mode is not set to vinyl, and the jog wheel is touched.
PioneerDDJSR.jogSeekTouch = function(channel, control, value, status) 
{
	var deck = channel + 1; 
	var group = '[Channel' + deck +']';
	
	if (!engine.getValue(group, 'play'))
	{
		// Scratch if we're not playing; otherwise we'll be pitch-bending.
		PioneerDDJSR.toggleScratch(channel, value == 0x7F);
	}
};

PioneerDDJSR.jogSeekTurn = function(channel, control, value, status) 
{
	var deck = channel + 1; 
	
	// Only scratch if we're in scratching mode, when user is touching 
	// the top of the jog-wheel and the 'Vinyl' Jog mode is selected.
    if (engine.isScratching(deck)) 
	{
		engine.scratchTick(deck, PioneerDDJSR.getJogWheelDelta(value));
	}
	else
	{
		PioneerDDJSR.pitchBend(channel, PioneerDDJSR.getJogWheelDelta(value));
	}
};

// Pitch bend using the jog-wheel.
PioneerDDJSR.jogPitchBend = function(channel, control, value, status) 
{
	var deck = channel + 1; 
	var group = '[Channel' + deck +']';

	// Only pitch-bend when actually playing
	if (engine.getValue(group, 'play'))
	{
		PioneerDDJSR.pitchBend(channel, PioneerDDJSR.getJogWheelDelta(value));
	}
};

// Handles the rotary selector for choosing tracks, library items, crates, etc.
PioneerDDJSR.RotarySelector = function(channel, control, value, status) 
{
	var isMovingDown = value === 0x01;
	if (isMovingDown)
	{
		engine.setValue('[Playlist]', 'SelectNextTrack', '1');
	}
	else
	{
		engine.setValue('[Playlist]', 'SelectPrevTrack', '1');
	}
};

PioneerDDJSR.shutdown = function()
{
	// Turn off the VU meter control connection
	engine.connectControl('[Channel1]', 'VuMeter', 'PioneerDDJSR.vuMeter', true);
	engine.connectControl('[Channel2]', 'VuMeter', 'PioneerDDJSR.vuMeter', true);
	
	// Reset the VU meters so that we're not left 
	// with it displaying when nothing is playing.
	PioneerDDJSR.vuMeter(0, '[Channel1]', 'VuMeter');
	PioneerDDJSR.vuMeter(0, '[Channel2]', 'VuMeter');
};

