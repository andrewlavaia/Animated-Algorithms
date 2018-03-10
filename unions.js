// $('#union-wrapper').hide();
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
	$('#union-header').html('#0 : union( 0 , 0 )');
	$('.union-layer').html('');
	$('.unsorted').html('<ul></ul>');
	$('.tree').html('<ul class="top-level"></ul>'); // create first ul for initial animat
	clearInterval(unionIntervalTimer);
	unionAnimationQueue.length = 0;

	// Create an array and populate values with indices
	var array = [];
	for (var i = 0; i < arrSize; i++) {
	  array.push(i); 
	  if(unionAlgo == "quickFind") {
	  	$('.union-layer').append(
	  	'<div class="union-set" id="union-set-' + i + '">' +
	  	'<div class="union-element" id="union-' + i +'">' + i + '</div>' +
	  	'</div>');
	  } else {
	  	$('.unsorted').append('<ul><li id="node-' + i + '"><span>' + i + '</span></li></ul>');
	  }
	}

	for (var i = 0; i < numUnions; i++) {
		var p = Math.floor(Math.random() * arrSize);  // 0 through maxIntSize - 1
	  var q = Math.floor(Math.random() * arrSize);  // 0 through maxIntSize - 1
	  array.push(p);
	  array.push(q);
	  unionAnimationQueue.push(array.slice());
	  array.pop();
	  array.pop();
	  if (unionAlgo == "quickFind") {
	 		createUnionQF(array, p, q); 
	 	} 
	 	else if (unionAlgo == "quickUnion") {
	 		createUnionQU(array, p, q); 
	 	}
	}

	unionIntervalTimer = drawUnions(pauseTime, unionAlgo);
}

// -------------------------
// Union Animation Functions
// ------------------------- 

function drawUnions(pauseTime, sortAlgo) {
	return setInterval(function() {

		if (unionAnimationQueue.length > 0) {
			var q = unionAnimationQueue[0].pop();
			var p = unionAnimationQueue[0].pop();
			var array = unionAnimationQueue[0].slice(); // copy
			console.log(p + ', ' + q + ' - ' + array + ' - ' + isConnectedQU(array, p, q));
			unionAnimationQueue.shift();
			callNum++;
			$('#union-header').html('#' + callNum + ' : union( ' + p + ' , ' + q + ' )');

			if (sortAlgo == "quickFind") {
				colorSets(array[p], array[q], 'blue');	

				if(array[p] != array[q]) {
					// move each element that is connected to array[p] to where q is
					for(var i = 0; i < array.length; i++) {
						if(isConnectedQF(array, p, i)) {
							moveAnimateQF('#union-' + i, '#union-set-' + array[q], pauseTime);
						}
					} 
				} else {
					// reset color to white if array[p] != array[q] 
					setTimeout( function() {
						colorSets(array[p], array[q], 'white');
					}, pauseTime/2);
				}
			}
			else if (sortAlgo == "quickUnion") {
				if (p == q || isConnectedQU(array, p, q)) {
					// do nothing except color nodes blue momentarily
					colorNodes(p, q, 'blue');
					setTimeout( function() {
						colorNodes(p, q, 'white');
					}, pauseTime/2);
				}
				else if ($('.unsorted > ul > #node-' + q).length > 0) {
					// q is unsorted, create new tree
					// To do: is a double simultaneous animation function possible? 	
					$('#node-' + q).parent().remove();
					$('.tree').append(
						'<ul class="top-level"><li id="node-' + q + '"><span>' + q + '</span>' +
						'</li></ul>');
					movePinQAnimate(array, p, q, pauseTime);
				}	else {
					movePinQAnimate(array, p, q, pauseTime);
				}
				
			}
		}

		if (unionAnimationQueue.length == 0) {
			clearInterval(unionIntervalTimer);
		}
	}, pauseTime);
}

/*
function movePinQ(array, p, q) {
	var rootP = findRootQU(array, p);
	var rootQ = findRootQU(array, q);
	var pNode = $('#node-' + rootP).parent().html();
	console.log(pNode + ' -unsorted p');
	$('#node-' + rootP).parent().remove();
	if ($('#node-' + rootQ).children().length == 1) // last node in branch, only has a <span>
		$('#node-' + rootQ).append('<ul>' + pNode + '</ul>');
	else
		$('#node-' + rootQ).children('ul').append(pNode);
}
*/
function movePinQAnimate(array, p, q, animationTime) {
	var rootP = findRootQU(array, p);
	var rootQ = findRootQU(array, q);
	var pNode = $('#node-' + rootP).parent(); 
	var qNode = $('#node-' + rootQ);

	var pOffset = pNode.children().offset(); // current position

  var temp = pNode.clone().appendTo('.tree'); // so that it has the tree class
  temp.css({
    'position': 'absolute',
    'left': pOffset.left,
    'top': pOffset.top,
    'z-index': 1000
  });

  temp.find('span').css({
    'background-color': 'red',
  });

  qNode.find('span').css({
    'background-color': 'blue',
  });

  pNode.find('span').css({
		'background-color': 'blue',
	});

	// determine final position
	if (qNode.children().length == 1) {
		qNode.append('<ul>' + pNode.html() + '</ul>');
	} else {
		qNode.children('ul').append(pNode.html());;
	}
 

	var newOffset = qNode.children('ul').offset();
	newOffset.left = newOffset.left + qNode.children('ul').width() - pNode.children().width() - 15;
	newOffset.top = newOffset.top + 10;

	// hide final position until animation is complete
  qNode.find('#node-' + rootP).hide();

  temp.animate({'top': newOffset.top, 'left': newOffset.left}, animationTime/2, function(){
   	qNode.find('#node-' + rootP).show(); // show element in final position
   	pNode.remove(); 			  		// delete original element
   	temp.remove(); 							// delete animation element
   	qNode.find('span').css({
    	'background-color': 'white',
  	});
  });

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

function colorNodes(p, q, color) {
	nodeP = $('#node-' + p + ' > span');
	nodeQ = $('#node-' + q + ' > span');
	nodeP.css({
		'background-color': color,
	});
	nodeQ.css({
		'background-color': color,
	});
}

// animates the moving of an element to a different parent/container div
// to use: "moveAnimate('#ElementToMove', '#newContainer', 1000);
function moveAnimateQF(element, newParent, animationTime){
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


function moveAnimateQU(element, newParent, animationTime){
	// Allow passing in either a jQuery object or selector
	element = $(element);
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
	  'left': oldOffset.left,
	  'top': oldOffset.top,
	  'z-index': 1000
	});

	// hide final position element until animation is complete
	newElement.hide();

	temp.animate({'top': newOffset.top, 'left': newOffset.left}, animationTime/3, function(){
	 	newElement.show(); 			// show element in final position
	 	element.remove(); 			// delete original element
	 	temp.remove(); 					// delete animation element
	 	/*
	 	if(oldParent.children().length == 0) { 
	 		elementSort(newParent);	// sort elements in new array only once
	 		removeAllEmptySets();
	 		newParent.css({					// reset background color
	 			'background-color': 'white',
	 		});
	 	}*/
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

// ----------------
// Quick Union
// ----------------
// Nodes are organized into trees with unlimited depth
// Union Speed: n
// Find Speed: n

function findRootQU(array, i) {
	while (i != array[i]) {
		i = array[i];
	}
	return i;
}

function createUnionQU(array, p, q) {
	var i = findRootQU(array, p);
	var j = findRootQU(array, q);
	array[i] = j;
}

function isConnectedQU(array, p, q) {
	return findRootQU(array, p) == findRootQU(array, q);
}
