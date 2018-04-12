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

function arrayMergeSort(array) {
	aux = new Array(array.length);
	mgSort(array, 0, array.length - 1);
}

function mgSort(array, lo, hi) { // recursive 
	if (hi <= lo) {
		return;
	} else {
		var mid = Math.floor(lo + (hi - lo)/2);
		mgSort(array, lo, mid);
		mgSort(array, mid + 1, hi);
		rMerge(array, lo, mid, hi);
	}
}

function rMerge(array, lo, mid, hi) {
	var i = lo;
	var j = mid + 1;

	// copy array to aux
	for (var k = lo; k <= hi; k++) { 
		aux[k] = array[k];
	}

	for (var k = lo; k <= hi; k++) {
		// entire first half exhausted
		if (i > mid) {
			array[k] = aux[j];
			j++;
		} 
		// entire second half exhausted
		else if (j > hi) {
			array[k] = aux[i];
			i++;
		}
		// value from second half is lower
		else if (aux[j] < aux[i]) {
			array[k] = aux[j];
			j++;
		}
		// value from first half is equal or lower
		else {
			array[k] = aux[i];	
			i++;
		}
	}
}

$('#sortNav').click(function() {
	$('#sort-wrapper').show();
	$('#union-wrapper').hide();
	$('#perc-wrapper').hide();
	$('#tree-wrapper').hide();
});

$('#unionNav').click(function() {
	$('#sort-wrapper').hide();
	$('#union-wrapper').show();
	$('#perc-wrapper').hide();
	$('#tree-wrapper').hide();
});

$('#percNav').click(function() {
	$('#sort-wrapper').hide();
	$('#union-wrapper').hide();
	$('#perc-wrapper').show();
	$('#tree-wrapper').hide();
});

$('#treeNav').click(function() {
	$('#sort-wrapper').hide();
	$('#union-wrapper').hide();
	$('#perc-wrapper').hide();
	$('#tree-wrapper').show();
});