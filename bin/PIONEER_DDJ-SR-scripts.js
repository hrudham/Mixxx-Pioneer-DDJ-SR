var PioneerDDJSR = function() { }

PioneerDDJSR.init = function(id)
{
	var alpha = 1.0 / 8;
	
	PioneerDDJSR.channels = 
		{	
			0x00: {},
			0x01: {},
			0x02: {},
			0x03: {}
		};
	
	PioneerDDJSR.settings = 
		{
			alpha: alpha,
			beta: alpha / 32,
			jogResolution: 720,
			vinylSpeed: 33 + 1/3,
			loopIntervals: ['0.03125', '0.0625', '0.125', '0.25', '0.5', '1', '2', '4', '8', '16', '32', '64'],
			safeScratchTimeout: 20 // 20ms is the minimum allowed here.
		};
		
	PioneerDDJSR.enumerations = 
		{
			rotarySelector:
				{
					targets:
						{
							libraries: 0,
							tracklist: 1
						}
				},
			channelGroups:
				{
					'[Channel1]': 0x00,
					'[Channel2]': 0x01,
					'[Channel3]': 0x02,
					'[Channel4]': 0x03
				}
		};
		
	PioneerDDJSR.status = 
		{
			rotarySelector: 
				{
					target: PioneerDDJSR.enumerations.rotarySelector.targets.tracklist
				}
		};
				
	PioneerDDJSR.BindControlConnections(false);
}

PioneerDDJSR.BindControlConnections = function(isUnbinding)
{
	for (var channelIndex = 1; channelIndex <= 4; channelIndex++)
	{
		var channelGroup = '[Channel' + channelIndex + ']';
	
		// Hook up the VU meters
		engine.connectControl(channelGroup, 'VuMeter', 'PioneerDDJSR.vuMeter', isUnbinding);
		
		// Play / Pause LED
		engine.connectControl(channelGroup, 'play', 'PioneerDDJSR.PlayLeds', isUnbinding);
		
		// Cue LED
		engine.connectControl(channelGroup, 'cue_default', 'PioneerDDJSR.CueLeds', isUnbinding);
		
		// PFL / Headphone Cue LED
		engine.connectControl(channelGroup, 'pfl', 'PioneerDDJSR.HeadphoneCueLed', isUnbinding);
		
		// Keylock LED
		engine.connectControl(channelGroup, 'keylock', 'PioneerDDJSR.KeyLockLeds', isUnbinding);
		
		// Hook up the hot cue performance pads
		for (var i = 0; i < 8; i++)
		{
			engine.connectControl(channelGroup, 'hotcue_' + (i + 1) +'_enabled', 'PioneerDDJSR.HotCuePerformancePadLed', isUnbinding);
		}
		
		// Hook up the roll performance pads
		for (var interval in PioneerDDJSR.settings.loopIntervals)
		{
			engine.connectControl(channelGroup, 'beatloop_' + interval + '_enabled', 'PioneerDDJSR.RollPerformancePadLed', isUnbinding);
		}
	}
};

// This handles LEDs related to the PFL / Headphone Cue event.
PioneerDDJSR.HeadphoneCueLed = function(value, group, control) 
{
	var channel = PioneerDDJSR.enumerations.channelGroups[group];	
	midi.sendShortMsg(0x90 + channel, 0x54, value ? 0x7F : 0x00); // Headphone Cue LED
};

// This handles LEDs related to the cue_default event.
PioneerDDJSR.CueLeds = function(value, group, control) 
{
	var channel = PioneerDDJSR.enumerations.channelGroups[group];	
	midi.sendShortMsg(0x90 + channel, 0x0C, value ? 0x7F : 0x00); // Cue LED
};

// This handles LEDs related to the keylock event.
PioneerDDJSR.KeyLockLeds = function(value, group, control) 
{
	var channel = PioneerDDJSR.enumerations.channelGroups[group];	
	midi.sendShortMsg(0x90 + channel, 0x1A, value ? 0x7F : 0x00); // Keylock LED
};

// This handles LEDs related to the play event.
PioneerDDJSR.PlayLeds = function(value, group, control) 
{
	var channel = PioneerDDJSR.enumerations.channelGroups[group];	
	midi.sendShortMsg(0x90 + channel, 0x0B, value ? 0x7F : 0x00); // Play / Pause LED
	midi.sendShortMsg(0x90 + channel, 0x0C, value ? 0x7F : 0x00); // Cue LED
};

// Lights up the LEDs for beat-loops. Only works with the number 1, 2, 
// 4 and 8 unfortunately, so 0.5 and 0.125, 16 and 32 will not show up.
// We work around this by highlighting the pads when you press them, but 
// if you change the loop interval while still holding the pad, it may not 
// always reflect.
PioneerDDJSR.RollPerformancePadLed = function(value, group, control) 
{
	var channel = PioneerDDJSR.enumerations.channelGroups[group];
	
	var padIndex = 0;
	for (var i = 0; i < 8; i++)
	{
		if (control === 'beatloop_' + PioneerDDJSR.settings.loopIntervals[i + 2] + '_enabled')
		{
			break;
		}
	
		padIndex++;
	}
	
	// Toggle the relevant Performance Pad LED
	midi.sendShortMsg(0x97 + channel, 0x10 + padIndex, value ? 0x7F : 0x00); 
};

