// create a global queue for animations
var animationQueue = []; // very slow -> n^2 Memory requirement
var intervalTimer; 

// Initially show #sorts div
$('#sort-wrapper').show();

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
      data: [0,1,2],
      xAxisID: "bar-x-axis1",
    }, {
      data: [0,0,0],
      xAxisID: "bar-x-axis1",
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
        xAxes: [{
          stacked: true,
          id: 'bar-x-axis1',
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true,
            max: 10,
          }
        }],
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
    //parseInt($('input[name="sort-array-size"]').val(), 10), 
    parseInt($('#sort-array-size').val(), 10),
    parseInt($('#sort-integer-range').val(), 10), 
    parseInt($('#sort-animation-time').val(), 10),
    $('select[name="sort-select"]').val());
});


function callSort(arrSize, maxIntSize, pauseTime, sortAlgo) {

  // Create an array and populate it with random values
  var arr = [];
  for (var i = 0; i < arrSize; i++) {
    arr.push(Math.round(Math.random() * maxIntSize)); // 0 through maxIntSize
  }

  // create labels for chart.js
  var labels = [];
  for (var i = 0; i < arrSize; i++) {
    labels.push(i);
  }

  // Used for supplmental animations on certain algorithms
  var suppArray = newFilledArray(arrSize, 0); // supplemental array filled with zeroes
  suppArray.push('s'); // needed for drawChart()

  animationQueue.length = 0; // clear existing animation queue
  clearInterval(intervalTimer); // clear previous timer if set
  animationQueue.push(arr.slice()); // load initial unsorted array 

  // set initial chart values
  chart.data.datasets[0].data = arr;
  chart.data.datasets[1].data = suppArray;
  chart.data.datasets[0].backgroundColor = 'rgba(54, 162, 235, .6)';
  chart.data.datasets[1].backgroundColor = 'rgba(230, 100, 100, 1)';
  chart.data.labels = labels;
  chart.options.scales.yAxes[0].ticks.max = maxIntSize;
  chart.update();

  if (sortAlgo == "selectionSort")
    selectionSort(arr);
  else if (sortAlgo == "insertionSort")
    insertionSort(arr);
  else if (sortAlgo == "shellSort")
    shellSort(arr);
  else if (sortAlgo == "mergeSort")
    mergeSort(arr);
  else if (sortAlgo == "quickSort")
    quickSort(arr); 
  else if (sortAlgo == "heapSort")
    heapSort(arr);
  
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
      var last = animationQueue[0].length - 1;
      if (animationQueue[0][last] == 's') { // check if supplemental animation
        animationQueue[0].pop(); // remove the 's'
        chart.data.datasets[1].data = animationQueue.shift();
      } else {
        chart.data.datasets[0].data = animationQueue.shift();
      }
      chart.update();
    } else if (animationQueue == 0) {
      clearInterval(intervalTimer);
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

  var supp = newFilledArray(n, 0);        // animation purposes only
  supp.push('s');                         // animation purposes only

  for (var i = 0; i < n; i++) {
    var min = i;
    for (var j = i + 1; j < n; j++) {
      if (array[j] < array[min]) {
        min = j;
      }
      supp[j] = array[j];                  // animation purposes only
      animationQueue.push(supp.slice());   // animation purposes only   
      supp[j] = 0;                         // animation purposes only
    }
    swap(array, i, min);
    animationQueue.push(array.slice());    // animation purposes only
  }

  animationQueue.push(supp.slice());       // animation purposes only
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

  var supp = newFilledArray(n, 0);        // animation purposes only
  supp.push('s');                         // animation purposes only

  for (var i = 1; i < n; i++) {
    for(var j = i; j > 0 && array[j] < array[j - 1]; j--) {
      supp[j] = array[j];                  // animation purposes only
      animationQueue.push(supp.slice());   // animation purposes only   
      supp[j] = 0;                         // animation purposes only
      swap(array, j, j - 1);
      animationQueue.push(array.slice());  // animation purposes only
    }
  }
  animationQueue.push(supp.slice());       // animation purposes only 
  return array;
}

