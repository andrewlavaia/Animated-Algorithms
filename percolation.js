var matrix = [];
var unions = [];
var nodeCount = [];
var rows;
var cols;
var percIntervalTimer = 1000; 
var percNum = 0;

var visited = []; // matrix for DFS
var stack = []; // stack for DFS
var paths = []; // stores the stacks

secondToLastRow = 0;
secondToLastCol = 0;


$('input[name="perc-begin"]').on('click', function() {
  rows = parseInt($('input[name="perc-rows"]').val(), 10) + 2;
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
  visited.length = 0;
  stack.length = 0;
  paths.length = 0;
  percNum = 0;
  table.html('');

  // populate visited matrix for DFS
  colArray = newFilledArray(cols, 0);
  for (var i = 0; i < rows; i++) {
    visited.push(colArray.slice());
  }

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

      if (i != 0 && i != rows - 1) // don't draw first or last row
        table.append('<td id="perc-' + i + '-' + j + '"></td>');
    }
    matrix.push(rowArray.slice());
  }

  // open top and bottom rows
  for (var z = 0; z < cols; z++) {
    open(0, z);
    open(rows - 1, z);
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
      colorShortestPath();
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

function hasVisited(row, col) {
  return visited[row][col];
}

function colorShortestPath() {
  for (var j = 0; j < cols; j++) {
    if (isOpen(1, j) && !hasVisited (1, j)) {  
      BFS(1, j);
    }
  }

  for (var n = 0; n < paths[0].length; n++) {
    $('#perc-' + paths[0][n][0] + '-' + paths[0][n][1]).css("background-color", "green");
  }
}

// Finds shortest path from top to bottom in an MxN matrix
function BFS(row, col) {

  // needs to be re-populated each call
  visited.length = 0;
  var colArray = newFilledArray(cols, 0);
  for (var i = 0; i < rows; i++) {
    visited.push(colArray.slice());
  }

  var q = []; // queue
  q.push([row, col]);

  var parents = []; 
  // stores parent of each visited node
  // acts like a hash table that has a unique index for each node
  // which allows for O(1) lookup during path construction
  // key = (row * cols) + col, val = [parentRow, parentCol] 

  while (q.length > 0) {

    var cell = q.shift();
    row = cell[0];
    col = cell[1];

    if(!hasVisited(row, col)) {
      visited[row][col] = 1;
    }
    else {
      continue; // if already visited -> all paths from this node
                // must be longer, so no need to check them 
    }

    // if second to last row is open and connected then we are done 
    if (row == rows - 2 
      && isOpen(row, col)
      && isConnected(0, (row * cols) + col)) 
    {
      paths.push(getPathToParent(row, col, parents));
      
      // keep only shortest path
      if (paths.length == 1) {
        return;
      } 
      else if (paths[1].length < paths[0].length) {
        paths.shift(); // pop front 
        return;
      }
      else if (paths[0].length <= paths[1].length) {
        paths.pop(); // pop back
        return;
      }
      assert("unreachable");
    } 

    // check below
    if (row + 1 < rows
      && !hasVisited(row + 1, col)
      && isOpen(row + 1, col) 
      && isConnected(0, ((row + 1) * cols) + col)) 
    {
      q.push([row + 1, col]);
      parents[((row + 1) * cols) + col] = [row, col];
    }

     // check left
    if (col > 0 
      && row > 1  // no point checking first row for right/left
      && !hasVisited(row, col - 1)
      && isOpen(row, col - 1) 
      && isConnected(0, (row * cols) + col - 1)) 
    { 
      q.push([row, col - 1]);
      parents[(row * cols) + col - 1] = [row, col];
    }

    // check right
    if (col + 1 < cols
      && row > 1  // no point checking first row for right/left
      && !hasVisited(row, col + 1)
      && isOpen(row, col + 1) 
      && isConnected(0, (row * cols) + col + 1)) 
    { 
      q.push([row, col + 1]);
      parents[(row * cols) + col + 1] = [row, col];
    }

    // check above 
    if (row > 2     // check up only if at least third row
      && !hasVisited(row - 1, col)
      && isOpen(row - 1, col) 
      && isConnected(0, ((row - 1) * cols) + col)) 
    { 
      q.push([row - 1, col]);
      parents[((row - 1) * cols) + col] = [row, col];
    }

  }
}

function getPathToParent(row, col, parents) {
  var path = [];
  path.push([row, col]);
  while (row != 1) {
    // !!! parents array can definitely be further optimized
    // Goal: achieve O(1) retrievals 
    // store each entry into its own id in parents array
    // unique id = (row * cols) + col
    //console.log(parents[(row * cols) + col][0] + ", " + parents[(row * cols) + col][1]);
    var temp = row;
    row = parents[(row * cols) + col][0]; 
    col = parents[(temp * cols) + col][1]; 
    path.push([row, col]);
    /*
    for (i = parents.length - 1; i >= 0; i--) {
      if(row === parents[i][0] && col === parents[i][1]) {
        console.log(parents[i][2] + ", " + parents[i][3]);
        row = parents[i][2];
        col = parents[i][3];
        path.push([row, col]);
        break; // escape for loop once parent has been found
      }
    }
    */
  }
  return path;
}


// DFS is faster than BFS but doesn't always find shortest path
function DFS(row, col) {

  // if first visit to node, change status and push to stack
  if(!hasVisited(row, col)) {
    visited[row][col] = 1;
    stack.push([row, col]); 
  }

  if (stack.length > 3) {
    secondToLastRow = stack[stack.length - 3][0];
    secondToLastCol = stack[stack.length - 3][1];
    // console.log( secondToLastRow + ', ' + secondToLastCol)
  }

  // console.log(row + ', ' + col + ' - ' + stack);
  // console.log(row + ', ' + col);

  // if second to last row is open and connected then we are done
  if (row == rows - 2 
    && isOpen(row, col)
    && isConnected(0, (row * cols) + col)) 
  {
    // keep only shortest path
    if (paths.length > 0 && stack.length < paths[0].length) {
      paths.pop();
      paths.push(stack.slice());
      stack.pop();
      return;
    } 
    else if (paths.length == 0) {
      paths.push(stack.slice());
      stack.pop();
      return;    
    }
    else {
      stack.pop();
      return;
    }
  }

  // if node is open and connected, push node to stack and call DFS 

  // check below
  if (row + 1 < rows
    && !hasVisited(row + 1, col)
    && isOpen(row + 1, col) 
    && isConnected(0, ((row + 1) * cols) + col)) 
  { 
    DFS(row + 1, col);
  }

  // check left
  if (col > 0 
    && !hasVisited(row, col - 1)
    && isOpen(row, col - 1) 
    && isConnected(0, ((row) * cols) + col - 1)) 
  { 
    DFS(row, col - 1);
  }

  // check right
  if (col + 1 < cols
    && row > 1  
    && !hasVisited(row, col + 1)
    && isOpen(row, col + 1) 
    && isConnected(0, ((row) * cols) + col + 1)) 
  { 
    DFS(row, col + 1);
  }

  // check above 
  // only makes sense to check if at least third row
  // only go up if current node is not a diagonal jump away
  if (row > 2
    && !hasVisited(row - 1, col)
    && isOpen(row - 1, col) 
    && isConnected(0, ((row - 1) * cols) + col)
    && (secondToLastRow != row - 1 
      || (secondToLastCol != col - 1 && secondToLastCol != col + 1)))
  { 
    DFS(row - 1, col);
  }

  // no eligible nodes found, pop stack and return
  stack.pop();
  //visited[row][col] = 0;
  return;
}


