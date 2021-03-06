var maze;
var rows;
var cols;
var searchIntervalTimer = 1000; 
var searchAnimationQueue = [];

$('input[name="create-maze"]').on('click', function() {
  rows = parseInt($('#search-rows').val(), 10);
  cols = parseInt($('#search-cols').val(), 10);
  searchIntervalTimer = parseInt($('#maze-creation-animation-time').val(), 10);
  createMaze(rows, cols, searchIntervalTimer);
});

$('input[name="search-begin"]').on('click', function() {
  searchIntervalTimer = parseInt($('#search-animation-time').val(), 10);
  solveMaze(maze, $('select[name="search-select"]').val(), searchIntervalTimer);
});

// class Grid {
// 	constructor(rows, cols) {
// 		this.adj = [];
// 		this.visited = [];
// 		this.edgeCnt = 0;
// 		this.vertexCnt = 0;
// 		this.rows = rows;
// 		this.cols = cols;
// 		for (var i = 0; i < rows*cols; i++) {
// 			this.adj[i] = [];
// 			this.visited[i] = 0;
// 			this.vertexCnt++;
// 		}
// 	}

// 	addEdge(v, w) {
// 		if (this.adj[v].indexOf(w) == -1) { // edge does not exist yet 
// 			this.adj[v].push(w);
// 			this.adj[w].push(v);
// 			this.edgeCnt++;
// 		}
// 	}

// 	removeEdge(v, w) {
// 		if (this.adj[v].indexOf(w) > -1) {
// 			this.adj[v].splice(this.adj[v].indexOf(w), 1);
// 			this.adj[w].splice(this.adj[w].indexOf(v), 1);
// 		}
// 	}

// 	getEdges(v) {
// 		return this.adj[v];
// 	}

// 	getRandEdge(v) {
// 		var len = this.adj[v].length;
// 		if (len == 0)
// 			return false;
// 		else
// 			return this.adj[v][Math.floor(Math.random() * len)]  
// 	}

// 	getV(row, col) {
// 		return (row * cols) + col;
// 	}
// 	getRow(v) {
// 		return parseInt(v / cols, 10);
// 	}
// 	getCol(v) {
// 		return v % cols;
// 	}
// 	up(row, col) {
// 		if (row > 0)
// 			return this.getV(row - 1, col);
// 		else 
// 			return false;
// 	} 
// 	left(row, col) {
// 		if (col > 0)
// 			return this.getV(row, col - 1);
// 		else
// 			return false;
// 	}
// 	right(row, col) {
// 		if (col < this.cols - 1)
// 			return this.getV(row, col + 1);
// 		else 
// 			return false;
// 	}
// 	down(row, col) {
// 		if (row < this.rows - 1)
// 			return this.getV(row + 1, col);
// 		else
// 			return false;
// 	}
// 	hasVisited(row, col) {
// 		return visited[this.getV(row, col)];
// 	}
// 	getUnvisitedNeighbor(v) {
// 		var neighbors = [];
// 		var x = this.getRow(v);
// 		var y = this.getCol(v);

// 		if (this.right(x, y) && !this.visited[this.right(x, y)])
// 			neighbors.push(this.right(x, y));
// 		if (this.up(x, y) && !this.visited[this.up(x, y)])
// 			neighbors.push(this.up(x, y));
// 		if (this.left(x, y) && !this.visited[this.left(x, y)]) 
// 			neighbors.push(this.left(x, y));
// 		if (this.down(x, y) && !this.visited[this.down(x, y)])  
// 			neighbors.push(this.down(x, y));

// 		if (neighbors.length == 0) 
// 			return false;
		
