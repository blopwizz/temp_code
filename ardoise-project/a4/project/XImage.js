function XImage(path_, x_init_, y_init_, w_, others_) {
	var path = path_;                 // image path
	var x_init = x_init_;			        // initial position
	var y_init = y_init_;             // initial position
	var w = w_;                       // image width    
	var others = others_;             // list of objects
	var img = loadImage(path);        // image object
  var ratio = img.width/img.height; // constant ratio of orginal image
  var h = w/ratio;                  // height variable in   respect to ratio
  var xs = 0;                       // movement variable
  var ys = 0;                       // movement variable
  var x = x_init + xs - w/2;        // box real time x position
  var y = y_init + ys - h/2;        // box real time y position
  var over = false;                 // mouse state
  var press = false;                // mouse state
  var locked = false;       			  // mouse state
  var otherslocked = false; 			  // true when at least one of the objects is locked

  

  //-----------------------------------------------------------------
  //                          UPDATE
  this.update = function() {
  	x = x_init + xs;
  	y = y_init + ys;
  	h = w/ratio;

    // othersLocked is true when at least one of the handles is locked
    for (var i=0; i< others.length; i++) {
    	if (others[i].locked == true) {
    		otherslocked = true;
    		break;
    	} else {
    		otherslocked = false;
    	}
    }

    // if no handles is locked, see if a handle is clicked
    if (otherslocked == false) {
    	overEvent();
    	pressEvent();
    }

    // if mouse is pressed, update position
    if (press) {
    	xs = mouseX - x_init - w/2;
    	ys = mouseY - y_init - h/2;
    }
  };

  //-----------------------------------------------------------------
  //                          DISPLAY
  this.display = function() {
    // display image
    image(img, x, y, w, h);
  };

  //---------------------------------------------------------------------------
  //                      MOUSE EVENT

  function overEvent() {
  	if (overRect(x, y, w, h)) {
  		over = true;
  	} else {
  		over = false;
  	}
  }

  function pressEvent() {
  	if (over && mouseIsPressed || locked) {
  		press = true;
  		locked = true;
  	} else {
  		press = false;
  	}
  }

  this.releaseEvent = function() {
  	locked = false;
  };


  function overRect(x_, y_, w_, h_) {
  	if (mouseX >= x_ && mouseX <= x_+w_ && 
  		mouseY >= y_ && mouseY <= y_+h_) {
  		return true;
  } else {
  	return false;
  }
}

  //---------------------------------------------------------------------------
  //                      GETTERS & SETTERS

  this.getX = function() {
  	return x+w/2;
  };

  this.getY = function() {
  	return t+h/2;
  };

  //---------------------------------------------------------------------------
  //                      MATH FUNCTIONS

  // limits
  function lock(val, minv, maxv) { 
  	return  min(max(val, minv), maxv);
  }
}