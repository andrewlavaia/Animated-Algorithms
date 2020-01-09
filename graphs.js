var graph;
var numVertices;
var graphIntervalTimer = 1000; 
var graphAnimationQueue = [];

$('input[name="create-graph"]').on('click', function() {
  numVertices = parseInt($('#graph-vertices').val(), 10);
  createGraph(numVertices);
});

$('input[name="graph-begin"]').on('click', function() {
  graphIntervalTimer = parseInt($('#graph-animation-time').val(), 10);
  solveGraph(graph, $('select[name="graph-select"]').val(), graphIntervalTimer);
});

var PriorityQueue = function () {
	function PriorityQueue() {
		_classCallCheck(this, PriorityQueue);
		this.pq = [];
		this.pq.push(0);  // keep index 0 free
		this.size = 0;
	}

	PriorityQueue.prototype.less = function less(i, j) {
		return this.pq[i] < this.pq[j];
	}

	PriorityQueue.prototype.pop = function pop(value) {
		var min = pq[1];
		this.swap(1, this.size);
		this.size--;
		this.pq.pop();
		this.sinkDown(1);
		return min;
	}

	PriorityQueue.prototype.push = function push(value) {
		var index = this.pq.length;
		this.pq.push(value);
		this.size++;
		this.swimUp(index);
	}

	PriorityQueue.prototype.sinkDown = function sinkDown(k) {
		while (2 * k <= this.size) {
			var j = 2 * k;
			if (j < this.size && this.less(j + 1, j))
				j++;
			if (!this.less(j, k))
				break;
			this.swap(k, j);
			k = j;
		}
	}

	PriorityQueue.prototype.swap = function swap(i, j) {
		var tmp = this.pq[i];
		this.pq[i] = this.pq[j];
		this.pq[j] = tmp;
	}

	PriorityQueue.prototype.swimUp = function swimUp(k) {
		while (k > 1 && this.less(k, Math.floor(k / 2))){
			this.swap(Math.floor(k / 2), k);
			k = Math.floor(k / 2);
		}
	}

	return PriorityQueue;
}();