// 		return neighbors[Math.floor(Math.random() * neighbors.length)];
// 	}
// }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Grid = function () {
	function Grid(rows, cols) {
		_classCallCheck(this, Grid);

		this.adj = [];
		this.visited = [];
		this.edgeCnt = 0;
		this.vertexCnt = 0;
		this.rows = rows;
		this.cols = cols;
		for (var i = 0; i < rows * cols; i++) {
			this.adj[i] = [];
			this.visited[i] = 0;
			this.vertexCnt++;
		}
	}

	Grid.prototype.addEdge = function addEdge(v, w) {
		if (this.adj[v].indexOf(w) == -1) {
			// edge does not exist yet 
			this.adj[v].push(w);
			this.adj[w].push(v);
			this.edgeCnt++;
		}
	};

	Grid.prototype.removeEdge = function removeEdge(v, w) {
		if (this.adj[v].indexOf(w) > -1) {
			this.adj[v].splice(this.adj[v].indexOf(w), 1);
			this.adj[w].splice(this.adj[w].indexOf(v), 1);
		}
	};

	Grid.prototype.getEdges = function getEdges(v) {
		return this.adj[v];
	};

	Grid.prototype.getRandEdge = function getRandEdge(v) {
		var len = this.adj[v].length;
		if (len == 0) 
			return false;
		else 
			return this.adj[v][Math.floor(Math.random() * len)];
	};

	Grid.prototype.getV = function getV(row, col) {
		return row * cols + col;
	};

	Grid.prototype.getRow = function getRow(v) {
		return parseInt(v / cols, 10);
	};

	Grid.prototype.getCol = function getCol(v) {
		return v % cols;
	};

	Grid.prototype.up = function up(row, col) {
		if (row > 0) return this.getV(row - 1, col);else return false;
	};

	Grid.prototype.left = function left(row, col) {
		if (col > 0) return this.getV(row, col - 1);else return false;
	};

	Grid.prototype.right = function right(row, col) {
		if (col < this.cols - 1) return this.getV(row, col + 1);else return false;
	};

	Grid.prototype.down = function down(row, col) {
		if (row < this.rows - 1) return this.getV(row + 1, col);else return false;
	};

	Grid.prototype.hasVisited = function hasVisited(row, col) {
		return visited[this.getV(row, col)];
	};

	Grid.prototype.getUnvisitedNeighbor = function getUnvisitedNeighbor(v) {
		var neighbors = [];
		var x = this.getRow(v);
		var y = this.getCol(v);

		if (this.right(x, y) && !this.visited[this.right(x, y)]) neighbors.push(this.right(x, y));
		if (this.up(x, y) && !this.visited[this.up(x, y)]) neighbors.push(this.up(x, y));
		if (this.left(x, y) && !this.visited[this.left(x, y)]) neighbors.push(this.left(x, y));
		if (this.down(x, y) && !this.visited[this.down(x, y)]) neighbors.push(this.down(x, y));

		if (neighbors.length == 0) 
			return false;

		return neighbors[Math.floor(Math.random() * neighbors.length)];
	};

	Grid.prototype.getUnvisitedEdgeCnt = function getUnvisitedEdgeCnt(v) {
		var cnt = 0;
		var len = this.adj[v].length;
		for (var i = 0; i < len; i++) {
			if (!this.visited[this.adj[v][i]]) 
				cnt++;
		}
		return cnt;
	};

	return Grid;
}();

function createMaze(rows, cols, pauseTime) {
  clearInterval(searchIntervalTimer);
  searchAnimationQueue.length = 0;
  maze = new Grid(rows, cols);
  var table = $('#search-table');
  table.html('');

  for (var i = 0; i < rows; i++) {
    table.append('<tr></tr>');
    for (var j = 0; j < cols; j++) {
      table.append('<td id="search-' + i + '-' + j + '"></td>');
      $('#search-' + i + '-' + j).css("border-top", "1px solid black");
      $('#search-' + i + '-' + j).css("border-left", "1px solid black");
      $('#search-' + i + '-' + j).css("border-bottom", "1px solid black");
      $('#search-' + i + '-' + j).css("border-right", "1px solid black");
    }
  }

  recurseMaze(maze, 0);
  searchIntervalTimer = drawMaze(pauseTime);	
}

function recurseMaze(maze, v) {
	maze.visited[v] = 1;
	w = maze.getUnvisitedNeighbor(v);
	while (w !== false) {
		maze.addEdge(v, w);
		if (searchIntervalTimer === 0)
			removeBorder(maze, v, w);
		else
			searchAnimationQueue.push([v, w]); 
		recurseMaze(maze, w);
		w = maze.getUnvisitedNeighbor(v);
	}
}

function removeBorder(maze, v, w) {
	var v_el = '#search-' + maze.getRow(v) + '-' + maze.getCol(v);
	var w_el = '#search-' + maze.getRow(w) + '-' + maze.getCol(w);
	var vx = maze.getRow(v);
	var vy = maze.getCol(v);
	
	if (maze.right(vx, vy) === w) {
		$(v_el).css("border-right", "none");
		$(w_el).css("border-left", "none");
	} 
	else if (maze.up(vx, vy) === w) {
		$(v_el).css("border-top", "none");
		$(w_el).css("border-bottom", "none");
	}
	else if (maze.left(vx, vy) === w) {
		$(v_el).css("border-left", "none");
		$(w_el).css("border-right", "none");
	}
	else if (maze.down(vx, vy) === w) {
		$(v_el).css("border-bottom", "none");
		$(w_el).css("border-top", "none");
	}

}

