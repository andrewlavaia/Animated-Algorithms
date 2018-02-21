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
    //Allow passing in either a jQuery object or selector
    element = $(element);
    newParent = $(newParent);

    element.css({
    	'background-color': 'red',
    });

    var oldOffset = element.offset();
    element.appendTo(newParent);
    var newOffset = element.offset();

    var temp = element.clone().appendTo('body');
    temp.css({
        'position': 'absolute',
        'left': oldOffset.left,
        'top': oldOffset.top,
        'z-index': 1000
    });
    element.hide();
    temp.animate({'top': newOffset.top, 'left': newOffset.left}, animationTime, function(){
       	element.show();
       	temp.remove();
        element.css({
	    	'background-color': 'white',
	    });
    });


}
