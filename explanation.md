<!-- Course: SENG 513 -->
<!-- Date: OCT 22, 2023 -->
<!-- Assignment 3 -->
<!-- Name: Carlos Sujanto -->
<!-- UCID: 30143341 -->
function checkCollision({object1, object2}){return(
           object1.position.x + object1.width >= object2.position.x 
        && object1.position.x <= object2.position.x + object2.width
        && object1.position.y + object1.height >= object2.position.y
        && object1.position.y <= object2.position.y + object2.height)}

    - This function detects if object1 and object2 collide with each other.
        - Imagine two rectangles, object1 and object2, with position, width, and height respectively.
        - Check Right Side: if right side of object1 is to the right of the left side of object2, then they might be touching.
        - Check Left Side: if left side of object1 is to the left of the right side of object2, then they might be touching.
        - Check Bottom Side: if the bottom of object1 is below or at the same level as the top of object2, then they might be touching.
        - Check Top Side: if the top of object1 is above or at the same level as the bottom of object2, then they might be touching.
        - If all conditions above is true, then object1 and object2 is touching.
    - Returns a boolean


function displayPlayerSprite({player, divWidth, divHeight, objectPos, imageWidth, playerImgId, playerSpriteSrc, steps}){
    player.width = divWidth;
    player.height = divHeight;

    const playerImg = document.getElementById(playerImgId);

    playerImg.style.width = imageWidth + "px";

    // CHATGPT GAVE ME THE IDEA TO INSERT THE WHOLE STRING
    const animationRule = `moveSpriteSheet 1s steps(${steps}) infinite`; 

    // Update the animation property of the element
    playerImg.style.animation = animationRule;

    playerImg.style.objectPosition = objectPos;

    playerImg.src = playerSpriteSrc;
}

    - This function diplays the character sprites.
        - It gets reference to the image element with the id and changes the css properties
        - Changes the image width dynamically
        - Changes the animationRule depending on how many steps each sprite needs (steps is passed in from the argument)
        - Changes the image's object position and the image sprite source.
    - Doesn't return anything


function isPlayerFacingEachOther(){
    if(player1.facingRight && !player2.facingRight){
        if(player1.position.x + player1.width < player2.position.x){
            // console.log("here");
            scenario = 1;
            return true;
        }
    }
    if(player2.facingRight && !player1.facingRight){
        if(player1.position.x > player2.position.x + player2.width){
            // console.log("here2");
            scenario = 2;
            return true;
        }
    }
    return false;
}

    - This function detecs if both player are facing each other.
        - The first condition sees if player1 is facing right and player2 is facing left. (p1>  <p2)
        - Since the player can move behind each other (<p2  p1>), we need another condition, player1 needs to be on the left of player2, then return true
        - The second condition sees if player2 is facing right and player1 is facing left. (p2> <p1)
        - Since the player can move behind each other (<p1  p2>), we need another condition, player2 needs to be on the left of player1, then return true
    - Returns a boolean