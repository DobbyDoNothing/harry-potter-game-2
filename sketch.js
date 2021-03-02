var PLAY = 1;
var END = 0;
var gameState = PLAY;

var harry, harry_img;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;



function preload(){
  harry_img =   loadImage("harry.png");
  
  groundImage = loadImage("hill background.png");
  
  cloudImage = loadImage("dementor.png");
  
  obstacle1 = loadImage("blue potion.png");
  obstacle2 = loadImage("gold potion.png");
  obstacle3 = loadImage("green potion.png");
  obstacle4 = loadImage("purple potion.png");
  obstacle5 = loadImage("red potion.png");
  obstacle6 = loadImage("golden snitch.png");
  
  gameOverImg = loadImage("game over.png");
  restartImg = loadImage("restart button.png");
}

function setup() {
  createCanvas(displayWidth, displayHeight);
  
  
  ground = createSprite(width/2,height/2,width,height);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  

  
  harry = createSprite(200,380,20,50);
  harry.addImage(harry_img);
 
  harry.scale = 0.5;
  gameOver = createSprite(width/2,height/2-100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2+100);
  restart.addImage(restartImg);
  
  gameOver.scale = 1.3;
  restart.scale = 0.3;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(width/2,560,width,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //harry.debug = true;
  //background(0);
  
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if(keyDown("space") && harry.y >= 159) {
      harry.velocityY = -12;
    }
  
    harry.velocityY = harry.velocityY + 0.8
  
    if (ground.x < 200){
      ground.x = ground.width/2;
    }
  
    harry.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(cloudsGroup.isTouching(harry)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    harry.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the harry animation
   
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  drawSprites();
  textSize(32);
  fill("purple");
  stroke("yellow");
  strokeWeight(3);
  text("Score: "+ score, width-200,100);
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 250 === 0) {
    var cloud = createSprite(width,120,40,10);
    cloud.y = Math.round(random(200,height-200));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 400;
    //cloud.debug=true;
    cloud.setCollider("rectangle",-110,-60,320,220);
    //adjust the depth
    cloud.depth = harry.depth;
    harry.depth = harry.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 200 === 0) {
    var obstacle = createSprite(width,height/2-200,height/2+200,30,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              obstacle.setCollider("rectangle",0,0,100,200);
              ground.velocityX-=2;
              break;
      case 2: obstacle.addImage(obstacle2);
              ground.velocityX+=2;
              obstacle.setCollider("rectangle",0,0,300,400)
              break;
      case 3: obstacle.addImage(obstacle3);
              if(harry.scale>0){
              harry.scale -=0.2;
              } else {
                score -=5;
              }
              break;
      case 4: obstacle.addImage(obstacle4);
              obstacle.setCollider("rectangle",0,0,300,400)
              if(harry.scale<1){
              harry.scale +=0.2;
              }
              else{
                score +=5;
              }
              break;
      case 5: obstacle.addImage(obstacle5);
              obstacle.velocityX+=2;
              obstacle.setCollider("rectangle",0,0,100,200)
              break;
      case 6: obstacle.addImage(obstacle6);
              obstacle.setCollider("rectangle",0,0,400,200)
              obstacle.velocityX-=2;
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 600;
   
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach(); 
  score = 0;
  
}