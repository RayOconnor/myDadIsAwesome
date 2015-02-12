
//create canvas and load sprites
// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 700;
canvas.height = 700;
document.body.appendChild(canvas);


//define objects to be used in game
var dad = {
	speed: 1000,  // movement in pixels per second
	isJumping: false, //is dad jumping?
	yvelocity: 0,  //jumping velocity to be changed to simulate jumping
	yspeed: 0, //current change in y location
	frame: 0 //current frame to draw when running

};
var tick = 0;
var floor = canvas.height - 100;
var gamescreen = 0; //game screen includes two title screens, 
//the game and gameover screen

var birdsSound = new Audio("birds.mp3"); // buffers automatically when created
//play bird sounds for the start of the game

var travelingSalesman = new Audio("travelingSalesman.mp3");
var zombies = new Array();
//cooldown ensures that zombies will not spawn too close in succession
var cooldown = 100;


// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
bgReady = true;
};
bgImage.src = "images/background.png";

// titleScreen1 image
var ts1Ready = false;
var ts1Image = new Image();
ts1Image.onload = function () {
ts1Ready = true;
};
ts1Image.src = "images/dad_titleScreen1.png";

// titleScreen2 image
var ts2Ready = false;
var ts2Image = new Image();
ts2Image.onload = function () {
ts2Ready = true;
};
ts2Image.src = "images/dad_titleScreen2.png";

// gameover image
var gameoverReady = false;
var gameoverImage = new Image();
gameoverImage.onload = function () {
gameoverReady = true;
};
gameoverImage.src = "images/gameover.png";

// aura image
// 
var auraReady = false;
var auraImage = new Image();
auraImage.onload = function () {
auraReady = true;
};
auraImage.src = "images/aura.png";

var carsReady = false;
var carsImage = new Image();
carsImage.onload = function () {
carsReady = true;
};
carsImage.src = "images/cars.png";

var cars2Ready = false;
var cars2Image = new Image();
cars2Image.onload = function () {
cars2Ready = true;
};
cars2Image.src = "images/aura.png";

var housesReady = false;
var housesImage = new Image();
housesImage.onload = function () {
housesReady = true;
};
housesImage.src = "images/houses.png";

var houses2Ready = false;
var houses2Image = new Image();
houses2Image.onload = function () {
houses2Ready = true;
};
houses2Image.src = "images/houses2.png";


// dad1 image
// 
var dadReady = false;
var dadImage = new Image();
dadImage.onload = function () {
dadReady = true;
};
dadImage.src = "images/dad.png";

// dad2 image
// 
var dad2Ready = false;
var dad2Image = new Image();
dad2Image.onload = function () {
dad2Ready = true;
};
dad2Image.src = "images/dad2.png";

// dad3 image
// 
var dad3Ready = false;
var dad3Image = new Image();
dad3Image.onload = function () {
dad3Ready = true;
};
dad3Image.src = "images/dad3.png";

//dadjump image
var dadjumpReady = false;
var dadjumpImage = new Image();
dadjumpImage.onload = function () {
dadjumpReady = true;
};
dadjumpImage.src = "images/dadjump.png";

// zombie image
// 
var zombieReady = false;
var zombieImage = new Image();
zombieImage.onload = function () {
zombieReady = true;
};
zombieImage.src = "images/zombie.png";

//create shortcut shunctions for drawing sprites
//function for drawing dad image based on tick count
function drawDad() {
	if (dadReady && dad2Ready && dadjumpReady) {
			if (dad.isJumping) {
				ctx.drawImage(dadjumpImage, dad.x, dad.y);
			}
			else if ((Math.floor(tick/15)%4) == 0){
				ctx.drawImage(dadImage, dad.x, dad.y);
			}
			else if ((Math.floor(tick/15)%4) == 2){
				ctx.drawImage(dad2Image, dad.x, dad.y);
			}
			else {
				ctx.drawImage(dad3Image, dad.x, dad.y);
			} 
			
		}
}

//draw background houses
function drawHouses() {
	//draw houses so they appear to be scrolling by
	if (housesReady && houses2Ready) {
		ctx.drawImage(housesImage,  canvas.width - (((4*tick)+canvas.width)%(canvas.width*2)), floor - 270)
		ctx.drawImage(houses2Image, canvas.width - ((4*tick)%(canvas.width * 2)) , floor - 270)
	}
}

function dadJumpController() {

	//dad jumps adding 15 to his upward velocity
	if (38 in keysDown && !dad.isJumping) { // Player holding up
		dad.yvelocity = 13;
		dad.isJumping = true;
	}

	//dad is in the air and gravity must be applied to velocity
	if(dad.isJumping) {
			dad.yvelocity -= .75;
			dad.y -= dad.yvelocity;
		}
	
	//dad has hit the ground and should be adjusted back to normal
	if(dad.y >= floor) {
		dad.yvelocity = 0;
		dad.y = floor;
		dad.isJumping = false;
	}
}

//creates a zombie object
function createZombie() {
	return {x: 730, y: floor};
}

//draws the given zombie object
function drawZombie(z) {
	if (zombieReady) {
		ctx.drawImage(zombieImage, z.x, z.y);
	}
}

