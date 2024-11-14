const socket = io();
const board = document.getElementById("board");
const cells = document.querySelectorAll(".cell");

const messageDisplay = document.getElementById("message");
const restartButton = document.getElementById("restart");

let currentPlayer = "X";
let boardState = ["", "", "", "", "", "", "", "", ""];
let isGameActive = true;

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function handleCellClick(index) {
  if (boardState[index] !== "" || !isGameActive) {
    return;
  }
  boardState[index] = currentPlayer;
  cells[index].innerText = currentPlayer;
  socket.emit("makeMove", { index, player: currentPlayer }); // Emit move to server
  socket.on("moveMade", (data) => {
    // Listen for move from other player
    if (isGameActive) {
      boardState[data.index] = data.player;
      cells[data.index].innerText = data.player;
      checkResult();
    }
  });

  checkResult();
}

function checkResult() {
  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (boardState[a] === "" || boardState[b] === "" || boardState[c] === "") {
      continue;
    }
    if (boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      displayMessage(currentPlayer + " has won!");
      isGameActive = false;
      return;
    }
  }

  if (!boardState.includes("")) {
    displayMessage("It's a draw!");
    isGameActive = false;
  }
  currentPlayer = currentPlayer === "X" ? "O" : "X";
}

function displayMessage(message) {
  // This line defines a function named displayMessage that takes in the message parameter.
  messageDisplay.innerText = message;
}
// In this line, it updates the text of the messageDisplay element with the message provided, showing it on the screen.

function restartGame() {
  // This line defines a function named restartGame. This function will reset the game to its initial state when called.
  boardState = ["", "", "", "", "", "", "", "", ""];
  // This line reinitializes the boardState array with 9 empty strings, effectively resetting the game board so all cells are empty.
  isGameActive = true;
  // This line sets the isGameActive variable to true, indicating that the game has started again and is currently active.
  currentPlayer = "X";
  // Here, the currentPlayer is reset to "X", meaning Player X will take the first turn in this new game.
  messageDisplay.innerText = "";
  // This line clears any messages displayed (like "Player X has won!" or "It's a draw!") by setting the text of the messageDisplay element to an empty string.
  cells.forEach((cell) => {
    cell.innerText = "";
  });
}
// This part loops through each cell in the cells NodeList and sets the innerText of each cell to an empty string, visually resetting the game board on the screen.
cells.forEach((cell, index) => {
  // This line starts a loop that goes through each cell in the cells NodeList, also keeping track of the index of each cell.
  cell.addEventListener("click", () => handleCellClick(index));
  // Inside the loop, an event listener is added to each cell that listens for a click event. When a cell is clicked, it calls the handleCellClick function, passing in the current cell's index. This allows the game to respond to player moves accurately.
});
// This line closes the loop that was iterating over the cells.

restartButton.addEventListener("click", restartGame);
// This line adds a click event listener to the restartButton. When the button is clicked, the restartGame function is called, resetting the game to its initial state.
