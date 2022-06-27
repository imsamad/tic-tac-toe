const boxes = document.querySelectorAll(".box");
var permissionChk = document.getElementById("permissionChk");
const restartBtn = document.getElementById("restartBtn");
const gameResult = document.getElementById("gameResult");
let LET_COMPUTER_PLAY = true;
const PRIMARY_PLAYER = "0";
let INITIAL_STATE = {
  primary: PRIMARY_PLAYER,
  nextTurn: undefined,
  boxRecords: new Array(9).fill(null),
  winner: undefined,
};
let GAME_STATE = {};
let IS_CIRCLE_TURN;
const STORAGE_KEY = "gameState";
let HAVE_FILLED_AUTOMATIC;
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

startGame();

function startGame() {
  const savedGameState = JSON.parse(localStorage.getItem(STORAGE_KEY));

  if (savedGameState) {
    IS_CIRCLE_TURN = savedGameState.nextTurn == "0" ? true : false;
    GAME_STATE = savedGameState;
  } else GAME_STATE = INITIAL_STATE;

  if (GAME_STATE.winner) {
    setWinnimgMessage(GAME_STATE.winner);
    // return;
  }

  boxes.forEach((box, index) => {
    if (GAME_STATE.boxRecords[index]) {
      box.textContent = GAME_STATE.boxRecords[index];
    } else {
      box.textContent = "";
      box.addEventListener("click", (e) => handleClick(boxes[index], index), {
        once: true,
      });
    }
  });
}

function handleClick(box, index) {
  if (GAME_STATE.winner) return;
  /* 1.) Place marker */
  const marker = IS_CIRCLE_TURN ? "0" : "X";
  box.textContent = marker;
  // Save Game State
  saveToStorage(marker, index);
  /// Check Winner
  const res = isWinner(marker);

  if (res) setWinner(marker);
  // Swap Turn
  else IS_CIRCLE_TURN = !IS_CIRCLE_TURN;
  HAVE_FILLED_AUTOMATIC = !HAVE_FILLED_AUTOMATIC;

  autoFillBox();
}

function saveToStorage(marker, index) {
  GAME_STATE.nextTurn = marker == "0" ? "X" : "0";
  GAME_STATE.boxRecords[index] = marker;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(GAME_STATE));
}

function isWinner(marker) {
  return WINNING_COMBINATIONS.some((comb) => {
    return comb.every((index) => GAME_STATE.boxRecords[index] == marker);
  });
}

const removeHandles = (cursorNotAllowed) => {
  boxes.forEach((box) => {
    if (cursorNotAllowed) box.style.cursor = "not-allowed";
    box.removeEventListener("click", handleClick);
  });
};

function setWinner(marker) {
  removeHandles(true);
  GAME_STATE.winner = marker;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(GAME_STATE));
  setWinnimgMessage(marker);
}

function setWinnimgMessage(marker) {
  let winnerPlayer = marker == PRIMARY_PLAYER ? "Player 1 Win" : "Player 2 Win";

  const h2Elem = document.createElement("h6");

  h2Elem.textContent = winnerPlayer;
  gameResult.appendChild(h2Elem);
}

restartBtn.addEventListener("click", restartGame);

function restartGame() {
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
  gameResult.innerHTML = "";
  removeHandles(false);
  startGame();
}

function getRndInteger(min = 0, max = 8) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
permissionChk.addEventListener("click", getPermission);
function getPermission(e) {
  console.log(e.checked);
}

function guessValue() {
  let rndNumb = getRndInteger();
  let i = 0;
  while (GAME_STATE.boxRecords[rndNumb]) {
    i++;
    rndNumb = getRndInteger();
    if (i == 100) {
      alert("We are unable to guess!Please fill a proper box");
      break;
    }
  }

  return rndNumb;
}

function autoFillBox() {
  const boxNumb = guessValue();
  // console.log(boxNumb, boxes[boxNumb]);
  handleClick(boxes[boxNumb], boxNumb);
}
