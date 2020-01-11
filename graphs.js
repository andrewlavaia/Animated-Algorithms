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
		this.pq.push([0, -1]);  // keep index 0 free
		this.size = 0;
	}

	PriorityQueue.prototype.less = function less(i, j) {
		return this.pq[i][0] < this.pq[j][0];
	}

	PriorityQueue.prototype.pop = function pop() {
		var min = this.pq[1];
		this.swap(1, this.size);
		this.size--;
		this.pq.pop();
		this.sinkDown(1);
		return min[1];
	}

	PriorityQueue.prototype.push = function push(value, id) {
		var index = this.pq.length;
		this.pq.push([value, id]);
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

var Vertex = function() {
    function Vertex(index, x, y) {
        _classCallCheck(this, Vertex);
        this.index = index;
        this.x = x;
        this.y = y;
    }

    return Vertex;
}();

var Edge = function() {
    function Edge(v, w) {
        _classCallCheck(this, Edge);
        this.source = v;
        this.dest = w;
        this.distance = distance(v, w);
    }

    return Edge;
}();

var Graph = function () {
	function Graph(numVertices, width, height) {
		_classCallCheck(this, Graph);

        this.vertices = [];
		this.adj = [];
        this.visited = [];
        this.distances = [];
		this.edgeCnt = 0;
        this.vertexCnt = 0;
		for (var i = 0; i < numVertices; i++) {
            var x = Math.random() * width;
            var y = Math.random() * height;
            this.vertices[i] = new Vertex(i, x, y);
			this.adj[i] = [];
            this.visited[i] = 0;
            this.distances[i] = 100000000000;
			this.vertexCnt++;
        }

        // Create Nearest Neighbor graph
        // NP hard, brute force for now
        for (var i = 0; i < numVertices; i++) {
            vertex = this.vertices[i];
            nearest_neighbors = this.getNearestNeighbors(vertex);
            this.addEdge(vertex, nearest_neighbors[0]);
            this.addEdge(vertex, nearest_neighbors[1]);
        }
	}

	Graph.prototype.addEdge = function addEdge(v, w) {
		if (this.adj[v.index].indexOf(w.index) == -1) {
			// edge does not exist yet 
			this.adj[v.index].push(new Edge(v, w));
            this.adj[w.index].push(new Edge(w, v));
			this.edgeCnt++;
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

	Graph.prototype.getPosition = function getPosition(v) {
		return row * cols + col;
	};

	Graph.prototype.hasVisited = function hasVisited(v) {
		return visited[i];
    };

	Graph.prototype.getNearestNeighbors = function getNearestNeighbors(vertex) {
        // Brute force approach for 2 nearest neighbors
        var min_dist1 = 1000000000;
        var min_dist2 = 1000000000;
        var min_index1 = null;
        var min_index2 = null;
        for (var i = 0; i < this.vertexCnt; i++) {
            other = this.vertices[i];
            if (vertex === other)
                continue;
            var dist = distance(vertex, other);
            if (dist < min_dist1) {
                min_dist2 = min_dist1;
                min_index2 = min_index1;
                min_dist1 = dist;
                min_index1 = i;
            }
            else if (dist < min_dist2) {
                min_dist2 = dist;
                min_index2 = i;
            }
        }
        var neighbor1 = this.vertices[min_index1];
        var neighbor2 = this.vertices[min_index2];
        return [neighbor1, neighbor2];
	}

	return Graph;
}();

function createGraph(numVertices) {
    var layer = $('#graph-layer');
    var width = layer.width();
    var height = layer.height();
    graph = new Graph(numVertices, width, height);

    layer.html('');
    for (var i = 0; i < numVertices; i++){
        layer.append('<div id="graph-' + i + '"></div>');
        $('#graph-' + i).addClass('graph-vertex').css({
            "left": graph.vertices[i].x + layer.position().left,
            "top": graph.vertices[i].y + layer.position().top, 
        });
    
        var edges = graph.adj[i];
        for (var j = 0; j < edges.length; j++) {
            drawEdge(layer, edges[j]);
        }    
    }
}

function drawEdge(layer, edge) {
    var line = $('<div class="graph-edge"></div>');
    var circle_radius = 5;
    line.css({
        "left": edge.source.x + layer.position().left + circle_radius,
        "top": edge.source.y + layer.position().top + circle_radius,
        "width": edge.distance,
        "transform": 'rotate(' + Math.atan2((edge.dest.y - edge.source.y), (edge.dest.x - edge.source.x)) + 'rad)'
    });
    layer.append(line);
}

function distance(v1, v2) {
    var x = v2.x - v1.x
    var y = v2.y - v1.y
    return Math.sqrt((x * x) + (y * y))
}

function dijkstra(graph, start, end) {
	var pq = new PriorityQueue();
	var sources = []; // adjacency array that stores where the vertex was accessed from
	sources.length = graph.vertexCnt;

	for (var i = 0; i < graph.getEdges(start).length; i++) {
        var edge = graph.adj[start][i] 
        pq.push(edge.distance, edge);
    }
    graph.visited[start] = 1;
    graph.distances[start] = 0;

	while (pq.size != 0) {
        var edge = pq.pop();
        var v = edge.dest.index;

        graph.visited[v] = 1;

        var newDistance =  graph.distances[edge.source.index] + edge.distance; 
        if (newDistance >= graph.distances[v])
            continue;

        graph.distances[v] = newDistance;
        sources[v] = edge.source.index;

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

		for (var i = 0; i < graph.getEdges(v).length; i++) {
            var edge = graph.adj[v][i];
            var cumulativeDistance = graph.distances[v] + edge.distance;
            pq.push(cumulativeDistance, edge);
		}
	}
}

function solveGraph(graph, graphAlgo, pauseTime) {
    clearInterval(graphIntervalTimer);
    if (!graph) {
        return;
    }
  
    for (var i = 0; i < graph.vertexCnt; i++) {
        graph.visited[i] = 0;
        $('#graph-' + i).css("background-color", "black");
    }
  
    var start = Math.floor(Math.random() * graph.vertexCnt);
    var end = Math.floor(Math.random() * graph.vertexCnt);
    var start_el = '#graph-' + start;
    var end_el = '#graph-' + end;
    $(start_el).css("background-color", "rgba(255, 0, 0, 0.3)");
    $(end_el).css("background-color", "rgba(0, 255, 0, 0.3)");
    if (graphAlgo == 'graph-dijkstra')
        dijkstra(graph, start, end);
    graphIntervalTimer = drawSolveGraph(pauseTime);
}

function drawSolveGraph(pauseTime) {
    return setInterval(function() {
        if (graphAnimationQueue.length > 0) {
            var data = graphAnimationQueue.shift();
            colorVertex(graph, data[0], data[2], data[3], data[4]);

            // display final solution instantly
            while (graphAnimationQueue.length > 0  && data[4] === 'unvisited') {
                var data = graphAnimationQueue.shift();
                colorVertex(maze, data[0], data[2], data[3], data[4]);
            }
        }
        else {
            clearInterval(graphIntervalTimer);
        }
    
    }, pauseTime);
}

function colorVertex(graph, v, start, end, type) {
	if (v === start || v === end)
		return;
	var vertex_el = $('#graph-' + v);
	if (type === 'unvisited')
		$(vertex_el).css("background-color", "rgba(0, 0, 255, 0.3)");
	else
		$(vertex_el).css("background-color", "rgba(0, 0, 0, 0.10)");
}