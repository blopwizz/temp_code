class XImage {
  PImage img;
  String path;
  float x, y, x_init, y_init, xs, ys, w, h, ratio;
  boolean over, press, locked, otherslocked;
  XImage[] others;

  XImage(String path_, float x_init_, float y_init_, float w_, XImage[] others_) {
    path = path_;                 // image path
    x_init = x_init_;              // initial position
    y_init = y_init_;             // initial position
    w = w_;                       // image width
    others = others_;             // list of objects

    img = loadImage(path);        // image object
    ratio = img.width/img.height; // constant ratio of orginal image
    h = w/ratio;                  // height variable in   respect to ratio
    xs = 0;                       // movement variable
    ys = 0;                       // movement variable
    x = x_init + xs - w/2;        // box real time x position
    y = y_init + ys - h/2;        // box real time y position
    over = false;                 // mouse state
    press = false;                // mouse state
    locked = false;               // mouse state
    otherslocked = false;         // true when at least one of the objects is locked
  }



  //-----------------------------------------------------------------
  //                          UPDATE
  void update() {
    x = x_init + xs;
    y = y_init + ys;
    h = w/ratio;

    // othersLocked is true when at least one of the handles is locked
    for (int i=0; i< others.length; i++) {
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
  void display() {
    // display image
    image(img, x, y, w, h);
  };

  //---------------------------------------------------------------------------
  //                      MOUSE EVENT

  void overEvent() {
    if (overRect(x, y, w, h)) {
      over = true;
    } else {
      over = false;
    }
  }

  void pressEvent() {
    if (over && mousePressed || locked) {
      press = true;
      locked = true;
    } else {
      press = false;
    }
  }

  void releaseEvent() {
    locked = false;
  }


  boolean overRect(float x_, float y_, float w_, float h_) {
    if (mouseX >= x_ && mouseX <= x_+w_ && 
      mouseY >= y_ && mouseY <= y_+h_) {
      return true;
    } else {
      return false;
    }
  }

  //---------------------------------------------------------------------------
  //                      GETTERS & SETTERS

  float getX() {
    return x+w/2;
  }

  float getY() {
    return y+h/2;
  }

  //---------------------------------------------------------------------------
  //                      MATH FUNCTIONS

  // limits
  float lock(float val, float minv, float maxv) { 
    return  min(max(val, minv), maxv);
  }
}