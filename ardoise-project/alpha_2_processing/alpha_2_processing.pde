PImage bg;
XImage pizza;
XImage[] ximg = new XImage[1];

void setup() {
  bg = loadImage("blackboard.jpg");
  pizza = new XImage("pizza.png", 50, 50, 200, ximg);
  ximg[0] = pizza;
  size(720, 1280);
}

void draw() {
  bg.resize(720, 1280);
  background(bg);
  fill(255);
  pizza.update();
  pizza.display();
}

void mouseReleased() {
  pizza.releaseEvent();
}