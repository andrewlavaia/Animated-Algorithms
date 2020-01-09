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
	openWrapper('sort-wrapper');
});

$('#unionNav').click(function() {
	openWrapper('union-wrapper');
});

$('#percNav').click(function() {
	openWrapper('perc-wrapper');
});

$('#treeNav').click(function() {
	openWrapper('tree-wrapper');
});

$('#searchNav').click(function() {
	openWrapper('search-wrapper');
});

$('#graphNav').click(function() {
	openWrapper('graph-wrapper');
});

function openWrapper(wrapName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(wrapName).style.display = "block";
    document.getElementById(wrapName).className += " active";
}

// Update text value when moving slider 
$(document).on('mousemove mousedown mouseup touchmove touchstart touchend',
'.slidecontainer input', function() {
    var id = $(this).attr("id");
    $('#' + id + '-val').text($(this).val());
});

 		 