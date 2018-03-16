// Initially hide #union div
// $('#perc-wrapper').hide();

var matrix = [];
var unions = [];
var nodeCount = [];
var rows;
var cols;
var percIntervalTimer = 1000; 
var percNum = 0;

$('input[name="perc-begin"]').on('click', function() {
  rows = parseInt($('input[name="perc-rows"]').val(), 10);
  cols = parseInt($('input[name="perc-cols"]').val(), 10);
  percIntervalTimer = parseInt($('input[name="perc-animation-time"]').val(), 10);
  callPerc(rows, cols, percIntervalTimer);
});

function callPerc(rows, cols, pauseTime) {
  var rowArray = [];
  var table = $('#perc-table');

  // clear any previous data
  matrix.length = 0;
  unions.length = 0;
  nodeCount.length = 0;
  percNum = 0;
  table.html('');

  // create matrix and populate DOM
  for (var i = 0; i < rows; i++) {
    rowArray.length = 0;
    table.append('<tr></tr>');
    for (var j = 0; j < cols; j++) {
      rowArray.push(0);

      // create unique roots for top and bottom rows
      if (i == 0) {
        unions.push(0);
        nodeCount.push(cols);
      } else if (i == rows - 1) {
        unions.push(rows * cols - 1)
        nodeCount.push(cols);
      } else {
        unions.push((cols * i) + j);
        nodeCount.push(1);
      }

      table.append('<td id="perc-' + i + '-' + j + '"></td>')
    }
    matrix.push(rowArray.slice());
  }

  percIntervalTimer = drawPerc(pauseTime);
}

function drawPerc(pauseTime) {
  return setInterval(function() {

    // random union calls until percolation occurs
    if(!percolates()) {
      var row = Math.floor(Math.random() * rows);  // 0 through maxIntSize - 1
      var col = Math.floor(Math.random() * cols);  // 0 through maxIntSize - 1
      open(row, col);
      percNum++;
    } 
    else {
      clearInterval(percIntervalTimer);

      // !!! Should I use shortest path instead?
      
      // change color to all percolated nodes to green
      for(var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
          // change unions for top and bottom rows if not open

          //if (isOpen(i, j) && isConnected(0, (i * cols) + j)) {
          if (isConnected(0, (i * cols) + j)) {
            $('#perc-' + i + '-' + j).css("background-color", "green");
          }
        }
      }
    }
    
  }, pauseTime);

}

function open(row, col) {
  var cell = $('#perc-' + row + '-' + col);
  cell.css("background-color", "blue");

  matrix[row][col] = 1;

  // check top
  if (row > 0) {
    if (isOpen(row - 1, col) || row == 1) {
      createUnion((row * cols) + col, ((row - 1) * cols) + col);
    }
  }

  // check right
  if (col + 1 < cols) {
    if (isOpen(row, col + 1)) {
      createUnion((row * cols) + col, (row * cols) + col + 1);
    }
  }

  // check bottom
  if (row + 1 < rows) {
    if (isOpen(row + 1, col)  || row == rows - 2) {
      createUnion((row * cols) + col, ((row + 1) * cols) + col);
    }
  }

  // check left
  if (col - 1 >= 0) {
    if (isOpen(row, col - 1)) {
      createUnion((row * cols) + col, (row * cols) + col - 1);
    }
  }
}

function isOpen(row, col) {
  return matrix[row][col];
}

function createUnion(p, q) {
  var i = findRoot(p);
  var j = findRoot(q);

  // if roots are the same, p and q are already in the same set
  if (i == j) {
    return;
  }

  // move tree with less nodes into tree with more nodes
  if (nodeCount[i] < nodeCount[j]) {
    unions[i] = j;
    nodeCount[j] += nodeCount[i];
  }
  else {
    unions[j] = i;
    nodeCount[i] += nodeCount[j];
  }
}

function findRoot(p) {
  while (p != unions[p]) {
    unions[p] = unions[unions[p]]; // skip a level and check grandparent 
    p = unions[p];
  }
  return p;
}

function isConnected(p, q) {
  return findRoot(p) == findRoot(q);
}

function percolates() {
  // check if first node is connected to last node
  return isConnected(0, (rows * cols) - 1);
}


