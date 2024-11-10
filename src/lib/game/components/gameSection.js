import React, { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import "./gameSection.css";
import { Typography } from "@mui/material";

function GameSection() {
  const [cells, setCells] = useState(
    Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => ""))
  );
  const [winner, setWinner] = useState();
  const [score, setScore] = useState(0);
  const [open, setOpen] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  // Fetch Current State of Board
  const fetchBoard = async () => {
    try {
      const response = await axios.get("http://localhost:9000/game");
      setCells(response.data.board); // Set the board data from the API response
    } catch (err) {
      console.error("Error fetching board:", err);
    }
  };

  // Update the User's Move
  const postMove = async (row, col, currentPlayer) => {
    await axios
      .post("http://localhost:9000/move", null, {
        params: {
          row,
          col,
          currentPlayer,
        },
      })
      .then(async (response) => {
        // Fetch the current borad
        fetchBoard();

         //If this turn is user's turn and not win yet. it will the Bot's turn
        if (response.data.winner === null && currentPlayer === "X") {
          setShowLoading(true);
          await timeout(1000);
          handleOnBotTurn();
          setShowLoading(false);
        } else {
          // If this turn is user's turn and they win.
          await timeout(200);
          setWinner(response.data.winner);
          setScore(response.data.score);
          setOpen(response.data.winner !== null);
        }
      })
      .catch((err) => console.log(err));
  };

  // Function set deley
  const timeout = (delay) => {
    return new Promise((res) => setTimeout(res, delay));
  };

  // Reset Game
  const postReset = async () => {
    try {
      await axios.post("http://localhost:9000/reset");
      fetchBoard(); // Fetch the board state again after reset
    } catch (err) {
      console.log(err);
    }
  };

  // New Game
  const postNewGame = async () => {
    try {
      await axios.post("http://localhost:9000/newGame");
      fetchBoard(); // Fetch the board state again after new Game
    } catch (err) {
      console.log(err);
    }
  };

  const handleOnBotTurn = async () => {
    await postMove("", "", "O");
  };

  const handleOnClick = (row, col) => {
    if (winner || cells[row][col] !== "") return;
    postMove(row, col, "X");
  };

  const Cell = ({ row, col }) => {
    const cellValue = cells[row][col];
    const cellClassName = cellValue ? `cell cell-${cellValue}` : "cell";

    return (
      <td className={cellClassName} onClick={() => handleOnClick(row, col)}>
        {cellValue}
      </td>
    );
  };

  const handleOnClose = () => {
    setOpen(false);
    postNewGame();
    setCells(Array(9).fill(""));
    setWinner(null);
  };

  const handleReset = () => {
    postReset();
    setWinner(null);
    setScore(0);
    setCells(Array(9).fill(""));
  };

  const summaryDisplay = (result) => {
    switch (result) {
      case "X":
        return `You Win!!!`;
      case "O":
        return "You Lose!!!";
      case "Draw":
        return "Draw!!!";
      default:
        return "";
    }
  };

  return (
    <div className="gameSection-container">
      <header>
        <h2> Tic Tac Toe Game</h2>
      </header>
      <div className="score">Your Score : {score}</div>
      {showLoading && (
        <div className="loading-overlay">
          <CircularProgress />
        </div>
      )}
      <div className="table-container">
        <table>
          <tbody>
            <tr>
              <Cell row={0} col={0} />
              <Cell row={0} col={1} />
              <Cell row={0} col={2} />
            </tr>
            <tr>
              <Cell row={1} col={0} />
              <Cell row={1} col={1} />
              <Cell row={1} col={2} />
            </tr>
            <tr>
              <Cell row={2} col={0} />
              <Cell row={2} col={1} />
              <Cell row={2} col={2} />
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <Dialog
          open={open}
          onClose={handleOnClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            <Typography variant="h5">{"Summary"}</Typography>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {summaryDisplay(winner)}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleOnClose} autoFocus>
              Play again
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      <button className="reset-button" onClick={handleReset}>
        Reset Game
      </button>
    </div>
  );
}

export default GameSection;
