/* Course: SENG 513 */
/* Date: OCT 22, 2023 */
/* Assignment 2 */
/* Name: Carlos Sujanto */
/* UCID: 30143341 */

const GRAVITY = 0.7;
const ATTACKBOXWIDTH = 125;
const ATTACKBOXHEIGHT = 130;
const JUMPHEIGHT = -15;
const MOVEMENTSPEED = 5;
const PLAYSPACEWIDTH = 1280;
const PLAYSPACEHEIGHT = 640;
const GAMETIME = 10;

const playSpace = document.getElementById('playSpace');
playSpace.style.width = `${PLAYSPACEWIDTH}px`;
playSpace.style.height = `${PLAYSPACEHEIGHT}px`;


const swingAudio = document.getElementById("swingAudio"); // sword swing
const grunt1Audio = document.getElementById("grunt1"); // grunt1Audio 
const grunt2Audio = document.getElementById("grunt2"); // grunt2Audio 
const ambientAudio = document.getElementById("ambientAudio"); // grunt2Audio 
const startGameAudio = document.getElementById("startEndGameAudio"); // grunt2Audio 

class Player{
    constructor({id,attackBoxId, position, speed, color, offset}) { // {a,b} to keep arguments clean. Order doesn't matter
        this.id = id;
        this.element = document.getElementById(id);
        this.attackBoxElement = document.getElementById(attackBoxId);
        this.position = position;
        this.speed = speed;
        // DIMENSIONS OF PLAYER
        this.width = 75;
        this.height = 130;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset, // passing in offset
            width: ATTACKBOXWIDTH,
            height: ATTACKBOXHEIGHT
        }
        this.color = color; //TESTING PURPOSE
        this.isAttacking;
        this.health = 100;
        this.facingRight = null; // FOR ANIMATION
    }

    // TO MOVE THE DIVS (PLAYER AND ATTACK BOXES)
    draw(){
        // PLAYER1 FACING LEFT WHILE ATTACKING (OFFSET OF 150PX)
        if(!this.facingRight && this.id === 'player1' && keys.c.pressed){
            this.element.style.transform = `translate(${this.position.x - 150}px, ${this.position.y}px)`;
        }
        // PLAYER2 FACING LEFT WHILE ATTACKING (OFFSET OF 150PX)
        // change keys.n.pressed to this.isAttacking if want to fix multiple key pressing bug, but animation is weird
        else if(!this.facingRight && this.id === 'player2' && keys.n.pressed){ 
            this.element.style.transform = `translate(${this.position.x - 150}px, ${this.position.y}px)`;
        }
        else{
            this.element.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
        }
        this.element.style.width = `${this.width}px`;
        this.element.style.height = `${this.height}px`;
        // TESTING PURPOSE
        this.element.style.backgroundColor = `${this.color}`;
    
        if(this.isAttacking){
            this.attackBoxElement.style.transform = `translate(${this.attackBox.position.x}px, ${this.attackBox.position.y}px)`;
            this.attackBoxElement.style.width = `${this.attackBox.width}px`;
            this.attackBoxElement.style.height = `${this.attackBox.height}px`;
            // TESTING PURPOSE
            this.attackBoxElement.style.backgroundColor = 'green';
        }
    }

    update(){
        this.draw();
        // to make the attackbox doesnt directly link to the parent's position
        this.attackBox.position.y = this.position.y;
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        
        // updating positions of the player
        this.position.x += this.speed.x;
        this.position.y += this.speed.y;
        // player can't jump outside the playspace
        if(this.position.y + this.height + this.speed.y >= PLAYSPACEHEIGHT - 89){
            this.speed.y = 0;
        } 
        else if(this.position.y + this.speed.y <= 0){
            this.position.y = 0;
            this.speed.y += GRAVITY;
        }
        else{
            this.speed.y += GRAVITY; // player fall
        }
    }

    attack(){
        this.isAttacking = true;
        // setTimeout(() => {
        //     this.isAttacking = false;
        // }, 1000)
    }
}

const player1 = new Player({
    id: 'player1',
    attackBoxId: 'attackBox1',
    position: {
        x:280,
        y:200
    },
    speed:{
        x:0,
        y:0
    },
    offset:{
        x: (ATTACKBOXWIDTH/2),
        y:0
    },
    color: 'blue'
});

