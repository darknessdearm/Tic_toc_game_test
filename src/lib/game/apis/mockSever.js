const express = require("express");

const app = express();
const port = 3000;
// Handle the current board and current player with a GET request

let board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

let combos = {
  across: [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
  ],
  down: [
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
  ],
  diagonal: [
    [0, 4, 8],
    [2, 4, 6],
  ],
};

const stackCount = 0;
const winScore = 0;

const row_f = 3;
const col_f = 3;
app.get("/game", (req, res) => {
  res.json({
    board,
  });
});

// next move board
app.post("/move", (req, res) => {
  const { row, col, currentPlayer } = req.query;
  if (currentPlayer === "X") {
    if (board[row][col] === "") {
      board[row][col] = "X";
      res.json({
        board,
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

    res.json({
      board,
    });
  }
});

app.post("/score", (req, res) => {
  const { result } = req.query;
  if (result == "Win") {
    winScore++;
    stackCount++;
    if (stackCount === 3) {
      winScore++;
      stackCount = 0;
    }
    res.json({
      winScore,
      stackCount,
    });
  } else {
    stackCount = 0;
    res.json({
      winScore,
      stackCount,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
