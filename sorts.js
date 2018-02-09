// User Inputted Values
//var arrSize = parseInt(100, 10);
//var maxIntSize = parseInt(100, 10);
//var pauseTime = parseInt(1000, 10);

// create a global queue for animations
var animationQueue = []; // n^2 Memory requirement

// ----------------
// Draw Chart
// ----------------
// Chart.js functions
var ctx = document.getElementById("myChart");
Chart.defaults.global.elements.rectangle.backgroundColor = 'rgba(54, 162, 235, 1)';
var myChart = new Chart(ctx, {
  type: 'bar',
		data: {
    labels: [0,1,2],
    datasets: [{
        label: '',
        data: [0,1,2],
    }],
  },
  options: {
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
	callSort(
		parseInt($('input[name="sort-array-size"]').val(), 10), 
		parseInt($('input[name="sort-integer-range"]').val(), 10), 
		parseInt($('input[name="sort-animation-time"]').val(), 10));
});


function callSort(arrSize, maxIntSize, pauseTime) {

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

	// set initial chart values
	myChart.data.datasets[0].data = arr;
	myChart.data.labels = labels;
	myChart.options.scales.yAxes[0].ticks.max = maxIntSize;
	myChart.update();

	mergeSort(arr);
	drawChart(pauseTime);

}


// -----------------
// Generic Sorting
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
	setInterval(function() {
		if (animationQueue.length > 0) {
			myChart.data.datasets[0].data = animationQueue.shift();
			myChart.update();
		}
	}, pauseTime);
}

	

// ----------------
// Selection Sort
// ----------------
// Find smallest value and swap it into first position, then find
// next smallest value and swap it into second position, etc
// Speed: n^2 always
// Memory: no extra memory required
function selectionSort(array) {
	var n = array.length;
	for (var i = 0; i < n; i++) {
		var min = i;
		for (var j = i + 1; j < n; j++) {
			if (array[j] < array[min]) {
				min = j;
			}				
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
	
// recursive sort
function mSort(array, lo, hi) {
	if (hi <= lo) {
		return;
	} else {
		var mid = Math.floor(lo + (hi - lo)/2);
		mSort(array, lo, mid);
		mSort(array, mid + 1, hi);
		merge(array, lo, mid, hi);
	}
}

function mergeSort(array) {
	aux = new Array(array.length);
	mSort(array, 0, array.length - 1);
	return array;
}


// ----------------
// Quick Sort
// ----------------
function quickSort(array) {
	
}