const player2 = new Player({
    id: 'player2',
    attackBoxId: 'attackBox2',
    position: {
        x:915,
        y:200
    },
    speed:{
        x:0,
        y:0
    },
    offset:{
        x: -(ATTACKBOXWIDTH/2),
        y:0
    },
    color: 'red'
});

function declareWinner({player1, player2, timeId}){
    clearTimeout(timeId);
    document.querySelector('#label').style.display = 'flex';
    if (player1.health === player2.health){
        document.querySelector("#label").innerHTML = 'Tie!';

    }
    else if(player1.health > player2.health){
        document.querySelector("#label").innerHTML = 'Player 1 Wins!';
    }
    else if(player1.health < player2.health){
        document.querySelector("#label").innerHTML = 'Player 2 Wins!';
    }
}


function decreaseTimer(){
    if(time > 0){
        timeId = setTimeout(decreaseTimer, 1000);
        time--;
        document.querySelector(".timer").innerHTML = time;
    }
    
    if (time === 0){
       declareWinner({player1, player2, timeId});
    }
}

function displayPlayerSprite({player, divWidth, divHeight, objectPos, imageWidth, playerImgId, playerSpriteSrc, steps}){
    player.width = divWidth;
    player.height = divHeight;

    const playerImg = document.getElementById(playerImgId);

    playerImg.style.width = imageWidth + "px";

    // Create the updated animation rule with the new steps value
    const animationRule = `moveSpriteSheet 1s steps(${steps}) infinite`;

    // Update the animation property of the element
    playerImg.style.animation = animationRule;

    playerImg.style.objectPosition = objectPos;

    playerImg.src = playerSpriteSrc;
}

