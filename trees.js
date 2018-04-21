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
  bstRoot = null;

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

      array.length = 0;
      array.push(JSON.stringify(bstRoot));
      array.push(p);
      array.push('insertComplete');
      treeAnimationQueue.push(array.slice());
      array.pop();
      array.pop();
  
    } 
    else if (treeAlgo == "tree-redblackbst") {      
      insertNodeRBBST(p);

      array.length = 0;
      array.push(JSON.stringify(bstRoot));
      array.push(p);
      array.push('insertComplete');
      treeAnimationQueue.push(array.slice());
      array.pop();
      array.pop();

      console.log(bstRoot);
    }
  }

  treeIntervalTimer = drawTrees(pauseTime, treeAlgo);
}

function drawTrees(pauseTime, treeAlgo) {
  return setInterval(function() {
    if (treeAnimationQueue.length > 0) {
      var type = treeAnimationQueue[0].pop(); // swap, insertInitial, insertComplete
      var p = treeAnimationQueue[0].pop(); // grab p
      var array = treeAnimationQueue[0].slice(); // copy array

      if (type == "insertInitial") {
        treeCallNum++;
        $('#tree-header').html('#' + treeCallNum + ' : insert( ' + p + ' )');
      }

      if (treeAlgo == "tree-heap") {
        array.shift(); // get rid of original 0 
        heapDrawTree(array, p);
      }
      else if (treeAlgo == "tree-bst") {
        BSTDrawTree(JSON.parse(array), p, type, treeAlgo); // array is actually a BST
      } 
      else if (treeAlgo == "tree-redblackbst") {
        BSTDrawTree(JSON.parse(array), p, type, treeAlgo); // array is actually a BST
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
  // pass JSON version of object and parse it 
  // back into an object when retrieving
  var array = []; 
  
  if (bstRoot == null) 
    array.push(JSON.stringify(new Node(key)));
  else
    array.push(JSON.stringify(bstRoot));
  
  array.push(key);
  array.push('insertInitial');
  treeAnimationQueue.push(array.slice());
  array.pop();
  array.pop();

  bstRoot = recursiveBSTPut(bstRoot, key);
}

function insertNodeRBBST(key) {
  // pass JSON version of object and parse it 
  // back into an object when retrieving
  var array = []; 
  
  if (bstRoot == null) {
    bstRoot = new RBNode(key);
    bstRoot.color = 'black';
    array.push(JSON.stringify(bstRoot));
    array.push(key);
    array.push('insertInitial');
    treeAnimationQueue.push(array.slice());
    array.pop();
    array.pop();
  } else {
    array.push(JSON.stringify(bstRoot));
    array.push(key);
    array.push('insertInitial');
    treeAnimationQueue.push(array.slice());
    array.pop();
    array.pop();

    bstRoot = recursiveRBBSTPut(bstRoot, key);
  }
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

// swaps two elements in a heap stored in an array
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

// Draws a complete Binary Heap
function heapDrawTree(array, p) {
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

// Inserts node into BST
function recursiveBSTPut(node, key) {

  // Key not found, return new node
  if (node == null) {
     return new Node(key);
  }

  var array = []; 
  array.push(JSON.stringify(bstRoot));
  array.push(node.key);
  array.push('swap');
  treeAnimationQueue.push(array.slice());
  array.pop();
  array.pop();

  // Key found
  if (node.key == key) {

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

// Performs a deep copy of a red black BST into
// a new BST by recursively creating
// copies of each node
function copyBST(node) {
  if (node == null)
    return null;

  var newNode = new RBNode(node.key);
  newNode.left = copyBST(node.left);
  newNode.right = copyBST(node.right);

  return newNode;
}

// Inserts a BST into an array into sorted order
function BSTtoSortedArray(array, node) {
  if (node == null)
    return;

  node.left = BSTtoSortedArray(array, node.left);
  array.push(node.key);
  node.right = BSTtoSortedArray(array, node.right);

  return node;
}

// Inserts a BST into an array in level order
function BSTtoLevelOrderArray(array, node) {
  if (node == null) {
    return;
  }

  var q = [];
  q.push(node);

  while (q.length > 0) {
    var newNode = q.shift();

    if (newNode != null)
      array.push(newNode.key);
    else 
      array.push(null);
    
    if (newNode != null) {
      q.push(newNode.left);
    }

    if (newNode != null) {
      q.push(newNode.right);
    }
  }
}

// Draw an unbalanced binary search tree or a 
// red black binary search tree
function BSTDrawTree(node, p, type, treeType) {

  $('#tree-layers .tree').html('');

  // draw root;
  $('#tree-layers .tree').append(
    '<ul class="top-level"><li id="tree-node-' + node.key + '">' +
    '<span>' + node.key + '</span>' +
    '</li></ul>');

  // level order search through tree
  var q = [];
  q.push(node);
  
  while (q.length > 0)  {
    var current = q.shift(); 

    if (current.left != null) {
      q.push(current.left);
    }

    if (current.right != null) {
      q.push(current.right);
    }

    //!!! add new CSS class for null entries?
    if(current.left != null && current.right != null) {
      $('#tree-node-' + current.key).append(
        '<ul><li id="tree-node-' + current.left.key + '">' +
        '<span>' + current.left.key + '</span>' +
        '</li> <li id="tree-node-' + current.right.key + '">' +
        '<span>' + current.right.key + '</span>' +
        '</li></ul>');
    } 
    else if(current.left == null && current.right != null) {
      $('#tree-node-' + current.key).append(
        '<ul><li id="tree-node-' + current.key + '-null">' +
        '<span> </span>' +
        '</li> <li id="tree-node-' + current.right.key + '">' +
        '<span>' + current.right.key + '</span>' +
        '</li></ul>');
    }
    else if(current.left != null && current.right == null) {
      $('#tree-node-' + current.key).append(
        '<ul><li id="tree-node-' + current.left.key + '">' +
        '<span>' + current.left.key + '</span>' +
        '</li> <li id="tree-node-' + current.key + '-null">' +
        '<span> </span>' +
        '</li></ul>');
    }
  }

  if (type == 'swap')
    $('#tree-node-' + p + ' span').css('background-color', 'red');
  else if (type == 'insertComplete') 
    $('#tree-node-' + p + ' span').css('background-color', 'blue');
  else if (type == 'insertInitial')
    $('#tree-node-' + p + ' span').css('background-color', 'blue');

  $('#tree-node-' + p).children().find('span').css('background-color', 'white');
}

// -------------------
// Red Black BST functions
// ------------------- 

function RBNode(key) {
  this.key = key;
  this.left = null;
  this.right = null; 
  this.color = 'red';
}

function isRed(node) {
  if (node == null || node == 'black')
    return false;
  else //if (node.color == 'red')
    return true;
}

function rotateLeft(node) {
  var x = JSON.parse(JSON.stringify(node.right));
  node.right = JSON.parse(JSON.stringify(x.left));
  x.left = JSON.parse(JSON.stringify(node));
  x.color = node.color;
  x.left.color = 'red';
  return x;
}

function rotateRight(node) {
  var x = JSON.parse(JSON.stringify(node.left));
  node.left = JSON.parse(JSON.stringify(x.right));
  x.right = JSON.parse(JSON.stringify(node));
  x.color = node.color;
  x.right.color = 'red';
  return x;
}

function flipColors(node) {
  node.color = 'red';
  node.left.color = 'black';
  node.right.color = 'black';
}

// Inserts node into BST
function recursiveRBBSTPut(node, key) {
  // Key not found, return new node
  if (node == null) {
     return new RBNode(key);
  }

  var array = []; 
  array.push(JSON.stringify(bstRoot));
  array.push(node.key);
  array.push('swap');
  treeAnimationQueue.push(array.slice());
  array.pop();
  array.pop();

  // Key found
  if (node.key == key) {

  }

  // call recursion on left node
  if (key < node.key) {
    node.left = recursiveRBBSTPut(node.left, key);
  }

  // call recursion on right node 
  if (node.key < key) {
    node.right = recursiveRBBSTPut(node.right, key);
  }

  // rotate left if red link is on right instead of left
  if (isRed(node.right) && !isRed(node.left)) {
    node = rotateLeft(node);
  }

  // rotate right if two red left links in a row
  if (isRed(node.left) && isRed(node.left.left)) {
    node = rotateRight(node);
  }

  // flip colors if both left and right children are red
  if (isRed(node.left) && isRed(node.right)) {
    flipColors(node);
  }

  return node;
}

// Performs a deep copy of a red black BST into
// a new BST by recursively creating
// copies of each node
function copyBST(node) {
  if (node == null)
    return null;

  var newNode = new RBNode(node.key);
  newNode.color = node.color;
  newNode.left = copyBST(node.left);
  newNode.right = copyBST(node.right);

  return newNode;
}