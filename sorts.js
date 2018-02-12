// User Inputted Values
//var arrSize = parseInt(100, 10);
//var maxIntSize = parseInt(100, 10);
//var pauseTime = parseInt(1000, 10);

// create a global queue for animations
var animationQueue = []; // very slow -> n^2 Memory requirement
var intervalTimer; 

// ----------------
// Draw Chart
// ----------------
// Chart.js functions
var ctx = document.getElementById("sort-chart");
Chart.defaults.global.elements.rectangle.backgroundColor = 'rgba(54, 162, 235, 1)';
var chart = new Chart(ctx, {
  type: 'bar',
		data: {
    labels: [0,1,2],
    datasets: [{
        label: '',
        data: [0,1,2],
    }],
  },
  options: {
   	animation: {
			duration: 0,
		},
  	legend: {
  		display: false,
  	},
  	responsive: false,
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true,
                max: 2,
            }
        }]
    },
    title: {
    	display: false,
    	text: "",
    },
    tooltips: {
    	enabled: false,
    },
  },
});


$('input[name="sort-begin"]').on('click', function() {
	console.log($('select[name="sort-select"]').val());
	callSort(
		parseInt($('input[name="sort-array-size"]').val(), 10), 
		parseInt($('input[name="sort-integer-range"]').val(), 10), 
		parseInt($('input[name="sort-animation-time"]').val(), 10),
		$('select[name="sort-select"]').val());
});


function callSort(arrSize, maxIntSize, pauseTime, sortAlgo) {

	// Create an array and populate it with random values
	var arr = [];
	for (var i = 0; i < arrSize; i++) {
	  arr.push(Math.round(Math.random() * maxIntSize)); // 0 through maxIntSize - 1
	}

	// create labels for chart.js
	var labels = [];
	for (var i = 0; i < arrSize; i++) {
	  labels.push(i);
	}

	animationQueue.length = 0; // clear existing animation queue
	clearInterval(intervalTimer); // clear previous timer if set


	// set initial chart values
	chart.data.datasets[0].data = arr;
	chart.data.labels = labels;
	chart.options.scales.yAxes[0].ticks.max = maxIntSize;
	chart.update();

	if (sortAlgo == "selectionSort")
		selectionSort(arr);
	else if (sortAlgo == "insertionSort")
		insertionSort(arr);
	else if (sortAlgo == "mergeSort")
		mergeSort(arr);
	else if (sortAlgo == "quickSort")
		quickSort(arr); 
	
	intervalTimer = drawChart(pauseTime);

}


// -----------------
// Generic Sorting Functions
// -----------------
function isSorted(array) {
	var n = array.length;
	for (var i = 1; i < n; i++) {
		if (array[i] < array[i - 1]) {
			return false;
		}
		return true;
	}
}

function swap(array, a, b) {
	var temp = array[b];
	array[b] = array[a];
	array[a] = temp;
}


function drawChart(pauseTime) {
	return setInterval(function() {
		if (animationQueue.length > 0) {
			chart.data.datasets[0].data = animationQueue.shift();
			chart.update();
		}
	}, pauseTime);
}


// ----------------
// Selection Sort
// ----------------
// Find smallest value and swap it into first position, then find
// next smallest value and swap it into second position, etc
// Speed: n^2, lots of compares but minimum swap calls
// Memory: no extra memory required
function selectionSort(array) {
	var n = array.length;
	for (var i = 0; i < n; i++) {
		var min = i;
		for (var j = i + 1; j < n; j++) {
			if (array[j] < array[min]) {
				min = j;
			}
			animationQueue.push(array.slice()); // push a copy of the array into the queue				
		}
		swap(array, i, min);
	}
	return array;
}

// ----------------
// Insertion Sort
// ----------------
// As you iterate through the array, you take each entry and swap it with
// the entry preceeding it until it is in the correct position
// (how most people would sort a hand of cards)
// Speed: n for small or mostly sorted arrays, n^2 in average and worst case
// Memory: no extra memory required
function insertionSort(array) {
	var n = array.length;
	for (var i = 1; i < n; i++) {
		for(var j = i; j > 0; j--) {
			if (array[j] < array[j - 1]) {
				swap(array, j, j - 1);
				animationQueue.push(array.slice()); // push a copy of the array into the queue
			}
		}
	}
	return array;
}


// ----------------
// Merge Sort
// ----------------
// Split array into a left and right array and recursively sort and merge
// the smaller sub-arrays
// Speed: nlgn always
// Memory: extra memory required from temporary array that gets copied

function mergeSort(array) {
	aux = new Array(array.length);
	mSort(array, 0, array.length - 1);
	return array;
}

function mSort(array, lo, hi) { // recursive 
	if (hi <= lo) {
		return;
	} else {
		var mid = Math.floor(lo + (hi - lo)/2);
		mSort(array, lo, mid);
		mSort(array, mid + 1, hi);
		merge(array, lo, mid, hi);
	}
}

function merge(array, lo, mid, hi) {
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
		animationQueue.push(array.slice()); // push a copy of the array into the queue
	}
}



// ----------------
// Quick Sort
// ----------------
// Partition array into two smaller sub-arrays and move all other
// items in the array into the correct sub-array depending on whether 
// they are larger or smaller than the partitioned element. 
// This procedure is then called recursively on the smaller sub-arrays.
// Speed: nlgn average, n^2 worst case if already sorted
// Memory: no extra memory, sorts in place

// Normally would need to shuffle array before hand so that it would eliminate 
// dependence on input by randomizing the array.
// This allows the partition element to be first element,
// rather than having to randomly select parition elements.
// Shuffles can be performed in O(n) time.
// Not need in this case since array is already randomized.
function quickSort(array) {
	// shuffle(array);
	qsort(array, 0, array.length - 1);
	return array;
}

function qsort(array, lo, hi) { // recursive
	if (hi <= lo) {
		return;
	}
	var p = partition(array, lo, hi); // p is partition index, placed in proper position 
	qsort(array, lo, p - 1); // sort left sub-array
	qsort(array, p + 1, hi)  // sort right sub-array
}

function partition(array, lo, hi) {
	var p = array[lo]; // select first element to partition
	var i = lo+1; // skip partition element
	var j = hi;

	while (i <= j) { 
		while (array[i] <= p) { 
			i++; // element already in correct array, ignore
		}
		while (array[j] > p) {
			j--; // element already in correct sub-array, ignore
		}
		if (i < j) { // swap only if indices didn't cross
			swap(array, i, j);
			i++; 
			j--;
			animationQueue.push(array.slice()); // push a copy of the array into the queue
		}
	}

	swap(array, lo, j); // place partitioned element into correct spot
	animationQueue.push(array.slice()); // push a copy of the array into the queue
	return j;
}