var Graph = function () {
	function Graph(numVertices) {
		_classCallCheck(this, Graph);

		this.adj = [];
		this.visited = [];
		this.edgeCnt = 0;
		this.vertexCnt = 0;
		this.rows = rows;
		this.cols = cols;
		for (var i = 0; i < numVertices; i++) {
			this.adj[i] = [];
			this.visited[i] = 0;
			this.vertexCnt++;
		}
	}

	Graph.prototype.addEdge = function addEdge(v, w) {
		if (this.adj[v].indexOf(w) == -1) {
			// edge does not exist yet 
			this.adj[v].push(w);
			this.adj[w].push(v);
			this.edgeCnt++;
		}
	};

	Graph.prototype.removeEdge = function removeEdge(v, w) {
		if (this.adj[v].indexOf(w) > -1) {
			this.adj[v].splice(this.adj[v].indexOf(w), 1);
			this.adj[w].splice(this.adj[w].indexOf(v), 1);
		}
	};

	Graph.prototype.getEdges = function getEdges(v) {
		return this.adj[v];
	};

	Graph.prototype.getRandEdge = function getRandEdge(v) {
		var len = this.adj[v].length;
		if (len == 0) 
			return false;
		else 
			return this.adj[v][Math.floor(Math.random() * len)];
	};

	Graph.prototype.getV = function getV(row, col) {
		return row * cols + col;
	};

	Graph.prototype.getRow = function getRow(v) {
		return parseInt(v / cols, 10);
	};

	Graph.prototype.getCol = function getCol(v) {
		return v % cols;
	};

	Graph.prototype.up = function up(row, col) {
		if (row > 0) return this.getV(row - 1, col);else return false;
	};

	Graph.prototype.left = function left(row, col) {
		if (col > 0) return this.getV(row, col - 1);else return false;
	};

	Graph.prototype.right = function right(row, col) {
		if (col < this.cols - 1) return this.getV(row, col + 1);else return false;
	};

	Graph.prototype.down = function down(row, col) {
		if (row < this.rows - 1) return this.getV(row + 1, col);else return false;
	};

	Graph.prototype.hasVisited = function hasVisited(row, col) {
		return visited[this.getV(row, col)];
	};

	Graph.prototype.getUnvisitedNeighbor = function getUnvisitedNeighbor(v) {
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

	Graph.prototype.getUnvisitedEdgeCnt = function getUnvisitedEdgeCnt(v) {
		var cnt = 0;
		var len = this.adj[v].length;
		for (var i = 0; i < len; i++) {
			if (!this.visited[this.adj[v][i]]) 
				cnt++;
		}
		return cnt;
	};

	return Graph;
}();

function createGraph(numVertices) {
    graph = new Graph(numVertices);

    var layer = $('#graph-layer');
    layer.html('');
    for (var i = 0; i < numVertices; i++){
        layer.append('<div id="graph-' + i + '"></div>');
        $('#graph-' + i).addClass('graph-vertex').css({
            "left": Math.random() * layer.width() + layer.position().left,
            "top": Math.random() * layer.height() + layer.position().top,
        })
    }
}

function dijkstra(graph, start, end) {
	var pq = new PriorityQueue();
	var sources = []; // adjacency array that stores where the vertex was accessed from
	sources.length = graph.vertexCnt;

	for (var i = 0; i < graph.getEdges(start).length; i++) {
		pq.push(graph.adj[start][i]);  // TODO Add distance value 
		sources[graph.adj[start][i]] = start;
	}
	graph.visited[start] = 1;

	while (pq.size != 0) {
		var v = pq.pop();
		graph.visited[v] = 1;

		if (graph.visited[end] === 1) {
			var v = sources[end];
			while (v !== start) {
				if (graphIntervalTimer === 0)
					colorV(graph, v, start, end, 'unvisited'); 
				else 
					graphAnimationQueue.push([v, false, start, end, 'unvisited']);

				v = sources[v];
			}
			return;
		}
		
		if (graphIntervalTimer === 0)
			colorV(graph, v, start, end, 'visited'); 
		else 
			graphAnimationQueue.push([v, false, start, end, 'visited']);

		for (var i = 0; i < maze.getEdges(v).length; i++) {
			var cnt = 0;
			if (!maze.visited[maze.adj[v][i]]) {
				pq.push(maze.adj[v][i]);  // TODO Add distance value 
				sources[maze.adj[v][i]] = v;
				cnt++;
			}
		}
	}	
	/*
	var paths = [];
	var pathsDistance = [];
	var pq = [];
	
	for (var i = 0; i < self.rows * self.cols; i++) {
		pathsDistance[i] = Infinity;
	}
	pathsDistance[start] = 0;

	while (pq.length != 0) {
		var distance, vertexNum;
		[distance, vertexNum] = pq.pop();
		vertex = maze.vertices[vertexNum];
		relaxEdges(maze, vertex);
	}
	*/
}


function solveGraph(graph, graphAlgo, pauseTime) {
    clearInterval(graphIntervalTimer);
    if (!graph) {
        return;
    }
  
    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < cols; j++) {
          graph.visited[graph.getV(i, j)] = 0;
        $('#graph-' + i + '-' + j).css("background-color", "white");
      }
    }
  
    var start = Math.floor(Math.random() * graph.vertexCnt);
    var end = Math.floor(Math.random() * graph.vertexCnt);
    var start_el = '#graph-' + start;
    var end_el = '#graph-' + end;
    $(start_el).css("background-color", "rgba(255, 0, 0, 0.3)");
    $(end_el).css("background-color", "rgba(0, 255, 0, 0.3)");
    if (graphAlgo == 'graph-dijkstra')
        dijkstra(graph, start, end);
    graphIntervalTimer = drawSolveGraph(pauseTime, graphAlgo);
}

function drawSolveGraph(pauseTime, graphAlgo) {
    return setInterval(function() {
        if (graphAnimationQueue.length > 0) {
            var data = graphAnimationQueue.shift();
            colorV(graph, data[0], data[2], data[3], data[4]);

            // display final solution for dijkstra instantly
            while (graphAnimationQueue.length > 0 && 
                    graphAlgo === 'graph-dijkstra' && 
                    data[4] === 'unvisited') {
                var data = graphAnimationQueue.shift();
                colorV(maze, data[0], data[2], data[3], data[4]);
            }
        }
        else {
            clearInterval(graphIntervalTimer);
        }
    
    }, pauseTime);
}