function solveMaze(maze, searchAlgo, pauseTime) {
  clearInterval(searchIntervalTimer);
  if (!maze) {
  	return;
  }

  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
    	maze.visited[maze.getV(i, j)] = 0;
      $('#search-' + i + '-' + j).css("background-color", "white");
    }
  }

  var start = Math.floor(Math.random() * maze.vertexCnt);
  var end = Math.floor(Math.random() * maze.vertexCnt);
  var start_el = '#search-' + maze.getRow(start) + '-' + maze.getCol(start);
	var end_el = '#search-' + maze.getRow(end) + '-' + maze.getCol(end);
	$(start_el).css("background-color", "rgba(255, 0, 0, 0.3)");
	$(end_el).css("background-color", "rgba(0, 255, 0, 0.3)");

	if (searchAlgo == 'search-dfs')
		mazeDFS(maze, start, start, end);
	else if (searchAlgo == 'search-bfs')
		mazeBFS(maze, start, end);
  searchIntervalTimer = drawSearch(pauseTime, searchAlgo);
}

function mazeDFS(maze, v, start, end) {
	maze.visited[v] = 1;
	for (var i = 0; i < maze.getEdges(v).length; i++) {
		if (maze.visited[end])
			return;
		var w = maze.adj[v][i];
		if (!maze.visited[w]) {
			if (searchIntervalTimer === 0)
				colorV(maze, v, start, end, 'unvisited');
			else
				searchAnimationQueue.push([v, w, start, end, 'unvisited']);
			mazeDFS(maze, w, start, end);
		} 
	}
	if (!maze.visited[end]) {
		if (searchIntervalTimer === 0) 
			colorV(maze, v, start, end, 'visited');
		else 
			searchAnimationQueue.push([v, w, start, end, 'visited']);
	}
}

function mazeBFS(maze, start, end) {
	var q = [];
	var sources = []; // adjacency array that stores where the vertex was accessed from
	sources.length = maze.vertexCnt;

	for (var i = 0; i < maze.getEdges(start).length; i++) {
		q.push(maze.adj[start][i]);
		sources[maze.adj[start][i]] = start;
	}
	maze.visited[start] = 1;

	while (q.length != 0) {
		var v = q.shift();
		maze.visited[v] = 1;

		if (maze.visited[end] === 1) {
			var v = sources[end];
			while (v !== start) {
				if (searchIntervalTimer === 0)
					colorV(maze, v, start, end, 'unvisited'); 
				else 
					searchAnimationQueue.push([v, false, start, end, 'unvisited']);

				v = sources[v];
			}
			return;
		}
		
		if (searchIntervalTimer === 0)
			colorV(maze, v, start, end, 'visited'); 
		else 
			searchAnimationQueue.push([v, false, start, end, 'visited']);

		for (var i = 0; i < maze.getEdges(v).length; i++) {
			var cnt = 0;
			if (!maze.visited[maze.adj[v][i]]) {
				q.push(maze.adj[v][i]);
				sources[maze.adj[v][i]] = v;
				cnt++;
			}
		}
	}
}

function colorV(maze, v, start, end, type) {
	if (v === start || v === end)
		return;
	var v_el = '#search-' + maze.getRow(v) + '-' + maze.getCol(v);
	if (type === 'unvisited') 
		$(v_el).css("background-color", "rgba(0, 0, 255, 0.3)");		
	else
		$(v_el).css("background-color", "rgba(0, 0, 0, 0.10)");
}

function drawMaze(pauseTime) {
  return setInterval(function() {
	  if (searchAnimationQueue.length > 0) {
	  	var data = searchAnimationQueue.shift();
	    removeBorder(maze, data[0], data[1]);
	  } 
	  else {
	    clearInterval(searchIntervalTimer);
	  }
  }, pauseTime);
}

function drawSearch(pauseTime, searchAlgo) {
  return setInterval(function() {
  	if (searchAnimationQueue.length > 0) {
  		var data = searchAnimationQueue.shift();
  		colorV(maze, data[0], data[2], data[3], data[4]);

  		// display final solution for BFS instantly
  		while (searchAnimationQueue.length > 0 && 
  				searchAlgo === 'search-bfs' && 
  				data[4] === 'unvisited') {
  			var data = searchAnimationQueue.shift();
  			colorV(maze, data[0], data[2], data[3], data[4]);
  		}
  	}
  	else {
  		clearInterval(searchIntervalTimer);
  	}
    
  }, pauseTime);

}

