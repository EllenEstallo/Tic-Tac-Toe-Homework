const socket = io();
//

const board = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
// This line gets all the elements with the class "cell" (these are the individual squares in the game) and stores them in the cells variable as a NodeList?.
const messageDisplay = document.getElementById("message");
// Here, it selects the HTML element with the ID of "message" and assigns it to messageDisplay. This is where you might display messages like "Player X wins!" or "It's a draw!".
const restartButton = document.getElementById("restart");
let currentPlayer = "X";
let boardState = ["", "", "", "", "", "", "", "", ""];
// This line creates an array boardState with 9 empty strings. Each string represents a cell on the board, and it will be used to track the game state (which player occupies which cell).
let isGameActive = true;
// This initializes a variable isGameActive to true. This will be used to keep track of whether the game is still active or has ended.

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
// This part defines an array called winningConditions, which contains all the possible combinations of indices that would result in a win in the game. Each sub-array represents a different winning condition.

function handleCellClick(index) {
  // This line defines a function named handleCellClick that takes one parameter called index. This index corresponds to the position of the cell that was clicked on the game board.
  if (boardState[index] !== "" || !isGameActive) {
    return;
  }
  // This conditional checks if the cell at the clicked index is already filled (not an empty string) or if the game is not active. If either condition is true, the function exits early and does nothing (returns).
  boardState[index] = currentPlayer;
  // // This line assigns the currentPlayer (either "X" or "O") to the chosen cell in the boardState array, marking that cell as filled by the current player.
  cells[index].innerText = currentPlayer;
  // Here, it updates the text of the cell element at the clicked index with the currentPlayer, visually representing the player's move on the board.
  //*** */
  socket.emit("makeMove", { index, player: currentPlayer }); // Emit move to server
  socket.on("moveMade", (data) => {
    // Listen for move from other player
    if (isGameActive) {
      boardState[data.index] = data.player;
      cells[data.index].innerText = data.player;
      checkResult();
    }
  });
  // ***

  checkResult();
  // Finally, this line calls the checkResult function to check if there is a winner or if the game has ended after the current player’s move.
}

function checkResult() {
  // This line defines a function named checkResult, which will check the current state of the game to see if there's a winner or if it’s a draw.
  for (let condition of winningConditions) {
    // This line starts a loop that iterates over each winning condition in the winningConditions array.
    const [a, b, c] = condition;
    // Here, it uses array destructuring to extract the three indices (a, b, c) from the current winning condition. These indices correspond to the positions in the boardState that need to be checked.
    if (boardState[a] === "" || boardState[b] === "" || boardState[c] === "") {
      // This conditional checks if any of the cells (at indices a, b, or c) are empty. If any of them are empty, the loop continues to the next winning condition.
      continue;
    }
    if (boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      // Here, it checks if the three cells in the current winning condition are all filled with the same player's marker.
      displayMessage(currentPlayer + " has won!");
      // If all three cells contain the same player's marker, this line calls the displayMessage function and shows a message indicating that the current player (X or O) has won.
      isGameActive = false;
      // This line sets isGameActive to false, indicating that the game is no longer active since there's a winner.
      return;
    }
  }
  // If a winner is found, the function exits. The loop ends since a winner has been declared.
  if (!boardState.includes("")) {
    // This line checks if there are no empty cells left in the boardState. If true, it means the game ended in a draw.
    displayMessage("It's a draw!");
    // If the above condition is satisfied, this line calls the displayMessage function to show a draw message.
    isGameActive = false;
  }
  // Again, this sets isGameActive to false since the game has ended due to a draw.
  currentPlayer = currentPlayer === "X" ? "O" : "X";
}
// Finally, this line toggles the currentPlayer between "X" and "O" for the next turn. If the current player is "X", it switches to "O", and vice versa.

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
