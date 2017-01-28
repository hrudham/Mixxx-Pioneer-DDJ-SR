var controlManager = function() {};

controlManager.controls = [];

controlManager.getHexString = function(number) 
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
*/
controlManager.add = function(group, key, status, midino, options) 
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

	controlManager.controls.push(
		{
			group: group, 
			key: key,
			midino: controlManager.getHexString(midino),
			status: controlManager.getHexString(status),
			options: options
		});
};

module.exports = controlManager;