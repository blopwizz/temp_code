var bg;
var pizza;

function setup() {
	bg = loadImage("img/blackboard.jpg");
	createCanvas(windowWidth, windowHeight);	
}

function draw() {
	background(bg);
	fill(255);
	if (mouseIsPressed) {
		ellipse(mouseX, mouseY, 100, 100);
	}
}