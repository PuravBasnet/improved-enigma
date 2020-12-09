//Creating global variables.
var START=0;
var PLAY=1;
var END=2;
var gameState=START;
 
var dog;
var score=0;
var gameOver,restart;

//Preloading the Images/Animations.
function preload(){
  dogStanding=loadAnimation("Images/dogimg1.png");
  dogRunning=loadAnimation("Images/dogimg1.png","Images/dogimgrun2.jpg","Images/dogimgrun3.jpg","Images/dogimg4.png","Images/dogimgrun5.png","Images/dogimgrun6.jpg","Images/dogimg7.png","Images/dogimg8.png","Images/dogimgrun9.png");
  startImg=loadImage("Images/start.png");
  groundimg=loadImage("Images/ground2.png");
  gameOverImg=loadImage("Images/gameOver.png");
  restartImg=loadImage("Images/restart.png");
  logImg=loadImage("Images/logimg.png");
  bushImg=loadImage("Images/bush.png");
  backgrImg=loadImage("Images/background.jpg");
  restartImg=loadImage("Images/restart.png");
  gameOverImg=loadImage("Images/gameOver.png");

  jumpSound=loadSound("jump.mp3");
  dieSound=loadSound("die.mp3");
}

//Creating the sprites and assinging them the Images/Animations.
function setup() {
  createCanvas(displayWidth, displayHeight);

   dog= createSprite (displayWidth/10-50,displayHeight-30);
   dog.scale=0.5;
   dog.addAnimation("standing",dogStanding);
   dog.addAnimation("running",dogRunning);

  start=createSprite(displayWidth/2,displayHeight/2);
  start.addImage(startImg);
  
  gameOver=createSprite(displayWidth/2,displayHeight/2);
  gameOver.addImage(gameOverImg);
  gameOver.scale=0.5;
  gameOver.visible=false;

  ground=createSprite(displayWidth/4,displayHeight-10,displayWidth,5);
  ground.addImage(groundimg);
  ground.x=ground.width/2;
  
  restart=createSprite(displayWidth/2,displayHeight/2+50);
  restart.addImage(restartImg);
  restart.scale=0.5;
  restart.visible=false;
  
  logsGroup = new Group();

  bushesGroup = new Group();
  
  score = 0;
}

//Assigning the background an Image And creating a Game State1 and 2 and writing what we should do in them.
function draw() {
  background(backgrImg);
  textSize(30);
  fill("Black");
  text("Score:"+score,displayWidth/2-50,displayHeight/2-100);

  if (gameState===0){
    initialScreen();
    if (keyDown("s")){
      gameState=1;
      start.visible=false;
    }
  }
  
   else if(gameState===1){
     score=score+Math.round(getFrameRate()/60);
     dog.changeAnimation("running",dogRunning);
     ground.velocityX=-4;

     //resetting the ground.
     if (ground.x<500){
       ground.x=ground.width/2;
     }
     //Make the dog jump.
     if(keyDown("J") && dog.y>823) {
      dog.velocityY=-10;
      jumpSound.play();
     }
     dog.velocityY=dog.velocityY+0.5;

     //Calling the function
     spawnLogs();
     spawnBushes();

     //If the dog's touching the obstacle.
     if(logsGroup.isTouching(dog) || bushesGroup.isTouching(dog)) {
        gameState = 2;
        dieSound.play();
     }
   }

   else if (gameState===2){
    dog.changeAnimation("standing",dogStanding);
    ground.velocityX=0;
    logsGroup.setVelocityXEach(0);
    logsGroup.setLifetimeEach(-1);
    bushesGroup.setVelocityXEach(0);
    bushesGroup.setLifetimeEach(-1);

    gameOver.visible=true;
    restart.visible=true;
    if(mousePressedOver(restart)) {
     reset();
    }
   }
   dog.collide(ground);

  drawSprites();
}

//Creating an initial screeen before the game starts.
  function initialScreen(){
    stroke(50);
    fill("red");
    textSize(20);
    text("Instructions for the game:",displayWidth/2-100,displayHeight/2+80);
  
    stroke(5);
    fill("black");
    textSize(15);
    text("Press S to start the game.",displayWidth/2-100,displayHeight/2+100);
    text("Hitting the obstacle will end the game.",displayWidth/2-100,displayHeight/2+120);
    text("Press J to jump.",displayWidth/2-100,displayHeight/2+140);
    text("Press the Restart button when the game ends.",displayWidth/2-100,displayHeight/2+160);
  }

//Creating a function that will randomly spawn logs.
function spawnLogs() {
  if(frameCount % 340 === 0) {
    var log = createSprite(displayWidth,displayHeight-30,displayWidth,2);
    log.velocityX = -4;
    log.addImage(logImg);

    //assign scale and lifetime to the obstacle           
    log.scale = 0.15;
    log.lifetime = Math.round(displayWidth/4);

    //add each obstacle to the group
    logsGroup.add(log);
  }
}

//Creating a function that randomly spawn bushes.
function spawnBushes() {
  if(frameCount % 90 === 0) {
    var bush = createSprite(displayWidth,displayHeight-30,displayWidth,2);
    bush.velocityX = -4;
    bush.addImage(bushImg);
    
    //assign scale and lifetime to the obstacle           
    bush.scale = 0.15;
    bush.lifetime = Math.round(displayWidth/4);
    
    //add each obstacle to the group
    bushesGroup.add(bush);
  }
}

//Creating a function that will reset the game once the game ends.
function reset(){ 
  score=0;
  gameState = 1;
  gameOver.visible = false; 
  restart.visible = false;
  logsGroup.destroyEach();
  bushesGroup.destroyEach();
  dog.changeAnimation("running",dogRunning); 
}