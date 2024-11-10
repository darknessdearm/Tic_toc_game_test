const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors()); // Enable CORS for all domains
app.use(express.json());
const port = 9000;
// Handle the current board and current player with a GET request

let board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

let stackCount = 0;
let winScore = 0;
let winner = null;

// Check current board
app.get("/game", (req, res) => {
  res.json({
    board,
  });
});

// next move in the board
app.post("/move", (req, res) => {
  const { row, col, currentPlayer } = req.query;
  if (currentPlayer === "X") {
    if (board[row][col] === "") {
      board[row][col] = "X";
      winner = checkWinner(board);
      let score = updateScore(winner);
      res.json({
        board,
        winner,
        score,
      });
    } else {
      res.status(400).json({
        message: "Invalid move",
      });
    }
  } else {
    const emptySpots = [];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (board[r][c] === "") {
          emptySpots.push({ r, c });
        }
      }
    }

    // Choose a random spot
    if (emptySpots.length > 0) {
      const randomMove =
        emptySpots[Math.floor(Math.random() * emptySpots.length)];
      board[randomMove.r][randomMove.c] = "O";
    }
    winner = checkWinner(board);
    let score = updateScore(winner);
    res.json({
      board,
      winner,
      score,
    });
  }
});

// Check Winner
function checkWinner(board) {
  // Check rows, columns, and diagonals for a winner
  for (let i = 0; i < 3; i++) {
    if (
      board[i][0] &&
      board[i][0] === board[i][1] &&
      board[i][1] === board[i][2]
    ) {
      return board[i][0];
    }
    if (
      board[0][i] &&
      board[0][i] === board[1][i] &&
      board[1][i] === board[2][i]
    ) {
      return board[0][i];
    }
  }

  // Diagonals
  if (
    board[0][0] &&
    board[0][0] === board[1][1] &&
    board[1][1] === board[2][2]
  ) {
    return board[0][0];
  }
  if (
    board[0][2] &&
    board[0][2] === board[1][1] &&
    board[1][1] === board[2][0]
  ) {
    return board[0][2];
  }

  // Check for draw
  if (board.flat().every((cell) => cell !== "")) {
    return "Draw";
  }

  return null;
}

// Callculate Score Stack
function updateScore(result) {
  let score = 0;

  // Not win yet
  if (result === null) return winScore;

  if (result == "X") {
    //The winner is user
    score = winScore + 1;
    stackCount = stackCount + 1;
   
    if (stackCount === 3) {
      score = score + 1;
      stackCount = 0;
    }
    winScore = score;
    return score;
  } else if (result == "O") {
    // The winner is Bot
    score = winScore - 1;
    stackCount = 0;
    winScore = score;
    return score;
  } else {
    // It's draw
    stackCount = 0;
    winScore = score;
    return score;
  }
}

// reset board
app.post("/reset", (req, res) => {
  board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  winner = null;
  stackCount = 0;
  winScore = 0;
  res.json({
    board,
  });
});

// New Game
app.post("/newGame", (req, res) => {
  board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  winner = null;
  res.json({
    board,
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
