function assert(condition, message) {
    if (!condition) throw new Error(message)
}

function newFilledArray(length, val) {
	var array = [];
	array.length = length;
	for(var i = 0; i < length; i++) {
		array[i] = val;
	}

	return array;
}