const player1 = document.querySelector("#player1");
const player2 = document.querySelector("#player2");
const player1Zone = document.querySelector("#player1-zone");
const player2Zone = document.querySelector("#player2-zone");
const player1Picture = document.querySelector("#player1-photo");
const player2Picture = document.querySelector("#player2-photo");
const blockTop = document.querySelector("#block-top");
const blockBottom = document.querySelector("#block-bottom");
const hole = document.querySelector("#hole");
const playBtn = document.querySelector("#play");
const player1Count = document.querySelector("#player1-count");
const player2Count = document.querySelector("#player2-count");
const gameCount = document.querySelector("#count");

// prevent double tap zoom and pinch zoom on mobile devices
player1Zone.addEventListener("touchstart", function (e) {
  e.preventDefault();
  player1Zone.click();
});
player1Zone.addEventListener("touchend", function (e) {
  e.preventDefault();
  player1Zone.click();
});
player1Picture.addEventListener("touchstart", function (e) {
  e.preventDefault();
  player1Picture.click();
});
player1Picture.addEventListener("touchend", function (e) {
  e.preventDefault();
  player1Picture.click();
});
player2Zone.addEventListener("touchstart", function (e) {
  e.preventDefault();
  player2Zone.click();
});
player2Zone.addEventListener("touchend", function (e) {
  e.preventDefault();
  player2Zone.click();
});
player2Picture.addEventListener("touchstart", function (e) {
  e.preventDefault();
  player2Picture.click();
});
player2Picture.addEventListener("touchend", function (e) {
  e.preventDefault();
  player2Picture.click();
});

// settings global variables values``
let counter = 0;
let player1Counter = 0;
let player2Counter = 0;
let player1Jumping = 0;
let player2Jumping = 0;
let player1Alive = true;
let player2Alive = true;

// check if all players are dead and stop the game
const gameEnd = (winner, winnerCount) => {
  if (!player1Alive && !player2Alive) {
    // stop the flowers
    blockTop.classList.remove("animate");
    blockBottom.classList.remove("animate");
    hole.classList.remove("animate");

    // waiting screen bees animation
    player1.classList.add("fly");
    player2.classList.add("fly2");

    //display the winner
    gameCount.innerHTML = winner + " WIN <br> SCORE : " + winnerCount;

    // activate play button
    playBtn.addEventListener("touchstart", launchGame);
  }
};

// after each end of animation +1 scores
hole.addEventListener("animationiteration", () => {
  // generating the hole position and flowers height
  let random = Math.random() * 350;
  hole.style.top = random + "px";
  blockTop.style.height = random + "px";
  blockBottom.style.height = 500 - 150 - random + "px";

  // +1 game score
  counter++;
  gameCount.textContent = counter;

  // if the player is alive +1 his score
  if (player1Alive) {
    player1Counter++;
    player1Count.textContent = player1Counter;
  }
  if (player2Alive) {
    player2Counter++;
    player2Count.textContent = player2Counter;
  }
});

// jumping ability for player 1
function player1Jump() {
  player1Jumping = 1;
  let player1JumpCount = 0;
  let player1JumpInterval = setInterval(function () {
    // get the player's top pixel
    let player1Top = parseInt(
      window.getComputedStyle(player1).getPropertyValue("top")
    );
    // reduce the top property to up the player
    if (player1Top > 5 && player1JumpCount < 12) {
      player1.style.top = player1Top - 4 + "px";
    }
    // stop the jumping animation
    if (player1JumpCount > 20) {
      clearInterval(player1JumpInterval);
      player1Jumping = 0;
      player1JumpCount = 0;
    }
    player1JumpCount++;
  }, 10);
}

// jumping ability for player 2
function player2Jump() {
  player2Jumping = 1;
  let player2JumpCount = 0;
  let player2JumpInterval = setInterval(function () {
    // get the player's top pixel
    let player2Top = parseInt(
      window.getComputedStyle(player2).getPropertyValue("top")
    );
    // reduce the top property to up the player
    if (player2Top > 5 && player2JumpCount < 12) {
      player2.style.top = player2Top - 4 + "px";
    }
    // stop the jumping animation
    if (player2JumpCount > 20) {
      clearInterval(player2JumpInterval);
      player2Jumping = 0;
      player2JumpCount = 0;
    }
    player2JumpCount++;
  }, 10);
}

