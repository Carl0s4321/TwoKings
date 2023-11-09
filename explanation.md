function checkCollision({object1, object2}){
    return(    
           object1.attackBox.position.x + object1.attackBox.width >= object2.position.x 
        && object1.attackBox.position.x <= object2.position.x + object2.width
        && object1.attackBox.position.y + object1.attackBox.height >= object2.position.y
        && object1.attackBox.position.y <= object2.position.y + object2.height)
}

imagine two rectangles, with topleft coordinate (x1,y1) and (x2,y2) for each. If one rectangle is to the left or above the other, they can't collide. 



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

this part of the code is to display the character sprites. It gets reference to the image element with the id and changes the css properties: changes the image width dynamically, changes the animationRule depending on how many steps each sprite needs, changes the image's object position and the image sprite source. 

