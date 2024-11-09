import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import "./gameSection.css";

const useFetch = (url) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(url).then(async (res) => {
      if (res.status !== 200) {
        setData("uh oh error!");
      }
      const data = await res.json();
      setData(data);
    });
  }, [setData, url]);

  return [data];
};

function GameSection(props) {
  const [turn, setTurn] = useState("X");
  const [cells, setCells] = useState(Array(9).fill(""));
  const [winner, setWinner] = useState();
  const [score, setScore] = useState(0);
  const [isDraw, setIsDraw] = useState(false);
  const [open, setOpen] = useState(false);

  
  const handleOnCalculateScore = (winner) => {
    let scoreCurrent = score;
    if (winner === "X") {
      scoreCurrent++;
    }
    setScore(scoreCurrent);
  };

  const checkwinner = (arr) => {
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
    for (let combo in combos) {
      combos[combo].forEach((pattern) => {
        if (
          arr[pattern[0]] === "" ||
          arr[pattern[1]] === "" ||
          arr[pattern[2]] === ""
        ) {
        } else if (
          arr[pattern[0]] === arr[pattern[1]] &&
          arr[pattern[1]] === arr[pattern[2]]
        ) {
          setWinner(arr[pattern[0]]);
          handleOnCalculateScore(winner);
          setOpen(true);
        }
      });
    }
  };

  const handleClick = (num) => {
    if (winner || cells[num] !== "") return;

    let arr = [...cells];
    if (turn === "X") {
      arr[num] = "X";
      setTurn("O");
    } else {
      arr[num] = "O";
      setTurn("X");
    }
    checkwinner(arr);
    setCells(arr);
    if (!arr.includes("") && !winner) {
      setIsDraw(true);
    }
  };

  const Cell = ({ num }) => {
    const cellValue = cells[num];
    const cellClassName = cellValue ? `cell cell-${cellValue}` : "cell";

    return (
      <td className={cellClassName} onClick={() => handleClick(num)}>
        {cellValue}
      </td>
    );
  };

  const handleOnClose = () => {
    setWinner();
    setIsDraw(false);
    setCells(Array(9).fill(""));
    setOpen(false);
  };

  const handleReset = () => {
    setWinner();
    setScore(0);
    setIsDraw(false);
    setCells(Array(9).fill(""));
    setOpen(false);
  };

  return (
    <div className="gameSection-container">
      <header>
        <h2> Tic Tac Toc Game</h2>
      </header>
      <div className="score">Your Score : {score}</div>
      <table>
        <tbody>
          <tr>
            <Cell num={0} />
            <Cell num={1} />
            <Cell num={2} />
          </tr>
          <tr>
            <Cell num={3} />
            <Cell num={4} />
            <Cell num={5} />
          </tr>
          <tr>
            <Cell num={6} />
            <Cell num={7} />
            <Cell num={8} />
          </tr>
        </tbody>
      </table>
      {winner !== "O" || isDraw ? (
        <div>
          <Dialog
            open={open}
            onClose={handleOnClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Summary"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {winner === "X"
                  ? `You Win!!!`
                  : isDraw
                  ? "Draw!!!"
                  : "You Lose!!!"}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleOnClose} autoFocus>
                OK
              </Button>
            </DialogActions>
          </Dialog>
          <button className="reset-button" onClick={handleReset}>
            Reset
          </button>
        </div>
      ) : (
        <button className="reset-button" onClick={handleReset}>
          Reset
        </button>
      )}
    </div>
  );
}

export default GameSection;
