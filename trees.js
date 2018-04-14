// set global values
var treeAnimationQueue = []; // very slow -> n^2 Memory requirement
var treeIntervalTimer = 1000; 
var treeCallNum = 0;


// Initially hide #tree-wrapper div
$('#tree-wrapper').hide();

$('input[name="tree-begin"]').on('click', function() {
  callConstructTree(
    parseInt($('input[name="tree-nodes"]').val(), 10),  
    parseInt($('input[name="tree-animation-time"]').val(), 10),
    $('select[name="tree-select"]').val());
});

function callConstructTree(numNodes, pauseTime, treeAlgo) {
  // clear previous values if set
  treeCallNum = 0;
  $('#tree-header').html('#0 : insert( 0 )');
  $('.tree-layer').html('');
  $('.tree-display').html('<ul class="top-level"></ul>'); // create first ul for root
  clearInterval(treeIntervalTimer);
  treeAnimationQueue.length = 0;

  // Create an empty array
  var array = [];
  array.push(0); // add first item so that index starts at 1
  for (var i = 0; i < numNodes; i++) {
    var p = Math.floor(Math.random() * 10);  // 0 through 100 - 1

    if (treeAlgo == "tree-heap") {
      insertNodeHeap(array, p); 
    } 
    else if (treeAlgo == "tree-bst") {
      insertNodeBST(array, p); 
    } 
    else if (treeAlgo == "tree-redblackbst") {      
      insertNodeRBBST(array, p);
    }

    array.push(p);
    treeAnimationQueue.push(array.slice()); // add copy of array with p in front
    array.pop();
  }

  treeIntervalTimer = drawTrees(pauseTime, treeAlgo);
}

function drawTrees(pauseTime, treeAlgo) {
  return setInterval(function() {
    console.log(treeAnimationQueue.slice());
    if (treeAnimationQueue.length > 0) {
      var p = treeAnimationQueue[0].pop(); // grab p
      var array = treeAnimationQueue[0].slice(); // copy array
      array.shift(); // get rid of original 0 

      treeCallNum++;
      $('#tree-header').html('#' + treeCallNum + ' : insert( ' + p + ' )');

      if (treeAlgo == "tree-heap") {
        $('.tree-display').html(array);
      }
      else if (treeAlgo == "tree-bst") {
        $('.tree-display').html(array);
      } 
      else if (treeAlgo == "tree-redblackbst") {
        $('.tree-display').html(array);
      }

      // Dequeue
      treeAnimationQueue.shift();  
    }

    if (treeAnimationQueue.length == 0) { 
      clearInterval(treeIntervalTimer);
    }
  }, pauseTime);
}


function insertNodeHeap(array, p) {
  array.push(p);
  heapSwim(array, array.length - 1); // swim last element
  console.log(array);
}

function insertNodeBST(array, p) {
  array.push(p);
}

function insertNodeRBBST(array, p) {
  array.push(p);
}

// -------------------
// Heap functions
// ------------------- 
function heapSwim(array, k) {
  if (k == 1) { // top node
    return;
  }

  var parent = parseInt(k/2, 10); // 2.5 converted to 2
  if(array[parent] < array[k]) {
    heapSwap(array, k, parent);
    heapSwim(array, parent);
  }
}

function heapSink(array, k) {
  var child = k * 2
  var sz = array.length - 1;
  if (child > sz) { // no more children
    return;
  }
  else if (child + 1 > sz) { // only one child
    heapSwap(array, k, child);
  }
  else if (array[child + 1] < array[child]) { // first child is larger
    heapSwap(array, k, child);
    heapSink(array, child);
  }
  else if(array[child] < array[child + 1]) { // second child is larger
    heapSwap(array, k, child + 1);
    heapSink(array, child + 1);
  }
}

function heapSwap(array, p, q) {
  var temp = array[p];
  array[p] = array[q];
  array[q] = temp;
}

