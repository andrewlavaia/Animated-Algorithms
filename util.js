function assert(condition, message) {
    if (!condition) throw new Error(message)
}

function swap(a, b) {
	var temp = b;
	b = a;
	a = temp;
}

