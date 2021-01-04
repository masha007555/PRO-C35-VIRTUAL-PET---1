//Create variables here
var dog,dogImg, happyDog, database, foodS, foodStock;
var start, startImg;
var milk,milkImg;
var bg,bg2;
var bark;
var PLAY = 1;
var END = 0;
var gameState = PLAY;

function preload()
{
  //load images here
  bg = loadImage("images/dog_house.jpg");
  bg2 = loadImage("images/bg2.jpg");
  dogImg = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");
  startImg = loadImage("images/start_icon.png");
  milkImg = loadImage("images/milk_bowl.png");
  bark = loadSound("bark.mp3");
}

function setup() {
  database = firebase.database();
  createCanvas(500, 500);

  start = createSprite(250,250,50,50);
  start.addImage(startImg);
  start.scale = 0.3;

  milk = createSprite(150,450,20,20);
  milk.addImage(milkImg);
  milk.scale = 0.04;

  dog = createSprite(200,400,20,30);
  dog.addImage(dogImg);
  dog.scale=0.2;

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);
}

function draw() {  
  background("orange");

  if (gameState === PLAY){
    background(bg2);
    start.visible = true;
    dog.visible = false;
    milk.visible = false;

    textSize(19);
    fill("black");
    strokeWeight("2");
    stroke("grey");
    text("HELLO! This is Ramesh Shuturmurgh",90,40);
    text("I am hungry and I need some milk",90,70);
    text("You can use the Up Arrow key to feed me",90,100);
    text("Ramesh is waiting for you to get some milk",80,160);
  
    if (mousePressedOver(start)){
      gameState=END;
    }
  }

  if (gameState === END){
    background(bg);
    start.visible = false;
    dog.visible = true;

    textSize(20);
    fill("black");
    strokeWeight("2");
    stroke("grey");
    text("Milk Left: "+foodS,320,70);

    if (keyWentDown(UP_ARROW)) {
      writeStock(foodS);
      dog.addImage(happyDog);
      bark.play();
      milk.visible = true;
    }
    else if (keyWentUp(UP_ARROW)){
      dog.addImage(dogImg);
      milk.visible = false;
    }
  }

  if (foodS<=0 && gameState === END){
    dog.visible = false;
    milk.visible = false;

    bark.pause();

    textSize(25);
    fill("black");
    strokeWeight("2");
    stroke("grey");
    text("Ops!! There is no more milk left",70,30);
  }

  drawSprites();
}

function readStock(data) {
  foodS = data.val();
}

function writeStock(x) {
  if (x<=0) {
    x=0
  } else {
    x=x-1;
  }

  database.ref('/').update({
    Food:x
  })

}