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
  $('.tree').html('<ul class="top-level"></ul>'); // create first ul for root
  clearInterval(treeIntervalTimer);
  treeAnimationQueue.length = 0;

  // Create an empty array
  var array = [];
  array.push(0); // add first item so that index starts at 1
  for (var i = 0; i < numNodes; i++) {
    var p = Math.floor(Math.random() * 1000);  // 0 through 1000 - 1

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
    if (treeAnimationQueue.length > 0) {
      var p = treeAnimationQueue[0].pop(); // grab p
      var array = treeAnimationQueue[0].slice(); // copy array
      array.shift(); // get rid of original 0 

      treeCallNum++;
      $('#tree-header').html('#' + treeCallNum + ' : insert( ' + p + ' )');

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
      clearInterval(treeIntervalTimer);
    }
  }, pauseTime);
}


function insertNodeHeap(array, p) {
  array.push(p);
  heapSwim(array, array.length - 1); // swim last element
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

function heapDrawTree(array, p, pauseTime) {
  
  $('#tree-layers .tree').html('');
  $('#tree-layers .tree').append(
    '<ul class="top-level"><li id="tree-node-' + array[0] + '">' +
    '<span>' + array[0] + '</span>' +
    '</li></ul>');
  
  var parent = 0;
  for (var k = 1; k < array.length - 1; k++) {
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
}

function heapAnimateP(array, p, animationTime) {
  var pNode = $('#tree-node-' + p).parent(); 
  var qNode = $('#tree-node-' + array[0]);

  var pOffset = pNode.children().offset(); // current position of pNode

  // clone pNode and color red to show animation
  var temp = pNode.clone().appendTo('.tree'); // so that it has the tree class
  temp.css({
    'position': 'absolute',
    'left': pOffset.left,
    'top': pOffset.top,
    'z-index': 1000
  });
  temp.find('span').css({
    'background-color': 'red',
  });

  // color both nodes blue 
  qNode.children('span').css({
    'background-color': 'blue',
  });
  pNode.find('span').css({
    'background-color': 'blue',
  });

  // determine final position
  if (qNode.children().length == 1) {
    qNode.append('<ul>' + pNode.html() + '</ul>');
  } else {
    qNode.children('ul').append(pNode.html());
  }
  var newOffset = qNode.children('ul').offset();
  newOffset.left = newOffset.left + qNode.children('ul').width() - pNode.children().width() - 15;
  newOffset.top = newOffset.top + 10;

  // hide final position until animation is complete
  qNode.find('#node-' + p).hide();

  // animate temp clone moving from original to final position
  temp.animate({'top': newOffset.top, 'left': newOffset.left}, animationTime/2, function(){
    qNode.find('#node-' + p).show();  // show element in final position
    pNode.remove();                   // delete original element
    temp.remove();                    // delete animation element
    qNode.find('span').css({
      'background-color': 'white',
    });
  });
}
