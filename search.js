// Add a way to create mazes
// add a way to solve the maze using BFS and DFS
// animate BFS and DFS (current path should be one color, 
//		visited nodes should become grayed out, final path
//		should be colored another color)

var rows;
var cols;
var searchIntervalTimer = 1000; 

$('input[name="create-maze"]').on('click', function() {
  rows = parseInt($('#search-rows').val(), 10) + 2;
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

function createMaze(rows, cols, pauseTime) {
  clearInterval(searchIntervalTimer);
  searchIntervalTimer = drawMaze(pauseTime);
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

