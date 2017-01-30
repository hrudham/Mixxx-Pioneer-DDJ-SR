var ControlManager = function() 
{
	this.controls = [];
};

ControlManager.prototype.getHexString = function(number) 
{
	var hex = number.toString(16);
	
	if (hex.length == 1)
	{
		hex = '0' + hex;
	}
	
	return '0x' + hex.toUpperCase();
};

/* 
	Usage examples:
		manager.add('group', 'key', '0x00', '0x00');											// Square brackets around group names are optional.
		manager.add('[group]', 'key', '0x00', '0x00');											// 'normal' options are detected.
		manager.add('[group]', 'prefix.function', 0x00, 0x00); 									// 'script-bindings' are  detected.
		manager.add('group', 'key', '0x00', '0x00', 'soft-takeover');							// specify a single option, 'soft-takeover' in this case.
		manager.add('group', 'key', '0x00', '0x00', [ 'soft-takeover', 'another-option' ]); 	// specify multiple options

	Real example:
		If you see the follow for your play button in the console:
			Debug [Controller]: "MIDI t:1203674 ms status 0x90 (ch 1, opcode 0x9), ctrl 0x0B, val 0x00"
		then use the following code:
			manager.add('Channel1', 'play', 0x90, 0x0B);
                                                                                           
*/
ControlManager.prototype.add = function(group, key, status, midino, options) 
{
	if (options == null)
	{
		if (key.indexOf('.') > -1)
		{
			options = [ 'script-binding' ];
		}
		else
		{
			options = [ 'normal' ];
		}
	}

	if (!(options instanceof Array))
	{
		options = [ options ];
	}
	
	if (group.indexOf('[') != 0 && group.indexOf(']') != group.length - 1)
	{
		group = '[' + group + ']';
	}

	this.controls.push(
		{
			group: group, 
			key: key,
			midino: this.getHexString(midino),
			status: this.getHexString(status),
			options: options
		});
};

module.exports = ControlManager;