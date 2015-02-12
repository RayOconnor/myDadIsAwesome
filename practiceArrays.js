
console.log(5 + 6);
    
var a = new Array(3, 4, "hello");

console.log(a);

var zombies = new Array();
for(i = 0; i < 5; i++) {
	var zombie = {
		x : 730,
		y : 700 - 100
	}
	zombies.push(zombie);
}

for(i = 0; i < 5; i++) {
	var z = zombies[i];
	z.x -= 15;
	zombies[0] = z;
	
}

var zombie1 = zombies[0];

console.log(zombie1);