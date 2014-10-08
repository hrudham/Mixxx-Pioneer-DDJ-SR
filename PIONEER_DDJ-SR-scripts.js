var PioneerDDJSR = function() { }

PioneerDDJSR.init = function(id)
{
	PioneerDDJSR.BindControlConnections(false);
	
	var alpha = 1.0 / 8;
	
	this.settings = 
		{
			alpha: alpha,
			beta: alpha / 32,
			jogResolution: 720,
			vinylSpeed: 33 + 1/3
		};
		
	this.enumerations = 
		{
			rotarySelector:
				{
					targets:
						{
							libraries: 0,
							tracklist: 1
						}
				}
		};
		
	this.status = 
		{
			rotarySelector: 
				{
					target: this.enumerations.rotarySelector.targets.tracklist
				}
		};
}

PioneerDDJSR.BindControlConnections = function(isUnbinding)
{
	for (var channelIndex = 1; channelIndex <= 4; channelIndex++)
	{
		// Hook up the VU meters
		var channelGroup = '[Channel' + channelIndex + ']';
		engine.connectControl(channelGroup, 'VuMeter', 'PioneerDDJSR.vuMeter', isUnbinding);
		
		// Hook up the hot cue performance pads
		for (var i = 0; i < 8; i++)
		{
			engine.connectControl(channelGroup, 'hotcue_' + (i + 1) +'_enabled', 'PioneerDDJSR.HotCuePerformancePadLed', isUnbinding);
		}
	}
};

PioneerDDJSR.HotCuePerformancePadLed = function(value, group, control) 
{
	var channel = null;
	switch (group)
	{
		case '[Channel1]': 
			channel = 0x00;
			break;
		case '[Channel2]': 
			channel = 0x01;
			break;
		case '[Channel3]': 
			channel = 0x02;
			break;
		case '[Channel4]': 
			channel = 0x03;
			break;
	}
	
	var padIndex = null;
	switch (control)
	{
		case 'hotcue_1_enabled':
			padIndex = 0;
			break;
		case 'hotcue_2_enabled':
			padIndex = 1;
			break;
		case 'hotcue_3_enabled':
			padIndex = 2;
			break;
		case 'hotcue_4_enabled':
			padIndex = 3;
			break;
		case 'hotcue_5_enabled':
			padIndex = 4;
			break;
		case 'hotcue_6_enabled':
			padIndex = 5;
			break;
		case 'hotcue_7_enabled':
			padIndex = 6;
			break;
		case 'hotcue_8_enabled':
			padIndex = 7;
			break;		
	}
	
	// Pad LED without shift key
	midi.sendShortMsg(0x97 + channel, 0x00 + padIndex, value ? 0x7F : 0x00);
	
	// Pad LED with shift key
	midi.sendShortMsg(0x97 + channel, 0x00 + padIndex + 0x08, value ? 0x7F : 0x00);
};

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
	var delta = 0x40 - Math.abs(0x40 - value);
	var isCounterClockwise = value > 0x40;
	if (isCounterClockwise)
	{
		delta *= -1;
	}
	
	var tracklist = PioneerDDJSR.enumerations.rotarySelector.targets.tracklist;
	var libraries = PioneerDDJSR.enumerations.rotarySelector.targets.libraries;
	
	switch(PioneerDDJSR.status.rotarySelector.target)
	{
		case tracklist:
			engine.setValue('[Playlist]', 'SelectTrackKnob', delta);
			break;
		case libraries:
			if (delta > 0)
			{
				engine.setValue('[Playlist]', 'SelectNextPlaylist', 1);
			}
			else if (delta < 0)
			{
				engine.setValue('[Playlist]', 'SelectPrevPlaylist', 1);
			}
			
			break;
	}
};

PioneerDDJSR.RotarySelectorClick = function(channel, control, value, status) 
{
	// Only trigger when the button is pressed down, not when it comes back up.
	if (value == 0x7F)
	{
		var target = PioneerDDJSR.enumerations.rotarySelector.targets.tracklist;
		
		var tracklist = PioneerDDJSR.enumerations.rotarySelector.targets.tracklist;
		var libraries = PioneerDDJSR.enumerations.rotarySelector.targets.libraries;
		
		switch(PioneerDDJSR.status.rotarySelector.target)
		{
			case tracklist:
				target = libraries;
				break;
			case libraries:
				target = tracklist;
				break;
		}
		
		PioneerDDJSR.status.rotarySelector.target = target;
	}
};

PioneerDDJSR.shutdown = function()
{
	PioneerDDJSR.BindControlConnections(true);
	
	// Reset the VU meters so that we're not left 
	// with it displaying when nothing is playing.
	PioneerDDJSR.vuMeter(0, '[Channel1]', 'VuMeter');
	PioneerDDJSR.vuMeter(0, '[Channel2]', 'VuMeter');
};

