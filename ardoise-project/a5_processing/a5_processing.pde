int temp = 0;

void setup() {
  fullScreen();
  noStroke();
  fill(0);
  background(0);
  smooth();
}

void draw() {
  background(0, 0, 0, 10);
  noFill();
  stroke(255);
  strokeWeight(5);
 
  if (mousePressed) {
    ellipse(mouseX, mouseY, 200, 200);
  }
  
  // draw previous text in black to erase it
  noStroke();
  fill(0); 
  text(temp, 10, 50); 
  
  // draw new text in white
  fill(255);
  textSize(40);
  temp = int(frameRate);
  text(temp, 10, 50);
}