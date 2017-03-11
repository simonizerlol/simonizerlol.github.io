// this main state will contain the game
var mainState = {
	// execute a the beginning
	// load images and sounds
	preload: function() { 
    
    game.load.image('pingpong', 'assets/rsz_pingpong.png');
    game.load.image('cup', 'assets/rsz_cup_nobg.png');
    game.load.audio('swish', 'assets/swish.wav'); 
    game.load.audio('ouch', 'assets/ouch.wav'); 
},

create: function() { 
    // Change the background color of the game to blue
    game.stage.backgroundColor = '#71c5cf';

    // Set the physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // Display the pingpong at the position x=100 and y=245
    this.pingpong = game.add.sprite(100, 245, 'pingpong');

    // Add physics to the pingpong
    // Needed for: movements, gravity, collisions, etc.
    game.physics.arcade.enable(this.pingpong);

    // Add gravity to the pingpong to make it fall
    this.pingpong.body.gravity.y = 1000;  

    // Call the 'jump' function when the spacekey is hit
    var spaceKey = game.input.keyboard.addKey(
                    Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(this.jump, this);     

    this.cup = game.add.group(); 

    this.timer = game.time.events.loop(1500, this.addRowOfcup, this); 

    this.score = 0;
	this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });   

	 // Move the anchor to the left and downward
	this.pingpong.anchor.setTo(-0.2, 0.5); 

	this.jumpSound = game.add.audio('swish');
	this.ouchSound = game.add.audio('ouch');
},

update: function() {
    // If the pingpong is out of the screen (too high or too low)
    // Call the 'restartGame' function
    if (this.pingpong.y < 0 || this.pingpong.y > 490){
    	this.restartGame();
    }
        
    game.physics.arcade.overlap(this.pingpong, this.cup, this.hitCup, null, this);

    if(this.pingpong.angle < 20){
    	this.pingpong.angle += 1;
    }
},

// Make the pingpong jump 
jump: function() {
    // Add a vertical velocity to the pingpong
    this.pingpong.body.velocity.y = -350;

    // Create an animation on the pingpong
	var animation = game.add.tween(this.pingpong);

	// Change the angle of the pingpong to -20° in 100 milliseconds
	animation.to({angle: -20}, 100);

	// And start the animation
	animation.start(); 

	// the above three lines of code for animation can be rewritten as
	// game.add.tween(this.pingpong).to({angle: -20}, 100).start(); 

	if (this.pingpong.alive == false)
    return;  
	
	this.jumpSound.play(); 
},

hitCup: function() {
    // If the pingpong has already hit a pipe, do nothing
    // It means the pingpong is already falling off the screen
    if (this.pingpong.alive == false)
        return;

    // Set the alive property of the pingpong to false
    this.pingpong.alive = false;

    // Prevent new cup from acupearing
    game.time.events.remove(this.timer);

    // Go through all the cup, and stop their movement
    this.cup.forEach(function(p){
        p.body.velocity.x = 0;
    }, this);
    this.ouchSound.play(); 
}, 

// Restart the game
restartGame: function() {
    // Start the 'main' state, which restarts the game
    game.state.start('main');
},
	
addOnecup: function(x, y) {
    // Create a cup at the position x and y
    var cup = game.add.sprite(x, y, 'cup');

    // Add the cup to our previously created group
    this.cup.add(cup);

    // Enable physics on the cup 
    game.physics.arcade.enable(cup);

    // Add velocity to the cup to make it move left
    cup.body.velocity.x = -200; 

    // Automatically kill the cup when it's no longer visible 
    cup.checkWorldBounds = true;
    cup.outOfBoundsKill = true;
 
},
addRowOfcup: function() {
    // Randomly pick a number between 1 and 5
    // This will be the hole position
    var hole = Math.floor(Math.random() * 5) + 1;

    // Add the 6 cup 
    // With one big hole at position 'hole' and 'hole + 1'
    for (var i = 0; i < 8; i++)
        if (i != hole && i != hole + 1) 
            this.addOnecup(400, i * 60 + 10);
    this.score += 1;
	this.labelScore.text = this.score;    
},

};


// Initialize Phaser, and create a 400px by 490px game
var game = new Phaser.Game(400, 490);

// Add the 'mainState' and call it 'main'
game.state.add('main', mainState); 

// Start the state to actually start the game
game.state.start('main');