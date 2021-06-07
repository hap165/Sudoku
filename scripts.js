//load boards from a file or maunally
const easy = [
  "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
  "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
];
const medium = [
  "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
  "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
];
const hard = [
  "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
  "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
];
//Create Variables
let timer;
let timeRemaining;
let chances;
let selectedNum;
let selectedTile;
let disableSelect;

window.onload = function () {
  // run start game function when button is clicked.
  id("start-button").addEventListener("click", startgame);
  // add event listener to each number in the number container
  for (let i = 0; i < id("number-container").children.length; i++) {
    id("number-container").children[i].addEventListener("click", function () {
      // if selecting is not disabled
      if (!disableSelect) {
        //if number is already selected
        if (this.classList.contains("selected")) {
          // then remove gthe selection
          this.classList.remove("selected");
          selectedNum = null;
        } else {
          // deselect all other numbers
          for (let i = 0; i < 9; i++) {
            id("number-container").children[i].classList.remove("selected");
          }
          //select it and update selected num variable
          this.classList.add("selected");
          selectedNum = this;
          updateMove();
        }
      }
    });
  }
}

function startgame() {
  // choose board difficulty
  let board;
  if (id("Difficulty-1").checked) board = easy[0];
  else if (id("Difficulty-2").checked) board = medium[0];
  else board = hard[0];
  // set lives to 5 and enable selecting numbers and tiles
  chances = 5;
  disableSelect = false;
  id("chances").textContent = 'Chances remaining : ' + chances;
  //creates board based on the difficulty
  console.log("working?")
  generateBoard(board);
  //starts timer
  startTimer();
  //sets theme based on input
  if (id("Theme-1").checked) {
    qs("body").classList.remove("dark");
  } else {
    qs("body").classList.add("dark");
  }
  // show numbr container
  id("number-container").classList.remove("hidden");
}

function startTimer() {
  // sets time remaining based on input
  if (id("TimeLimit-1").checked) timeRemaining = 180;
  else if (id("TimeLimit-2").checked) timeRemaining = 300;
  else timeRemaining = 540;
  // sets the timer for the first second
  id("timer").textContent = timeConversion(timeRemaining);
  //sets timer to update every second
  timer = setInterval(function () {
    timeRemaining--;
    //if no time remianing end the game
    if (timeRemaining === 0) endGame();
    id("timer").textContent = timeConversion(timeRemaining)
  }, 1000)
}

//converts seconds int string of MM:SS format
function timeConversion(time) {
  let minutes = Math.floor(time / 60);
  if (minutes < 10) minutes = "0" + minutes;
  let seconds = time % 60;
  if (seconds < 10) seconds = "0" + seconds;
  return minutes + ":" + seconds;
}

function generateBoard(board) {
  // clear previous boards

  clearPrevious();
  // let used to increment tile ids
  let idCount = 0;
  //create 81 tiles
  for (let i = 0; i < 81; i++) {
    //create paragraph element
    let tile = document.createElement("p");
    if (board.charAt(i) !== "-") {
      //set tile to correct number
      tile.textContent = board.charAt(i);
    } else {
      // add click event listener to tile
      tile.addEventListener("click", function () {
        //if selecting is not disabled
        if (!disableSelect) {
          // if the tile is already selected
          if (tile.classList.contains("selected")) {
            // then remove selection
            tile.classList.remove("selected");
            selectedTile = null;
          } else {
            //deselect all other tiles
            for (let j = 0; j < 81; j++) {
              // console.log(qsa(".tile"))
              qsa(".tile")[i].classList.remove("selected");
            }
            // add selection and update variable
            tile.classList.add("selected");
            selectedTile = tile;
            updateMove();
          }
        }
      });
    }
    //assigned tile id
    // tile.setAttribute("id", idCount)
    tile.id = idCount;
    //increment for next tile
    idCount++;
    ////add tile class to all tiles

    tile.classList.add("tile");
    if (((tile.id) > 17 && (tile.id) < 27) || ((tile.id) > 44 && (tile.id) < 54)) {
      tile.classList.add("bottomBorder");
    }
    if (((tile.id) + 1) % 9 === 3 || ((tile.id) + 1) % 9 === 6) {
      tile.classList.add("rightborder");
    }
    // add tile to the board
    id("board").appendChild(tile);
  }
}

function updateMove() {
  // if a tile and number is selected
  if (selectedTile && selectedNum) {
    // set the tile to the correct number
    selectedTile.textContent = selectedNum.textContent;
    //if the number matches the corresponding number in the solution
    if (checkCorrect(selectedTile)) {
      // deselects the tile
      selectedTile.classList.remove("selected");
      selectedNum.classList.remove("selected");
      //clear the selected variables
      selectedNum = null;
      selectedTile = null;
      // check if board is completed
      if (checkDone()) {
        endGame();
      }
      //if the number does not match the solution key
    } else {
      //disable seelcting new numbers for one second
      disableSelect = true;
      //make tile turn red
      selectedTile.classList.add("incorrect");
      //run in one second
      setTimeout(function () {
        //substarct the chances by 1
        chances--;
        //if no chances left in the game
        if (chances === 0) {
          endGame();
        } else {
          //if lives is not = to 0
          // update the lives text
          id("chances").textContent = "chances remaining" + chances;
          //renable selecting numbers and tiles
          disableSelect = false;
        }
        // restore tile color and remove selected from both
        selectedTile.classList.remove("incorrect");
        selectedTile.classList.remove("selected");
        selectedNum.classList.remove("selected");
        // clear the tiles text and clear selected variables
        selectedTile.textContext = "";
        selectedTile = null;
        selectedNum = null;
      }, 1000);
    }
  }
}

function checkDone() {
  let tiles = qsa(".tile");
  for (let i = 0; i < tiles.length; i++) {
    if (tiles.textContent === "") return false;
  }
  return true;
}

function endGame() {
  //disable moves and stop the timer
  disableSelect = true;
  clearTimeout(timer);
  //display win or loss message
  if (chances === 0 || timeRemaining === 0) {
    id("chances").textContent = " You Lost!";
  } else {
    id("chances").textContent = "You Won!";
  }
}

function checkCorrect(tile) {
  // set solution based on difficulty selection
  let solution;
  if (id("Difficulty-1").checked) solution = easy[1];
  else if (id("Difficulty-2").checked) solution = medium[1];
  else solution = hard[1];
  //if tiles number is = to solution number
  return solution.charAt(tile.id) === tile.textContext;
}

function clearPrevious() {
  //access all the tiles
  let tiles = qsa(".tile");
  // remove each tiles
  console.log(tiles)
  if (tiles){
    for (let i = 0; i < tiles.length; i++) {
      tiles[i].remove();
    }
  }

  // if theres a timer we also clear that
  if (timer) clearTimeout(timer);
  //deselect any numbers
  for (let i = 0; i < id("number-container").children.length; i++) {
    id("number-container").children[i].classList.remove("selected");
  }
  //clear selected variables
  selectedTile = null;
  selectedNum = null;
}

// functions
function id(id) {
  return document.getElementById(id);
}

function qs(selector) {
  return document.querySelector(selector);
}

function qsa(selector) {
  return document.querySelector(selector);
}
  