// make animation loop
function animate(){
    window.requestAnimationFrame(animate) // call animate function frame by frame
    player1.update();
    player2.update();

    // player1 facing right by default
    if(player1.facingRight || player1.facingRight === null){
        displayPlayerSprite({player: player1, objectPos:"-150px -117px", imageWidth: 3000,divWidth: 75, divHeight: 130, playerImgId: "player1Sprite", playerSpriteSrc: "./assets/player1/Idle.png", steps: 8});
        player1.facingRight = true;
    }
    // player1 facing left
    else if(!player1.facingRight){
        displayPlayerSprite({player: player1, objectPos:"-150px -117px", imageWidth: 3000,divWidth: 75, divHeight: 130, playerImgId: "player1Sprite", playerSpriteSrc: "./assets/player1/IdleL.png", steps: 8});
        player1.facingRight = false;
    }
   
    player1.speed.x = 0 // to stop when no keys is pressed

    if(keys.d.pressed){
        // player cant go outside playspace
        if(player1.position.x + player1.width + player1.speed.x >= PLAYSPACEWIDTH){
            player1.speed.x = 0;
        }else{
            player1.speed.x = MOVEMENTSPEED;
        }
        displayPlayerSprite({player: player1, objectPos:"-132px -117px",imageWidth: 3000, divWidth: 100, divHeight: 130, playerImgId: "player1Sprite", playerSpriteSrc: "./assets/player1/Run.png", steps: 8});
    }
    else if(keys.a.pressed){
        // player cant go outside playspace
        if(player1.position.x - player1.speed.x <= 0){
            player1.speed.x = 0;
        }else{
            player1.speed.x = -MOVEMENTSPEED;
        }
        displayPlayerSprite({player: player1, objectPos:"-132px -117px",imageWidth: 3000, divWidth: 100, divHeight: 130, playerImgId: "player1Sprite", playerSpriteSrc: "./assets/player1/RunL.png", steps: 8});
    }
    else if(keys.w.pressed){
        if(player1.facingRight){
            displayPlayerSprite({player: player1, objectPos:"-140px -110px",imageWidth: 728, divWidth: 91, divHeight: 130, playerImgId: "player1Sprite", playerSpriteSrc: "./assets/player1/Jump.png", steps: 2});   
        }
        else if(!player1.facingRight){
            displayPlayerSprite({player: player1, objectPos:"-140px -110px",imageWidth: 728, divWidth: 91, divHeight: 130, playerImgId: "player1Sprite", playerSpriteSrc: "./assets/player1/JumpL.png", steps: 2});    
        }
    }
    else if(keys.c.pressed){
        if(player1.facingRight){
            displayPlayerSprite({player: player1, objectPos:"-71px -156px",imageWidth: 350, divWidth: 235, divHeight: 130, playerImgId: "player1Sprite", playerSpriteSrc: "./assets/player1/Attack1Short.png", steps: 1});
        }
        else if(!player1.facingRight){
            displayPlayerSprite({player: player1, objectPos:"-45px -156px",imageWidth: 350, divWidth: 235, divHeight: 130, playerImgId: "player1Sprite", playerSpriteSrc: "./assets/player1/Attack1ShortL.png", steps: 1});
        }
        
    }
    
    // player2 facing left by default
    if(!player2.facingRight || player2.facingRight === null){
        displayPlayerSprite({player: player2, objectPos:"-100px -52px", imageWidth: 1450,divWidth: 75, divHeight: 130, playerImgId: "player2Sprite", playerSpriteSrc: "./assets/player2/IdleL.png", steps: 6});
        player2.facingRight = false;
    }
    // player2 facing right
    else if(player2.facingRight){
        displayPlayerSprite({player: player2, objectPos:"-65px -52px", imageWidth: 1450,divWidth: 75, divHeight: 130, playerImgId: "player2Sprite", playerSpriteSrc: "./assets/player2/Idle.png", steps: 6});
        player2.facingRight = true;
    }

    player2.speed.x = 0 // to stop when no keys is pressed
    if(keys.l.pressed){
        // player cant go outside playspace
        if(player2.position.x + player2.width + player2.speed.x >= PLAYSPACEWIDTH){
            player2.speed.x = 0;
        }else{
            player2.speed.x = MOVEMENTSPEED;
        }
        displayPlayerSprite({player: player2, objectPos:"-35px -53px", imageWidth: 2000,divWidth: 120, divHeight: 130, playerImgId: "player2Sprite", playerSpriteSrc: "./assets/player2/Run.png", steps: 8});
    }
    else if(keys.j.pressed){
        // player cant go outside playspace
        if(player2.position.x - player2.speed.x <= 0){
            player2.speed.x = 0;
        }else{
            player2.speed.x = -MOVEMENTSPEED;
        }
        displayPlayerSprite({player: player2, objectPos:"-100px -53px", imageWidth: 2000,divWidth: 120, divHeight: 130, playerImgId: "player2Sprite", playerSpriteSrc: "./assets/player2/RunL.png", steps: 8});
    }
    else if(keys.i.pressed){
        if(player2.facingRight){
            displayPlayerSprite({player: player2, objectPos:"-65px -53px", imageWidth: 490,divWidth: 80, divHeight: 130, playerImgId: "player2Sprite", playerSpriteSrc: "./assets/player2/Jump.png", steps: 2});
        }
        else if(!player2.facingRight){
            displayPlayerSprite({player: player2, objectPos:"-100px -53px", imageWidth: 490,divWidth: 80, divHeight: 130, playerImgId: "player2Sprite", playerSpriteSrc: "./assets/player2/JumpL.png", steps: 2});
        }
       }
    else if(keys.n.pressed){
        if(player2.facingRight){
            displayPlayerSprite({player: player2, objectPos:"-5px -62px", imageWidth: 250,divWidth: 235, divHeight: 130, playerImgId: "player2Sprite", playerSpriteSrc: "./assets/player2/Attack_1Short.png", steps: 1});
        }
        else if(!player2.facingRight){
            displayPlayerSprite({player: player2, objectPos:"-5px -62px", imageWidth: 250,divWidth: 235, divHeight: 130, playerImgId: "player2Sprite", playerSpriteSrc: "./assets/player2/Attack_1ShortL.png", steps: 1});
        }
    }

    // Player 2 hit
    if (checkCollision({object1: player1, object2: player2}) && player1.isAttacking){
        player1.isAttacking = false;
        player2.health  -= 20;
        document.querySelector('#player2Health').style.width = player2.health + '%';
        grunt2Audio.play();
        //play hit animation
        // displayPlayerSprite({player: player2, objectPos:"-70px -45px", imageWidth: 907,divWidth: 80, divHeight: 130, playerImgId: "player2Sprite", playerSpriteSrc: "./assets/player2/Hit.png", steps: 4});
    }

    // Player 1 hit
    if (checkCollision({object1: player2, object2: player1}) && player2.isAttacking){
        player2.isAttacking = false;
        player1.health  -= 20;
        document.querySelector('#player1Health').style.width = player1.health + '%';
        grunt1Audio.play();
        //play hit animation
    }

    if(player1.health <= 0 || player2.health <= 0){
        declareWinner({player1, player2, timeId})
    }
}