PioneerDDJSR.HotCuePerformancePadLed = function(value, group, control) 
{
	var channel = PioneerDDJSR.enumerations.channelGroups[group];
	
	var padIndex = null;
	
	for (var i = 0; i < 8; i++)
	{
		if (control === 'hotcue_' + i + '_enabled')
		{
			break;
		}
		
		padIndex = i;
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
	
	// Make this a little less sensitive.
	movement = movement / 5; 
	
	// Limit movement to the range of -3 to 3.
	movement = movement > 3 ? 3 : movement;
	movement = movement < -3 ? -3 : movement;
	
	engine.setValue(group, 'jog', movement);	
};

// Schedule disabling scratch. We don't do this immediately on 
// letting go of the jog wheel, as that result in a pitch-bend.
// Instead, we set up a time that disables it, but cancel and
// re-register that timer whenever we need to to postpone the disable.
// Very much a hack, but it works, and I'm yet to find a better solution.
PioneerDDJSR.scheduleDisableScratch = function(channel)
{
	PioneerDDJSR.channels[channel].disableScratchTimer = engine.beginTimer(
		PioneerDDJSR.settings.safeScratchTimeout, 
		'PioneerDDJSR.toggleScratch(' + channel + ', false)', 
		true);
};

// If scratch-disabling has been schedule, then unschedule it.
PioneerDDJSR.unscheduleDisableScratch = function(channel)
{
	if (PioneerDDJSR.channels[channel].disableScratchTimer)
	{
		engine.stopTimer(PioneerDDJSR.channels[channel].disableScratchTimer);
	}
};

// Postpone scratch disabling by a few milliseconds. This is
// useful if you were scratching, but let of of the jog wheel.
// Without this, you'd end up with a pitch-bend in that case.
PioneerDDJSR.postponeDisableScratch = function(channel)
{
	PioneerDDJSR.unscheduleDisableScratch(channel);
	PioneerDDJSR.scheduleDisableScratch(channel);
};

// Detect when the user touches and releases the jog-wheel while 
// jog-mode is set to vinyl to enable and disable scratching.
PioneerDDJSR.jogScratchTouch = function(channel, control, value, status) 
{
	if (value == 0x7F)
	{
		PioneerDDJSR.unscheduleDisableScratch(channel);	
		PioneerDDJSR.toggleScratch(channel, true);
	}
	else
	{
		PioneerDDJSR.scheduleDisableScratch(channel);
	}
};
 
// Scratch or seek with the jog-wheel.
PioneerDDJSR.jogScratchTurn = function(channel, control, value, status) 
{
	var deck = channel + 1; 
	
    // Only scratch if we're in scratching mode, when 
	// user is touching the top of the jog-wheel.
    if (engine.isScratching(deck)) 
	{
		engine.scratchTick(deck, PioneerDDJSR.getJogWheelDelta(value));
	}
};

// Pitch bend using the jog-wheel, or finish a scratch when the wheel 
// is still turning after having released it.
PioneerDDJSR.jogPitchBend = function(channel, control, value, status) 
{
	var deck = channel + 1; 
	var group = '[Channel' + deck +']';

	if (engine.isScratching(deck))
	{
		engine.scratchTick(deck, PioneerDDJSR.getJogWheelDelta(value));
		PioneerDDJSR.postponeDisableScratch(channel);
	}
	else
	{	
		// Only pitch-bend when actually playing
		if (engine.getValue(group, 'play'))
		{
			PioneerDDJSR.pitchBend(channel, PioneerDDJSR.getJogWheelDelta(value));
		}
	}
};

// Called when the jog-mode is not set to vinyl, and the jog wheel is touched.
PioneerDDJSR.jogSeekTouch = function(channel, control, value, status) 
{
	var deck = channel + 1; 
	var group = '[Channel' + deck +']';
	
	// Only enable scratching if we're in scratching mode, when user is  
	// touching the top of the jog-wheel and the 'Vinyl' jog mode is 
	// selected.
	if (!engine.getValue(group, 'play'))
	{
		// Scratch if we're not playing; otherwise we'll be 
		// pitch-bending here, which we don't want.
		PioneerDDJSR.toggleScratch(channel, value == 0x7F);
	}
};

// Call when the jog-wheel is turned. The related jogSeekTouch function 
// sets up whether we will be scratching or pitch-bending depending 
// on whether a song is playing or not.
PioneerDDJSR.jogSeekTurn = function(channel, control, value, status) 
{
	var deck = channel + 1; 
	
    if (engine.isScratching(deck)) 
	{
		engine.scratchTick(deck, PioneerDDJSR.getJogWheelDelta(value));
	}
	else
	{
		PioneerDDJSR.pitchBend(channel, PioneerDDJSR.getJogWheelDelta(value));
	}
};

// This handles the eight performance pads below the jog-wheels 
// that deal with rolls or beat loops.
PioneerDDJSR.RollPerformancePad = function(performanceChannel, control, value, status) 
{
	var deck = performanceChannel - 6;  
	var group = '[Channel' + deck +']';
	var interval = PioneerDDJSR.settings.loopIntervals[control - 0x10 + 2];
	
	if (value == 0x7F)
	{
		engine.setValue(group, 'beatlooproll_' + interval + '_activate', 1);
	}
	else
	{
		engine.setValue(group, 'beatlooproll_' + interval + '_activate', 0);
	}
	
	midi.sendShortMsg(0x97 + deck - 1, control, value);
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
	
	// Reset the VU meters so that we're not left with
	// it displaying something when nothing is playing.
	PioneerDDJSR.vuMeter(0, '[Channel1]', 'VuMeter');
	PioneerDDJSR.vuMeter(0, '[Channel2]', 'VuMeter');
	PioneerDDJSR.vuMeter(0, '[Channel3]', 'VuMeter');
	PioneerDDJSR.vuMeter(0, '[Channel4]', 'VuMeter');
};

