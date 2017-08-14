var bg;
var pizza;

function setup() {
	bg = loadImage("img/blackboard.jpg");
	pizza = new XImage("img/pizza.png", 50, 50, 200, []);
	createCanvas(windowWidth, windowHeight);	
}

function draw() {
	background(bg);
	fill(255);
	pizza.update();
	pizza.display();
}

function mouseReleased() {
	pizza.releaseEvent();
}