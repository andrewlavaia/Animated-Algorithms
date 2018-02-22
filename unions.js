var unionAnimationQueue = []; // very slow -> n^2 Memory requirement
var unionIntervalTimer; 

$('input[name="union-begin"]').on('click', function() {
	callUnion(
		parseInt($('input[name="union-array-size"]').val(), 10), 
		parseInt($('input[name="union-rand-calls"]').val(), 10), 
		parseInt($('input[name="union-animation-time"]').val(), 10),
		$('select[name="union-select"]').val());
});

function callUnion(arrSize, numUnions, pauseTime, unionAlgo) {
	// empty existing DOM elements
	$('.union-layer').html('');

	// clear previous timer if set
	clearInterval(unionIntervalTimer);

	// Create an array and populate values with indices
	var array = [];
	for (var i = 0; i < arrSize; i++) {
	  array.push(i); 
	  $('.union-layer').append(
	  	'<div class="union-set" id="union-set-' + i + '">' +
	  	'<div class="union-element" id="union-' + i +'">' + i + '</div>' +
	  	'</div>');
	}

	for (var i = 0; i < numUnions; i++) {
		var p = Math.floor(Math.random() * arrSize);  // 0 through maxIntSize - 1
	  var q = Math.floor(Math.random() * arrSize);  // 0 through maxIntSize - 1
	  createUnionQF(array, p, q); 
	  array.push(p);
	  array.push(q);
	  unionAnimationQueue.push(array.slice());
	  array.pop();
	  array.pop();
	}

	unionIntervalTimer = drawUnions(pauseTime, unionAlgo);
}

function drawUnions(pauseTime, sortAlgo) {
	return setInterval(function() {

		if (unionAnimationQueue.length > 0) {
			var q = unionAnimationQueue[0].pop();
			var p = unionAnimationQueue[0].pop();
			var array = unionAnimationQueue[0];
			unionAnimationQueue.shift();

			console.log('union(' + p + ', ' + q + ') - ' + array);
			
			if (sortAlgo == "quickFind") {

				// move each element that is connected to array[p] to where q is
				for(var i = 0; i < array.length; i++) {
					if(isConnectedQF(array, p, i)) {
						//var parentSet = $('#union-id-' + i).parent();
						//var width = parentSet.width();
						moveAnimate('#union-' + i, '#union-set-' + q, pauseTime);
						//parentSet.width(width);	
					}
				}
				//$('#union-id-' + p).parent().hide();
			}
		}

		if (unionAnimationQueue.length == 0) {
			clearInterval(unionIntervalTimer);
		}
	}, pauseTime);
}

// ----------------
// Quick Find
// ----------------
// Iterate through entire array and update union on matches
// Union Speed: n
// Find Speed: 1

function createUnionQF(array, p, q) {
	if (array[p] != array[q]) {
		var pval = array[p];
		var qval = array[q];

		for (var i = 0; i < array.length; i++) {
			if (array[i] == pval) {
				array[i] = qval;
				//$('#union-' + i).detach().appendTo('.union-layer2');
			}
		}
	}
}

function isConnectedQF(array, p, q) {
	return array[p] == array[q];
}
