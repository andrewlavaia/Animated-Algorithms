// Add a way to create mazes
	// needs a list of vertices and all their connected edges
// add a way to solve the maze using BFS and DFS
// animate BFS and DFS (current path should be one color, 
//		visited nodes should become grayed out, final path
//		should be colored another color)

var rows;
var cols;
var searchIntervalTimer = 1000; 
var maze;

$('input[name="create-maze"]').on('click', function() {
  rows = parseInt($('#search-rows').val(), 10);
  cols = parseInt($('#search-cols').val(), 10);
  searchIntervalTimer = parseInt($('#search-animation-time').val(), 10);
  createMaze(rows, cols, searchIntervalTimer);
});

$('input[name="search-begin"]').on('click', function() {
  rows = parseInt($('#search-rows').val(), 10) + 2;
  cols = parseInt($('#search-cols').val(), 10);
  searchIntervalTimer = parseInt($('#search-animation-time').val(), 10);
  callSearch(rows, cols, searchIntervalTimer);
});

class Vertex {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

class Graph {
	constructor(rows, cols) {
		this.adj = [];
		this.visited = [];
		this.edgeCnt = 0;
		this.vertexCnt = 0;
		this.rows = rows;
		this.cols = cols;
		for (var i = 0; i < rows*cols; i++) {
			this.adj[i] = [];
			this.visited[i] = 0;
			this.vertexCnt++;
		}
	}

	addEdge(v, w) {
		if (this.adj[v].indexOf(w) == -1) { // edge does not exist yet 
			this.adj[v].push(w);
			this.adj[w].push(v);
			this.edgeCnt++;
		}
	}

	removeEdge(v, w) {
		if (this.adj[v].indexOf(w) > -1) {
			this.adj[v].splice(this.adj[v].indexOf(w), 1);
			this.adj[w].splice(this.adj[w].indexOf(v), 1);
		}
	}

	getEdges(v) {
		return this.adj[v];
	}

	getRandEdge(v) {
		var len = this.adj[v].length;
		if (len == 0)
			return -1;
		else
			return this.adj[v][Math.floor(Math.random() * len)]  
	}

	getV(row, col) {
		return (row * cols) + col;
	}
	up(row, col) {
		if (row > 0)
			return this.getV(row - 1, col);
		else 
			return false;
	} 
	left(row, col) {
		if (col > 0)
			return this.getV(row, col - 1);
		else
			return false;
	}
	right(row, col) {
		if (col < this.cols - 1)
			return this.getV(row, col + 1);
		else 
			return false;
	}
	down(row, col) {
		if (row < this.rows - 1)
			return this.getV(row + 1, col);
		else
			return false;
	}

	hasVisited(row, col) {
		return visited[this.getV(row, col)];
	}

}

// g = new Graph(5,5);
// g.addEdge(g.getV(0,0), g.getV(0,1));
// console.log(g.getEdges(g.getV(0,0)));
// console.log(g.getEdges(g.getV(0,1)));
// g.addEdge(g.getV(0,1), g.getV(0,0));
// console.log(g.getEdges(g.getV(0,0)));
// console.log(g.getEdges(g.getV(0,1)));


function createMaze(rows, cols, pauseTime) {
  clearInterval(searchIntervalTimer);

  maze = new Graph(rows, cols);

  var table = $('#search-table');
	// var rowArray = [];
	// start = new Vertex(0, 0);
	// end = new Vertex(rows - 1, cols - 1);

	// create matrix and populate DOM
  for (var i = 0; i < rows; i++) {
    // rowArray.length = 0;
    table.append('<tr></tr>');
    for (var j = 0; j < cols; j++) {
      // rowArray.push(new Vertex(i, j));	

      table.append('<td id="search-' + i + '-' + j + '"></td>');
      $('#search-' + i + '-' + j).css("border-top", "1px solid black");
      $('#search-' + i + '-' + j).css("border-left", "1px solid black");
      $('#search-' + i + '-' + j).css("border-bottom", "1px solid black");
      $('#search-' + i + '-' + j).css("border-right", "1px solid black");

    	if (maze.left(i,j) != false) 
      	maze.addEdge(maze.getV(i, j), maze.left(i, j));
      if (maze.up(i,j) != false)
     		maze.addEdge(maze.getV(i, j), maze.up(i, j));
      if (maze.right(i,j) != false)
      	maze.addEdge(maze.getV(i, j), maze.right(i, j));
      if (maze.down(i,j) != false)
      	maze.addEdge(maze.getV(i, j), maze.down(i, j));
      
     	// else if (i == 0 && j == 0) {
     	// 	maze.addEdge(maze.getV(i, j), maze.right(i, j));
	     //  maze.addEdge(maze.getV(i, j), maze.down(i, j));
     	// }
     	// else if (i == 0 && j == cols - 1) {
     	// 	maze.addEdge(maze.getV(i, j), maze.left(i, j));
	     //  maze.addEdge(maze.getV(i, j), maze.down(i, j));
     	// }
     	// else if (i == 0) {
     	// 	maze.addEdge(maze.getV(i, j), maze.left(i, j));
	     //  maze.addEdge(maze.getV(i, j), maze.down(i, j));
     	// }     	
     	// else if (i == rows - 1 && j == 0) {
     	// 	maze.addEdge(maze.getV(i, j), maze.right(i, j));
	     //  maze.addEdge(maze.getV(i, j), maze.up(i, j));
     	// }     	
     	// else if (i == rows - 1 && j == cols - 1) {
     	// 	maze.addEdge(maze.getV(i, j), maze.left(i, j));
	     //  maze.addEdge(maze.getV(i, j), maze.up(i, j));
     	// }
	
      // $('#search-' + i + '-' + j).css("border-top", "1px solid black");
      // if (i == rows - 1) {
      // 	// $('#search-' + i + '-' + j).css("border-bottom", "1px solid black");
      // }
      // if (j == 0) {
      // 	// $('#search-' + i + '-' + j).css("border-left", "1px solid black");
      // } 
      // if (j == cols - 1) {
      // 	// $('#search-' + i + '-' + j).css("border-right", "1px solid black");
      // }

      // // Start
      // if (i == start.x && j == start.y) {
      // 	$('#search-' + i + '-' + j).css("border-left", "0px");
      // } 

      // // End
      // if (i == end.x && j == end.y) {
      // 	$('#search-' + i + '-' + j).css("border-right", "0px");
      // }

    }
    // matrix.push(rowArray.slice());

  }

  // console.log(maze.visited);
  // console.log(maze.getEdges(maze.getV(0,0)));
  // maze.removeEdge(maze.getV(0,0), maze.getV(1,0));
  // console.log(maze.getEdges(maze.getV(0,0)));
  // console.log(maze.getEdges(maze.getV(1,0)));
  // console.log(maze.getRandomEdge(maze.getV(0,0)));
  // console.log(maze.getEdges(rows*cols));
  searchIntervalTimer = drawMaze(pauseTime);
}

function recurseMaze(maze, v) {
	visted[v] = 1;
	w = maze.getRandEdge(v);
	if (w != -1) {
		maze.removeEdge(v, w);
		recurseMaze(maze, w);
	}

}

function callSearch(rows, cols, pauseTime) {
  clearInterval(searchIntervalTimer);
  searchIntervalTimer = drawSearch(pauseTime);
}

function drawMaze(pauseTime) {
  return setInterval(function() {

  	console.log('creating maze one cell at a time');
    
  }, pauseTime);

}

function drawSearch(pauseTime) {
  return setInterval(function() {

  	console.log('drawing maze one cell at a time');
    
  }, pauseTime);

}