//adds a new zombie to the global list of zombies
function addNewZombie() {
	zombies.push(createZombie());
}

//moves a zombie and returns it
function moveZombie(z) {
	return {x: z.x -= 5, y: z.y};
}

//maps drawZombie to all Zombies
function drawAllZombies() {
	for (i = 0; i < zombies.length; i++) {
		drawZombie(zombies[i]);
	}
}

function moveAllZombies() {
	for (i = 0; i < zombies.length; i++) {
		zombies[i] = moveZombie(zombies[i]);
	}
}

function maybeSpawnZombie() {
	
	cooldown --;
	
	if(((Math.floor(Math.random() * 50) == 0) && cooldown <= 0) ||
		cooldown <= -40)  {
			
		addNewZombie();
		cooldown = 30;
	}
}

//adds a zombie to the list of zombies so there is at least one
//to start
//addNewZombie();


//tests collision between global dad and the given zombie
function checkDadColliding(z) {
	if (
			dad.x <= (z.x + 30)
			&& z.x <= (dad.x + 30)
			&& dad.y <= (z.y + 30)
			&& z.y <= (dad.y + 30)
		) {
			
			gamescreen = 3;
			travelingSalesman.pause();
	}

}

function checkCollidingAny() {
	for (i = 0; i < zombies.length; i++) {
		
		//if zombies are offscreen they can be removed
		if (zombies[i].x < -50) {
			zombies.splice(i,1);
		}
		//the zombies are ordered by location and if
		//the any zombie is reached with an x greater than 100
		//than those following wil also be too far to collide
		if (zombies[i].x > 100) break; 
		checkDadColliding(zombies[i]);
	}
}


//title screen

// Game objects


// Handle keyboard controls
var keysDown = {};
addEventListener("keydown", function (e) {
keysDown[e.keyCode] = true;
}, false);
addEventListener("keyup", function (e) {
delete keysDown[e.keyCode];
}, false);



// Reset the game when the player catches a zombie
var reset = function () {
	gamescreen = 0;
	tick = 0;
	score = 0;

	dad.x = 60;
	dad.y = floor; //canvas.height - 100;
	zombies = new Array(createZombie());
	birdsSound.play();

};


// Update game objects
var update = function (modifier) {

	if(gamescreen == 0) {

		if (13 in keysDown && tick > 25) {
			tick = 0;
			gamescreen = 1;
			birdsSound.pause();
			travelingSalesman.play();
		}

		tick ++;
	}

	if(gamescreen == 1) {
		if (13 in keysDown && tick > 25) {
			tick = 0;
			gamescreen = 2;
		}
		if ('b' in keysDown && tick > 25) {
			tick = 0;
			gamescreen = 0;
			travelingSalesman.pause();
			birdsSound.play();
		}
		tick ++;
	}

	if(gamescreen == 2) {
		
		dadJumpController();
		
		//move zombies
		moveAllZombies();
		tick ++;
		
		//maybe spawn a new zombie
		maybeSpawnZombie();
		
		// Are they touching?
		checkCollidingAny();
	}

	if (gamescreen == 3) {
		if (13 in keysDown) {
			//travelingSalesman.pause();
			reset();

		}
	}
};



// Draw everything
var render = function () {
	
	if (gamescreen == 0) {
		if (ts1Ready) {
			ctx.drawImage(ts1Image, 0, 0);	
		}
		ctx.fillStyle = "rgb(0, 0, 0)";
		ctx.font = "20px Helvetica";
		ctx.fillText("Press Enter", 280, canvas.height - 335);

	}

	if (gamescreen == 1) {
		if (ts2Ready) {
			ctx.drawImage(ts2Image, 0, 0);	
		}
		ctx.fillStyle = "rgb(250, 0, 0)";
		ctx.font = "20px Helvetica";
		ctx.fillText("Press Enter... Again", 280, canvas.height - 335);
	}

	if (gamescreen == 2) {
		if (bgReady) {
			ctx.drawImage(bgImage, 0, 0);
		}
		//draw scrolling houses
		drawHouses();
		//draw dad, the image selected is dependant on the tick
		drawDad();
		//drawZombie(zombie);
		drawAllZombies();
		
		// Score
		ctx.fillStyle = "rgb(0, 0, 0)";
		ctx.font = "20px Helvetica";
		ctx.textAlign = "left";
		ctx.textBaseline = "top";
		ctx.fillText("Score: " + Math.floor(tick/10), 35, 35);
	}

	if (gamescreen == 3) {
		if (gameoverReady) {
			//draw game over screen
			ctx.drawImage(gameoverImage, 0, 0);
		}
		
		//draw frozen dead dad image
		drawDad();
		//draw all zombie images frozen
		drawAllZombies();
		
		// Final Score
		ctx.fillStyle = "rgb(250, 0, 0)";
		ctx.font = "20px Helvetica";
		ctx.textAlign = "left";
		ctx.textBaseline = "top";
		ctx.fillText("Final Score: " + Math.floor(tick/10), 35, 35);
	}
};



// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;
	update(delta / 1000);
	render();
	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();



