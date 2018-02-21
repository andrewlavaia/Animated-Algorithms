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
	$('#union-layers div').html('');

	// clear previous timer if set
	clearInterval(unionIntervalTimer);

	// Create an array and populate values with indices
	var array = [];
	for (var i = 0; i < arrSize; i++) {
	  array.push(i); 
	  $('.union-layer').append('<div class="union-element" id="union-' + i +'">' + i + '</div>');
	}

	//console.log(array);

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

	unionIntervalTimer = drawUnions(pauseTime);
}

function drawUnions(pauseTime) {
	return setInterval(function() {

		if (unionAnimationQueue.length > 0) {
			var q = unionAnimationQueue[0].pop();
			var p = unionAnimationQueue[0].pop();
			console.log('union(' + p + ', ' + q + ') - ' + unionAnimationQueue.shift());
			$('#union-' + p).animate({ 
        top: "+=50px",
      }, pauseTime);
			//$('#union-' + p).detach().appendTo('.union-layer2');
			//$('#union-' + q).detach().appendTo('.union-layer2');
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
