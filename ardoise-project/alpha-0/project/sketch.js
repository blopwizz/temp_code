var bg;

function setup() {
	bg = loadImage("img/blackboard.jpg");
	createCanvas(windowWidth-20, windowHeight-20);
}

function draw() {
	background(bg);
	fill(255);
	if (mouseIsPressed){
		ellipse(mouseX, mouseY, 100, 100);
	}
}