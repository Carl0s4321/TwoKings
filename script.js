const GRAVITY = 0.7;
const ATTACKBOXWIDTH = 150;
const ATTACKBOXHEIGHT = 50;
const JUMPHEIGHT = -20;
const MOVEMENTSPEED = 5;
const PLAYSPACEWIDTH = 1280;
const PLAYSPACEHEIGHT = 640;

const playSpace = document.getElementById('playSpace');
playSpace.style.width = `${PLAYSPACEWIDTH}px`;
playSpace.style.height = `${PLAYSPACEHEIGHT}px`;

// class Sprite{
//     constructor({id, position, imageSrc}) { // {a,b} to keep arguments clean. Order doesn't matter
//         this.element = document.getElementById(id);
//         this.element.src = imageSrc;
//         // this.image = new Image();
//         // this.image.src = 

//     }
// }

// const bgImg = new Sprite({
//     id: 'bgImg',
//     position: {
//         x: 0,
//         y: 0
//     },
//     imageSrc: "./assets/bg1.png"
// })

function drawBg({id, imageSrc}){
    element = document.getElementById(id);
    element.src = imageSrc;
}

drawBg({
    id: 'bgImg',
    imageSrc: "./assets/bg1.png"
});


class Player{
    constructor({id,attackBoxId, position, speed, color, offset}) { // {a,b} to keep arguments clean. Order doesn't matter
        this.element = document.getElementById(id);
        this.attackBoxElement = document.getElementById(attackBoxId);
        this.position = position;
        this.speed = speed;
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
        this.color = color;
        this.isAttacking;
        this.health = 100;
    }

    draw(){
        this.element.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
        this.element.style.width = `${this.width}px`;
        this.element.style.height = `${this.height}px`;
        this.element.style.backgroundColor = `${this.color}`;
    
        if(this.isAttacking){
            this.attackBoxElement.style.transform = `translate(${this.attackBox.position.x}px, ${this.attackBox.position.y}px)`;
            this.attackBoxElement.style.width = `${this.attackBox.width}px`;
            this.attackBoxElement.style.height = `${this.attackBox.height}px`;
            this.attackBoxElement.style.backgroundColor = 'green';
        }
    }

    update(){
        this.draw();
        // to make the attackbox doesnt directly link to the parent's position
        this.attackBox.position.y = this.position.y;
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        
        this.position.x += this.speed.x;
        this.position.y += this.speed.y;
        if(this.position.y + this.height + this.speed.y >= PLAYSPACEHEIGHT - 89){
            this.speed.y = 0;
        } 
        else if(this.position.y + this.speed.y <= 0){
            this.position.y = 0;
            this.speed.y += GRAVITY;
        }
        else{
            this.speed.y += GRAVITY;
        }
    }

    attack(){
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 100)
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
        x: 0,
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
        document.querySelector("#label").innerHTML = 'Tie';

    }
    else if(player1.health > player2.health){
        document.querySelector("#label").innerHTML = 'Player 1 Wins';
    }
    else if(player1.health < player2.health){
        document.querySelector("#label").innerHTML = 'Player 2 Wins';
    }
}

let time = 10;
let timeId; // to stop decreaseTimer() being called after game is done
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

decreaseTimer();

// make animation loop
function animate(){
    window.requestAnimationFrame(animate) // call animate function frame by frame
    playSpace.style.width = `${PLAYSPACEWIDTH}px`;
    playSpace.style.height = `${PLAYSPACEHEIGHT}px`;
    player1.update();
    player2.update();


    player1.speed.x = 0
    if(keys.d.pressed){
        player1.speed.x = MOVEMENTSPEED;
    }
    else if(keys.a.pressed){
        player1.speed.x = -MOVEMENTSPEED;
    }

    
    player2.speed.x = 0 // to stop when no keys is pressed
    if(keys.arrowRight.pressed){
        player2.speed.x = MOVEMENTSPEED;
    }
    else if(keys.arrowLeft.pressed){
        player2.speed.x = -MOVEMENTSPEED;
    }
    

    if (checkCollision({object1: player1, object2: player2}) && player1.isAttacking){
        player1.isAttacking = false;
        player2.health  -= 20;
        document.querySelector('#player2Health').style.width = player2.health + '%';
        console.log("hi");
    }

    if (checkCollision({object1: player2, object2: player1}) && player2.isAttacking){
        player2.isAttacking = false;
        player1.health  -= 20;
        document.querySelector('#player1Health').style.width = player1.health + '%';
        console.log("ih");
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
    space: {
        pressed: false
    },

    arrowLeft: {
        pressed: false
    },
    arrowRight: {
        pressed: false
    },
    arrowUp: {
        pressed: false
    },
    backSlash: {
        pressed: false
    },
}

window.addEventListener('keydown', (event) => {
    if (event.key == 'd'){
        keys.d.pressed = true;
        player1.attackBox.offset.x = 0; 
    }
    else if (event.key == 'a'){
        keys.a.pressed = true;
        player1.attackBox.offset.x = -(ATTACKBOXWIDTH/2);
    }
    else if (event.key == 'w'){
        // to stop spamming down w
        if(!keys.w.pressed){
            keys.w.pressed = true;
            player1.speed.y = JUMPHEIGHT;
        }
    }
    else if (event.key == ' '){
        if(!keys.space.pressed){
            keys.space.pressed = true;
            player1.attack();
        }
    }


    else if (event.key == 'ArrowRight'){
        keys.arrowRight.pressed = true;
        player2.attackBox.offset.x = 0; 
    }
    else if (event.key == 'ArrowLeft'){
        keys.arrowLeft.pressed = true;
        player2.attackBox.offset.x = -(ATTACKBOXWIDTH/2);
    }
    else if (event.key == 'ArrowUp'){
        if(!keys.arrowUp.pressed){
            keys.arrowUp.pressed = true;
            player2.speed.y = JUMPHEIGHT;
        }
    }
    else if (event.key == '\\'){
        if(!keys.backSlash.pressed){
            keys.backSlash.pressed = true;
            player2.attack();
        }
    }
}) 

window.addEventListener('keyup', (event) => {
    if (event.key == 'd'){
        keys.d.pressed = false;
    }
    else if (event.key == 'a'){
        keys.a.pressed = false;
    }
    else if (event.key == 'w'){
        keys.w.pressed = false;
    }
    else if (event.key == " "){
        keys.space.pressed = false;
    }


    else if (event.key == 'ArrowRight'){
        keys.arrowRight.pressed = false;
    }
    else if (event.key == 'ArrowLeft'){
        keys.arrowLeft.pressed = false;
    }
    else if (event.key == 'ArrowUp'){
        keys.arrowUp.pressed = false;
    }
    else if (event.key == '\\'){
        keys.backSlash.pressed = false;
    }
}) 

animate();