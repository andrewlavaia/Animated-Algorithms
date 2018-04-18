// set global values
var treeAnimationQueue = []; // very slow -> n^2 Memory requirement
var treeIntervalTimer = 1000; 
var treeCallNum = 0;
var bstRoot; // needed for BST and Red Black BST

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
  $('.tree').html('<ul class="top-level"></ul>'); // create first ul for root
  clearInterval(treeIntervalTimer);
  treeAnimationQueue.length = 0;

  // Create an empty array
  var array = [];
  array.length = 0;

  if (treeAlgo == "tree-heap") {
    array.push(0); // add first item so that index starts at 1
  }
  
  for (var i = 0; i < numNodes; i++) {
    var p = Math.floor(Math.random() * 1000);  // 0 through 1000 - 1

    if (treeAlgo == "tree-heap") {
      insertNodeHeap(array, p); 

      array.push(p);
      array.push('insertComplete');
      treeAnimationQueue.push(array.slice()); // add copy of array with p and type at end
      array.pop();
      array.pop();
    } 
    else if (treeAlgo == "tree-bst") {
      insertNodeBST(p); 
    } 
    else if (treeAlgo == "tree-redblackbst") {      
      insertNodeRBBST(array, p);
    }


  }

  //BSTtoSortedArray(array, bstRoot);
  BSTtoLevelOrderArray(array, bstRoot);

  console.log(array);
  console.log(bstRoot);
  treeIntervalTimer = drawTrees(pauseTime, treeAlgo);
}

function drawTrees(pauseTime, treeAlgo) {
  return setInterval(function() {
    if (treeAnimationQueue.length > 0) {
      var type = treeAnimationQueue[0].pop(); // swap, insertInitial, insertComplete
      var p = treeAnimationQueue[0].pop(); // grab p
      var array = treeAnimationQueue[0].slice(); // copy array
      array.shift(); // get rid of original 0 

      if (type == "insertInitial") {
        treeCallNum++;
        $('#tree-header').html('#' + treeCallNum + ' : insert( ' + p + ' )');
      }

      if (treeAlgo == "tree-heap") {
        heapDrawTree(array, p, pauseTime);
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
      $('#tree-layers span').css('background-color', 'white');
      clearInterval(treeIntervalTimer);
    }
  }, pauseTime);
}


function insertNodeHeap(array, p) {
  //!!! check to make sure p doesn't already exist in array before pushing
  array.push(p);

  // animation
  array.push(p);
  array.push('insertInitial');
  treeAnimationQueue.push(array.slice()); // add copy of array with p in front
  array.pop();
  array.pop();

  heapSwim(array, array.length - 1, p); // swim last element
}

function insertNodeBST(key) {
  bstRoot = recursiveBSTPut(bstRoot, key);
}

function insertNodeRBBST(array, p) {
  array.push(p);
}

// -------------------
// Heap functions
// ------------------- 
function heapSwim(array, k, p) {
  if (k == 1) { // top node
    return;
  }

  var parent = parseInt(k/2, 10); // 2.5 converted to 2
  if(array[parent] < array[k]) {
    heapSwap(array, k, parent, p);
    heapSwim(array, parent, p);
  }
}

function heapSink(array, k, p) {
  var child = k * 2
  var sz = array.length - 1;
  if (child > sz) { // no more children
    return;
  }
  else if (child + 1 > sz) { // only one child
    heapSwap(array, k, child, p);
  }
  else if (array[child + 1] < array[child]) { // first child is larger
    heapSwap(array, k, child, p);
    heapSink(array, child, p);
  }
  else if(array[child] < array[child + 1]) { // second child is larger
    heapSwap(array, k, child + 1, p);
    heapSink(array, child + 1, p);
  }
}

function heapSwap(array, q, u, p) {
  var temp = array[q];
  array[q] = array[u];
  array[u] = temp;

  array.push(p);
  array.push('swap');
  treeAnimationQueue.push(array.slice()); // add copy of array with p and type at end
  array.pop();
  array.pop();
}

function heapDrawTree(array, p, pauseTime) {
  $('#tree-layers .tree').html('');
  $('#tree-layers .tree').append(
    '<ul class="top-level"><li id="tree-node-' + array[0] + '">' +
    '<span>' + array[0] + '</span>' +
    '</li></ul>');
  
  var parent = 0;
  for (var k = 1; k < array.length; k++) {
    if (k % 2 == 1) {
      $('#tree-node-' + array[parent]).append(
        '<ul><li id="tree-node-' + array[k] + '">' +
        '<span>' + array[k] + '</span>' +
        '</li></ul>');
    } 
    else {
      $('#tree-node-' + array[k - 1]).parent().append(
        '<li id="tree-node-' + array[k] + '">' +
        '<span>' + array[k] + '</span>' +
        '</li>');
      parent = parent + 1;
    }
  }

  $('#tree-node-' + p + ' span').css('background-color', 'red');
  $('#tree-node-' + p).children().find('span').css('background-color', 'white');
}

// -------------------
// BST functions
// ------------------- 

function Node(key) {
  this.key = key;
  this.left = null;
  this.right = null; 
}

function recursiveBSTPut(node, key) {

  // Key not found, return new node
  if (node == null) {
     return new Node(key);
  }

  // Key found
  if (node.key == key) {
    // update value (not needed)
  }

  // call recursion on left node
  if (key < node.key) {
    node.left = recursiveBSTPut(node.left, key);
  }

  // call recursion on right node 
  if (node.key < key) {
    node.right = recursiveBSTPut(node.right, key);
  }

  return node;
}

function BSTtoSortedArray(array, node) {
  if (node == null)
    return;

  node.left = BSTtoSortedArray(array, node.left);
  array.push(node.key);
  node.right = BSTtoSortedArray(array, node.right);

  return node;
}

function BSTtoLevelOrderArray(array, node) {
  
  if (node == null)
    return;

  var q = [];
  q.push(node);

  while (q.length > 0) {

    var newNode = q.shift();
    array.push(newNode.key);
    
    if (newNode.left != null) {
      q.push(newNode.left);
    }

    if (newNode.right != null) {
      q.push(newNode.right);
    }
  }

}

function BSTDrawTree(array, p, pauseTime) {

  $('#tree-layers .tree').html('');
  $('#tree-layers .tree').append(
    '<ul class="top-level"><li id="tree-node-' + array[0] + '">' +
    '<span>' + array[0] + '</span>' +
    '</li></ul>');
  
  var parent = 0;
  for (var i = 1; i < array.length; i++) {
    if (i < parent) {
      $('#tree-node-' + array[parent]).append(
        '<ul><li id="tree-node-' + array[i] + '">' +
        '<span>' + array[i] + '</span>' +
        '</li></ul>');
    }
    else if (i > i - 1 && i < parent) {
      $('#tree-node-' + array[i - 1]).parent().append(
        '<li id="tree-node-' + array[i] + '">' +
        '<span>' + array[i] + '</span>' +
        '</li>');
      parent = parent + 1;
    }
  }

  $('#tree-node-' + p + ' span').css('background-color', 'red');
  $('#tree-node-' + p).children().find('span').css('background-color', 'white');

  }
}