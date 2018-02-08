// User Inputted Values
var arrSize = 10;
var maxIntSize = 100;


// Create an array and populate it with random values
var arr = [];
for (var i = 0; i < arrSize; i++) {
  arr.push(Math.round(Math.random() * maxIntSize)); // 0 through maxIntSize - 1
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
function mergeSort(array) {
	
}


// ----------------
// Quick Sort
// ----------------
function quickSort(array) {
	
}