// if RHS of p1 attack box >= LHS of p2
// if LHS of p1 attack box <= RHS of p2
// if bottom of p1 attack box >= top of p2 attack box
// if bottom of p1 attack box <= bottom of p2
// collision
function checkCollision({object1, object2}){
    return(    
           object1.attackBox.position.x + object1.attackBox.width >= object2.position.x 
        && object1.attackBox.position.x <= object2.position.x + object2.width
        && object1.attackBox.position.y + object1.attackBox.height >= object2.position.y
        && object1.attackBox.position.y <= object2.position.y + object2.height)
}

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    c: {
        pressed: false
    },

    j: {
        pressed: false
    },
    l: {
        pressed: false
    },
    i: {
        pressed: false
    },
    n: {
        pressed: false
    },
}


window.addEventListener('keydown', (event) => {
    // player can only move while alive
    if(player1.health > 0){
        if (event.key == 'd'){
            keys.d.pressed = true;
            player1.attackBox.offset.x = player1.width + 35 ; 
        }
        else if (event.key == 'a'){
            keys.a.pressed = true;
            player1.attackBox.offset.x = -(ATTACKBOXWIDTH + 25);
        }
        else if (event.key == 'w'){
            // to stop spamming down w
            if(!keys.w.pressed){
                keys.w.pressed = true;
                player1.speed.y = JUMPHEIGHT;
            }
        }
        else if (event.key == 'c'){
            // to stop spamming down attack
            if(!keys.c.pressed){
                keys.c.pressed = true;
                player1.attack();
                swingAudio.play();
            }
        }
    }
    // player can only move while alive
    if(player2.health > 0){
        if (event.key == 'l'){
            keys.l.pressed = true;
            player2.attackBox.offset.x = 0; 
        }
        else if (event.key == 'j'){
            keys.j.pressed = true;
            player2.attackBox.offset.x = -(ATTACKBOXWIDTH/1.5);
        }
        else if (event.key == 'i'){
            // to stop spamming down jump
            if(!keys.i.pressed){
                keys.i.pressed = true;
                player2.speed.y = JUMPHEIGHT;
            }
        }
        else if (event.key == 'n'){
            // to stop spamming down attack
            if(!keys.n.pressed){
                keys.n.pressed = true;
                player2.attack();
                swingAudio.play();
            }
        }
    }
    
}) 

window.addEventListener('keyup', (event) => {
    if (event.key == 'd'){
        keys.d.pressed = false;
        player1.facingRight = true;
    }
    else if (event.key == 'a'){
        keys.a.pressed = false;
        player1.facingRight = false;
    }
    else if (event.key == 'w'){
        keys.w.pressed = false;
    }
    else if (event.key == "c"){
        keys.c.pressed = false;
        player1.isAttacking = false;
    }


    else if (event.key == 'l'){
        keys.l.pressed = false;
        player2.facingRight = true;
    }
    else if (event.key == 'j'){
        keys.j.pressed = false;
        player2.facingRight = false;
    }
    else if (event.key == 'i'){
        keys.i.pressed = false;
    }
    else if (event.key == 'n'){
        keys.n.pressed = false;
        player2.isAttacking = false;
    }
}) 

let time = GAMETIME;
let timeId; // to stop decreaseTimer() being called after game is done

function showGame(){
    const game = document.querySelector(".game")
    game.style.display= "inline-block";

    const gameStartButton = document.querySelector(".app button")
    gameStartButton.style.display= "none";
    scrollToTarget();
    startGameAudio.play();
    playAmbientAudio();

    decreaseTimer();
    animate();  

}

function scrollToTarget(){
    const targetElement = document.querySelector(".game");
    targetElement.scrollIntoView({behavior: "smooth"});
}


function playAmbientAudio(){
    ambientAudio.volume = 0.5;
    ambientAudio.loop = true;
    ambientAudio.play();
}