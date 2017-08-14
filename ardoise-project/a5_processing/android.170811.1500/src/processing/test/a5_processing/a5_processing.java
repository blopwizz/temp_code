package processing.test.a5_processing;

import processing.core.*; 
import processing.data.*; 
import processing.event.*; 
import processing.opengl.*; 

import java.util.HashMap; 
import java.util.ArrayList; 
import java.io.File; 
import java.io.BufferedReader; 
import java.io.PrintWriter; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.io.IOException; 

public class a5_processing extends PApplet {

public void setup() {
  
  noStroke();
  fill(0);
  background(0);
}

public void draw() {
  background(0, 0, 0, 2);
  noFill();
  stroke(255);
  strokeWeight(5);
  if (mousePressed) {
    ellipse(mouseX, mouseY, 200, 200);
  }
  
}
  public void settings() {  fullScreen(); }
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "a5_processing" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