// reset all values, animate flowers, add jumping ability and launch the game
const launchGame = () => {
  // disable play button
  playBtn.removeEventListener("touchstart", launchGame);

  // remove waiting screen fly animation
  player1.classList.remove("fly");
  player2.classList.remove("fly2");

  // reset the pictures
  player1Picture.src = "./images/bee_pink.png";
  player2Picture.src = "./images/bee_yellow.png";

  // reset all stats
  counter = 0;
  player1Jumping = 0;
  player2Jumping = 0;
  player1Counter = 0;
  player2Counter = 0;
  let winner = "";
  let winnerCount = "";
  player1Alive = true;
  player2Alive = true;
  player1Count.textContent = 0;
  player2Count.textContent = 0;
  gameCount.textContent = 0;

  // set the position of bees
  player1.style.top = "200px";
  player2.style.top = "200px";

  // animate the flowers
  blockTop.classList.add("animate");
  blockBottom.classList.add("animate");
  hole.classList.add("animate");

  // add the jumping ability
  player1Zone.addEventListener("touchstart", player1Jump);
  player1Picture.addEventListener("touchstart", player1Jump);
  player2Zone.addEventListener("touchstart", player2Jump);
  player2Picture.addEventListener("touchstart", player2Jump);

  // for player 1
  let player1Interval;
  player1Interval = setInterval(function () {
    // knowing the player's top pixel
    let player1Top = parseInt(
      window.getComputedStyle(player1).getPropertyValue("top")
    );

    // when not jumping activate gravity
    if (player1Jumping === 0) {
      player1.style.top = player1Top + 3 + "px";
    }

    // knowing the block horizontal position
    let blockLeft = parseInt(
      window.getComputedStyle(blockTop).getPropertyValue("left")
    );

    // knowing the hole's top pixel
    let holeTop = parseInt(
      window.getComputedStyle(hole).getPropertyValue("top")
    );

    // check if the player hits a block (flower)
    if (
      player1Top > 500 ||
      (blockLeft < 60 &&
        blockLeft > -10 &&
        (player1Top < holeTop || player1Top > holeTop + 150))
    ) {
      // remove ability to jump
      player1Zone.removeEventListener("touchstart", player1Jump);
      player1Picture.removeEventListener("touchstart", player1Jump);
      // player is dead and change the picture
      player1Alive = false;
      player1Picture.src = "./images/bee_lose.png";
      clearInterval(player1Interval);
      // if the other player is dead then this player is the winner
      if (!player2Alive) {
        winner = "Pink";
        winnerCount = player1Counter;
      }
      // check if all players are dead
      gameEnd(winner, winnerCount);
    }
  }, 10);

  // for player 2
  let player2Interval;
  player2Interval = setInterval(function () {
    // knowing the player's top pixel
    let player2Top = parseInt(
      window.getComputedStyle(player2).getPropertyValue("top")
    );

    // when not jumping activate gravity
    if (player2Jumping === 0) {
      player2.style.top = player2Top + 3 + "px";
    }

    // knowing the block horizontal position
    let blockLeft = parseInt(
      window.getComputedStyle(blockTop).getPropertyValue("left")
    );

    // knowing the block horizontal position
    let holeTop = parseInt(
      window.getComputedStyle(hole).getPropertyValue("top")
    );

    // check if the player hits a block (flower)
    if (
      player2Top > 500 ||
      (blockLeft < 160 &&
        blockLeft > 90 &&
        (player2Top < holeTop || player2Top > holeTop + 150))
    ) {
      // remove ability to jump
      player2Zone.removeEventListener("touchstart", player2Jump);
      player2Picture.removeEventListener("touchstart", player2Jump);
      // player is dead and change the picture
      player2Alive = false;
      player2Picture.src = "./images/bee_lose.png";
      clearInterval(player2Interval);
      // if the other player is dead then this player is the winner
      if (!player1Alive) {
        winner = "Yellow";
        winnerCount = player2Counter;
      }
      // check if all players are dead
      gameEnd(winner, winnerCount);
    }
  }, 10);
};

// play button to start the game
playBtn.addEventListener("touchstart", launchGame);
