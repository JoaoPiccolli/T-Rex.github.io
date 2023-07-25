var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var GameOver, GameOverImg;
var Restart, RestartImg;

var Jump
var Die 
var Checkpoint


function preload(){
  GameOverImg = loadImage("gameOver.png");
  RestartImg = loadImage("restart.png");
  
  
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  Jump = loadSound ("jump (1).mp3");
  Die = loadSound ("die.mp3");
  Checkpoint = loadSound ("checkpoint.mp3");
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(width*0.20,height*0.75);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.5;
  
  ground = createSprite(width*0.5,height*0.8,width,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;


  GameOver = createSprite (width*0.5,height*0.5);
  GameOver.addImage(GameOverImg);

  Restart = createSprite (width*0.55,height*0.58);
  Restart.addImage (RestartImg);
  Restart.scale = 0.5;
  
  invisibleGround = createSprite(width*0.5,height*0.81,width,10);
  invisibleGround.visible = false;
  
  //criar os Grupos de Obstáculos e Nuvens
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  console.log("Hello" + 5);
  
  trex.setCollider("rectangle",0,0,90,trex.height);
  trex.debug = true
  
  score = 0
}

function draw() {
  background(180);
 //exibindo a pontuação
  text("Score: "+ score, 500,50);
  
  console.log("this is ",gameState)
  
  
  if(gameState === PLAY){
     
    if(score % 100===0 && score>0)
    {
      Checkpoint.play();
    }
    
    
    GameOver.visible = false;
    Restart.visible = false;

    //mover o chão
    ground.velocityX = -(6 + score/100);
    //pontuação
    score = score + Math.round(getFrameRate()/60);
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //pular quando a tecla espaço é pressionada
    if(keyDown("space")&& trex.y >=height*0.75) {
      Jump.play();  
      trex.velocityY = -13;
      touches = [];
    }
    
    //acrescentar gravidade
    trex.velocityY = trex.velocityY + 0.8
  
    //gerar as nuvens
    spawnClouds();
  
    //gerar obstáculos no chão
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
      Die.play();  
      gameState = END;
      //trex.velocityY = -13;
      //Jump.play();
    }
  }
   else if (gameState === END) {
    
    trex.changeAnimation("collided" , trex_collided);

    GameOver.visible = true;
    Restart.visible = true;
    
    
    
    ground.velocityX = 0;
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);

     obstaclesGroup.setLifetimeEach(-1);
     cloudsGroup.setLifetimeEach(-1);

     
   }
  
 
  //impedir que trex caia
  trex.collide(invisibleGround);
  
  if (mousePressedOver(Restart))
    {
      reset();
    }
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width,height*0.77,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //atribuir dimensão e tempo de vida ao obstáculo           
    obstacle.scale = 0.5;
    obstacle.lifetime = 380;
   
   //adicionar cada obstáculo ao grupo
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //escreva o código aqui para gerar nuvens
   if (frameCount % 60 === 0) {
     cloud = createSprite(width,height*0.2,40,10);
    cloud.y = Math.round(random(height*0.1,height*0.5));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //atribuir tempo de vida à variável
    cloud.lifetime = 400;
    
    //ajustar a profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adicionar nuvens ao grupo
   cloudsGroup.add(cloud);
    }
}

function reset () 
{
  gameState = PLAY;

  trex.changeAnimation("running", trex_running);

  Restart.visible = false;
  GameOver.visible = false;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  score = 0;

}