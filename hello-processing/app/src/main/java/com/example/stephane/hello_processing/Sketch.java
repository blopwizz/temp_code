package com.example.stephane.hello_processing;

/**
 * Created by stephane on 8/11/2017.
 */

import processing.core.PApplet;

public class Sketch extends PApplet {
    public void settings() {
        size(600, 600);
    }

    public void setup() {
        fullScreen();
        background(0);
    }

    public void draw() {
        fill(255);
        if (mousePressed) {
            ellipse(mouseX, mouseY, 50, 50);
        }
    }
}