// ----------------
// Shell Sort
// ----------------
// Optimization of insertion sort that initially allows swaps between 
// non-adjacent items. Quickly pre-sorts the array to be mostly sorted
// and then applies insertion sort.
// Speed: n for small or mostly sorted arrays, n^(3/2) in worst case
// Memory: no extra memory required
function shellSort(array) {
  var n = array.length;
  var h = 1;

  var supp = newFilledArray(n, 0);        // animation purposes only
  supp.push('s');                         // animation purposes only

  // find highest reasonable h value
  while (h < n) {
    h = (h * 3) + 1;  // 1, 4, 13, 40, 121, 364 .... 
  }
  while (h >= 1) {
    for (var i = h; i < n; i++) {
      // iterate through array and sort in intervals of h
      for (var j = i; j >= h && array[j] < array[j - h]; j = j - h) {
        supp[j] = array[j];                 // animation purposes only
        supp[j - h] = array[j-h];           // animation purposes only
        animationQueue.push(supp.slice());  // animation purposes only
        supp[j] = 0;                        // animation purposes only  
        supp[j - h] = 0;                    // animation purposes only
        swap(array, j, j - h);
        animationQueue.push(array.slice()); // animation purposes only
      }
    }
    h = (h - 1)/3;
  }

  animationQueue.push(supp.slice());       // animation purposes only 
  return array;
}



// ----------------
// Merge Sort
// ----------------
// Split array into a left and right array and recursively sort and merge
// the smaller sub-arrays
// Speed: n*lg(n) always
// Memory: extra memory required from temporary array that gets copied
// Stable (one of the best stable sorts out there)

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
  var supp = newFilledArray(array.length, 0); // animation purposes only
  supp.push('s');                             // animation purposes only

  var i = lo;
  var j = mid + 1;

  // copy array to aux
  for (var k = lo; k <= hi; k++) { 
    aux[k] = array[k];
    supp[k] = array[k];                       // animation purposes only
  }

  for (var k = lo; k <= hi; k++) {
    // entire first half exhausted
    if (i > mid) {
      array[k] = aux[j];
      supp[k] = aux[j];                       // animation purposes only
      j++;
    } 
    // entire second half exhausted
    else if (j > hi) {
      array[k] = aux[i];
      supp[k] = aux[i];                       // animation purposes only
      i++;
    }
    // value from second half is lower
    else if (aux[j] < aux[i]) {
      array[k] = aux[j];
      supp[k] = aux[j];                       // animation purposes only
      j++;
    }
    // value from first half is equal or lower
    else {
      array[k] = aux[i];
      supp[k] = aux[i];                       // animation purposes only  
      i++;
    }
    animationQueue.push(supp.slice());        // animation purposes only
  }
  animationQueue.push(array.slice());         // animation purposes only
  supp = newFilledArray(array.length, 0);     // animation purposes only
  supp.push('s');                             // animation purposes only
  animationQueue.push(supp.slice());          // animation purposes only
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
// Not stable

