var unionAnimationQueue = []; // very slow -> n^2 Memory requirement
var unionIntervalTimer = 1000; 
var callNum = 0;

$('input[name="union-begin"]').on('click', function() {
	callUnion(
		parseInt($('input[name="union-array-size"]').val(), 10), 
		parseInt($('input[name="union-rand-calls"]').val(), 10), 
		parseInt($('input[name="union-animation-time"]').val(), 10),
		$('select[name="union-select"]').val());
});

function callUnion(arrSize, numUnions, pauseTime, unionAlgo) {

	// clear previous values if set
	callNum = 0;
	$('.union-layer').html('');
	$('#union-header').html('#0 : union( 0 , 0 )');
	clearInterval(unionIntervalTimer);
	unionAnimationQueue.length = 0;

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
	  array.push(p);
	  array.push(q);
	  unionAnimationQueue.push(array.slice());
	  array.pop();
	  array.pop();
	 	createUnionQF(array, p, q); 
	}

	unionIntervalTimer = drawUnions(pauseTime, unionAlgo);
}

function drawUnions(pauseTime, sortAlgo) {
	return setInterval(function() {

		if (unionAnimationQueue.length > 0) {
			var q = unionAnimationQueue[0].pop();
			var p = unionAnimationQueue[0].pop();
			var array = unionAnimationQueue[0].slice(); // copy
			unionAnimationQueue.shift();

			callNum++;
			$('#union-header').html('#' + callNum + ' : union( ' + p + ' , ' + q + ' )');

			if (sortAlgo == "quickFind") {
				//console.log('union( ' + p + ' , ' + q + ' ) - ' +  array);

				colorSets(array[p], array[q], 'blue');	

				if(array[p] != array[q]) {
					// move each element that is connected to array[p] to where q is
					for(var i = 0; i < array.length; i++) {
						if(isConnectedQF(array, p, i)) {
							moveAnimate('#union-' + i, '#union-set-' + array[q], pauseTime);

							// Double check that none of the sets are empty while traversing
							// the array. Empty sets might be left if the animation is too fast.
							/*if($('#union-set-' + i).children().length == 0) {
								$('#union-set-' + i).remove(); 
							}
							*/
						}
					} 
				} else {
					setTimeout( function() {
						colorSets(array[p], array[q], 'white');
					}, pauseTime/2);
				}
			}
		}

		if (unionAnimationQueue.length == 0) {
			clearInterval(unionIntervalTimer);
		}

	}, pauseTime);
}


function redrawElements(array) {
	for (var i = 0; i < array.length; i++) {
		$('#union-' + i).appendTo($('#union-set-' + array[i]));
	}
}

function removeAllEmptySets() {
	$('.union-layer').children().each(function() { 	// for each set
		if($(this).children().length == 0) { 					// if no elements
			$(this).remove();														// remove set
		}
	});
}

function colorSets(p, q, color) {
	setP = $('#union-set-' + p);
	setQ = $('#union-set-' + q);
	setP.css({
		'background-color': color,
	});
	setQ.css({
		'background-color': color,
	});
}


// animates the moving of an element to a different parent/container div
// to use: "moveAnimate('#ElementToMove', '#newContainer', 1000);
function moveAnimate(element, newParent, animationTime){
  // Allow passing in either a jQuery object or selector
  element = $(element);
  oldParent = element.parent();
  newParent = $(newParent);

  // get current position
  var oldOffset = element.offset();

  // clone element and place in final position (maintains width of parent)
  var newElement = element.clone().appendTo(newParent); 

  // get final position
  var newOffset = newElement.offset();

  // create another clone for animation purposes
  var temp = element.clone().appendTo('body');
  temp.css({
    'position': 'absolute',
    'background-color': 'red',
    'left': oldOffset.left - 5,
    'top': oldOffset.top - 5,
    'z-index': 1000
  });

  // hide final position element until animation is complete
  newElement.hide();

  temp.animate({'top': newOffset.top - 5, 'left': newOffset.left - 30}, animationTime/2, function(){
   	newElement.show(); 			// show element in final position
   	element.remove(); 			// delete original element
   	temp.remove(); 					// delete animation element
   	if(oldParent.children().length == 0) { 
   		elementSort(newParent);	// sort elements in new array only once
   		removeAllEmptySets();
   		newParent.css({					// reset background color
   			'background-color': 'white',
   		});
   	}
  });
}

function elementSort(parent) {
	var array = [];
	$(parent).children().each(function() {
		array.push(parseInt($(this).text(), 10));
	});
	arrayMergeSort(array);
	for(var i = 0; i < array.length; i++) {
		$('#union-' + array[i]).appendTo($(parent));
	}
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
			}
		}
	}
}

function isConnectedQF(array, p, q) {
	return array[p] == array[q];
}
