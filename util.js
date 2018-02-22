function assert(condition, message) {
    if (!condition) throw new Error(message)
}

function newFilledArray(length, val) {
	var array = [];
	array.length = length;
	for(var i = 0; i < length; i++) {
		array[i] = val;
	}

	return array;
}

// animates the moving of an element to a different parent/container div
// to use: "moveAnimate('#ElementToMove', '#newContainer', 1000);
function moveAnimate(element, newParent, animationTime){
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
        'left': oldOffset.left - 5,
        'top': oldOffset.top - 5,
        'z-index': 1000
    });

    // hide final position element until animation is complete
    newElement.hide();

    temp.animate({'top': newOffset.top - 5, 'left': newOffset.left - 5}, animationTime/2, function(){
       	newElement.show(); 	// show element in final position
       	element.remove(); 	// delete original element
       	temp.remove(); 		// delete animation element
    });


}
