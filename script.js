const boxes = document.querySelectorAll(".box"),
  restartBtn = document.getElementById("restartBtn"),
  gameResult = document.getElementById("gameResult"),
  progress = document.getElementById("progress"),
  STORAGE_KEY = "gameState",
  WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
let PRIMARY_PLAYER = "O";
let permissionChk = document.getElementById("permissionChk"),
  LET_COMPUTER_PLAY = true,
  INITIAL_STATE = {
    primary: PRIMARY_PLAYER,
    nextTurn: PRIMARY_PLAYER,
    boxFilled: new Array(9).fill(null),
    winner: undefined,
  },
  IS_CIRCLE_TURN,
  GAME_STATE = {},
  HAVE_FILLED_AUTOMATIC;

startGame();

let IS_PROGRESSING = false;

function startGame() {
  permissionChk.checked = LET_COMPUTER_PLAY;
  // Retrive locally stored prev game state.
  const savedGameState = JSON.parse(localStorage.getItem(STORAGE_KEY));
  GAME_STATE = { ...INITIAL_STATE, ...savedGameState };

  // if (savedGameState) {
  //   GAME_STATE = savedGameState;
  // } else GAME_STATE = INITIAL_STATE;

  // If prev match have been winned then set simply, message
  if (GAME_STATE.winner) {
    setWinnimgMessage(GAME_STATE.winner);
  }

  boxes.forEach((box, index) => {
    // If already filled then textContent.
    // else Add evtHndlr for boxes who have not been filled prev game.
    if (GAME_STATE.boxFilled[index]) {
      box.textContent = GAME_STATE.boxFilled[index];
    } else if (!GAME_STATE.winner) {
      // console.log("first");
      box.textContent = "";
      box.addEventListener("click", () =>
        handleClick(boxes[index], index, true)
      );
    }
  });
}

function handleClick(box, index, manuallyFilled) {
  if (GAME_STATE.winner || IS_PROGRESSING) return;
  removeHandlesFromBox(index);
  // 1.) Place marker
  const marker = GAME_STATE.nextTurn;
  box.textContent = marker;
  // 2.) Save Game State.
  saveChanges(marker, index);
  box.disabled = true;
  // 3.) Check Winner
  const hasWin = isWinner(marker);

  if (hasWin) {
    setWinner(marker);
    return;
  }

  if (IS_PROGRESSING) IS_PROGRESSING = false;
  if (manuallyFilled && LET_COMPUTER_PLAY) {
    progress.style.display = "block";
    IS_PROGRESSING = true;
    setTimeout(() => {
      IS_PROGRESSING = false;
      autoFillBox();
      progress.style.display = "none";
    }, 300);
  }
}

function saveChanges(marker, index) {
  GAME_STATE.nextTurn = marker == "O" ? "X" : "O";
  GAME_STATE.boxFilled[index] = marker;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(GAME_STATE));
}

function isWinner(marker) {
  return WINNING_COMBINATIONS.some((comb) => {
    return comb.every((index) => GAME_STATE.boxFilled[index] == marker);
  });
}

function setWinner(marker) {
  removeHandles(false);
  GAME_STATE.winner = marker;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(GAME_STATE));
  setWinnimgMessage(marker);
}

function removeHandles(isReStarting) {
  boxes.forEach((box) => {
    if (!isReStarting) {
      box.disabled = true;
    } else {
      // console.log("text");
      box.textContent = "";
    }
    box.removeEventListener("click", (e) => handleClick(box));
  });
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
  // gameResult.innerHTML = "";
  // removeHandles(true);
  // startGame();
}

function getRndInteger(min = 0, max = 8) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
permissionChk.addEventListener("click", getPermission);

function getPermission(e) {
  LET_COMPUTER_PLAY = permissionChk.checked;
}

function autoFillBox() {
  let emptyFieldsIndexes = [];
  GAME_STATE.boxFilled.forEach((val, index) => {
    if (!val) emptyFieldsIndexes.push(index);
  });

  // console.log(emptyFields);
  const boxNumb = getRndInteger(0, emptyFieldsIndexes.length - 1);

  const box = boxes[boxNumb];
  // const box = boxes[boxNumb];
  // console.log(boxNumb, boxes[boxNumb]);

  // IS_PROGRESSING = true;
  // handleClick(box, boxNumb);
  // progress.style.display = "block";
  // progress.style.display = "none";
  // setTimeout(() => {
  //   IS_PROGRESSING = false;
  handleClick(box, boxNumb);
  //   progress.style.display = "none";
  // }, 300);
}

function removeHandlesFromBox(index, all) {
  let temp = all ? boxes : [boxes[index]];

  temp.forEach((b) =>
    b.removeEventListener("click", (e) => handleClick(b, boxNumb))
  );
}