// Normally would need to shuffle array before hand so that it would eliminate 
// dependence on input by randomizing the array.
// This allows the partition element to be first element,
// rather than having to randomly select parition elements.
// Shuffles can be performed in O(n) time.
// Not needed in this case since array is already randomized.
function quickSort(array) {
  // shuffle(array);
  qsort(array, 0, array.length - 1);
  animationQueue.push(array.slice());
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
  var supp = newFilledArray(array.length, 0); // animation purposes only
  supp.push('s');                             // animation purposes only

  var p = array[lo]; // select first element to partition 
                     // array must be randomly ordered or shuffled initially
  var i = lo + 1; // skip partition element
  var j = hi;

  while (i <= j) { 
    while (array[i] <= p) { 
      supp[i] = 0;                              // animation purposes only
      i++; // element already in correct array, ignore
      supp[i] = array[i];                       // animation purposes only
      animationQueue.push(supp.slice());        // animation purposes only
    }
    while (array[j] > p) {
      supp[j] = 0;                              // animation purposes only
      j--; // element already in correct sub-array, ignore
      supp[j] = array[j];                       // animation purposes only
      animationQueue.push(supp.slice());        // animation purposes only
    }
    if (i < j) { // swap only if indices didn't cross
      swap(array, i, j);
      supp[i] = array[i];                       // animation purposes only
      supp[j] = array[j];                       // animation purposes only
      animationQueue.push(array.slice());       // animation purposes only
    }
  }

  swap(array, lo, j); // place partitioned element into correct spot
  animationQueue.push(array.slice());           // animation purposes only
  supp[i] = 0;                                  // animation purposes only
  supp[j] = 0;                                  // animation purposes only
  animationQueue.push(supp.slice());            // animation purposes only
  return j;
}

// ----------------
// Heap Sort
// ----------------
// First organizes the array into a complete heap and then
// sorts the heap. Could be slower than quickSort in practice
// due to memory caching. Not stable. 
// Speed: nlogn worst case
// Memory: typically no extra memory required as it sorts in place
// (not really in this case because I am creating a new heap)
function heapSort(array) {
  n = array.length;

  var heap = [];
  heap.push(0); // populate first value so index starts at 1
  for (var i = 0; i < n; i++) {
    heapInsert(heap, array[i], array, i); // parameters 3 + 4 for animation only
  }

  for (var i = n - 1; i >= 0; i--){
    var max = heapDelMax(heap, array, i); // parameters 2 + 3 for animation only
    array[i] = max;
  }

  // clean up final animations
  var supp = newFilledArray(n, 0);          // animation purposes only
  supp.push('s');                           // animation purposes only
  animationQueue.push(supp.slice());        // animation purposes only
  animationQueue.push(array.slice());       // animation purposes only

}

function heapInsert(heap, val, array, i) {
  heap.push(val); // added to back of heap  
  
  var supp = heap.slice();                    // animation purposes only
  supp.shift();                               // animation purposes only
  while(supp.length < array.length) {         // animation purposes only
    supp.push(0);                             // animation purposes only
  }                                           // animation purposes only
  supp.push('s');                             // animation purposes only       
  animationQueue.push(supp.slice());          // animation purposes only
  array[i] = 0;                               // animation purposes only
  animationQueue.push(array.slice());         // animation purposes only

  heapSwim(heap, heap.length - 1); // swim upwards
}

function heapSwim(heap, k) {
  while (k > 1 && heap[Math.floor(k/2)] < heap[k]) {
    heapSwap(heap, k, Math.floor(k/2));
    k = Math.floor(k/2);
  }
}

function heapSwap(heap, j, k) {
  var temp = heap[k];
  heap[k] = heap[j];
  heap[j] = temp;

  var supp = heap.slice();                    // animation purposes only
  supp.shift();                               // animation purposes only
  if(supp.length == 1) {                      // animation purposes only
    supp.push(0);                             // animation purposes only
  }                                           // animation purposes only
  supp.push('s');                             // animation purposes only
  animationQueue.push(supp.slice());          // animation purposes only
}

function heapSink(heap, k) {
  var n = heap.length - 1;
  while (k*2 <= n) {
    // choose largest child
    var j = k*2;
    if (j < n && heap[j] < heap[j + 1]) {
      j++; 
    }
    
    // check values
    if (heap[k] >= heap[j]) {
      return;
    }
    
    // swap values  
    heapSwap(heap, j, k);
    k = j;
  }
}

function heapDelMax(heap, array, i) {
  var key = heap[1];
  heapSwap(heap, 1, heap.length - 1);
  heap.pop();

  array[i] = key;                             // animation purposes only
  animationQueue.push(array.slice());         // animation purposes only
  
  heapSink(heap, 1);
  return key;
}
