"use client";
import {
  actions,
  Board,
  initial_state,
  minimax,
  player as playerfunc,
  result,
  terminal,
  winner as winnerfunc,
} from "@/utils/action";
import { useEffect, useState } from "react";

let aiTurn = false;
let player = null;

export default function Home() {
  const [user, setUser] = useState<string | null>(null);
  const [board, setBoard] = useState(initial_state());
  const [xTurn, setXTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  useEffect(() => {
    setGameOver(terminal(board));
    setWinner(winnerfunc(board));
    player = playerfunc(board);
    if (user !== player && !gameOver) {
      if (aiTurn) {
        setTimeout(() => {
          const aiAction = minimax(board);
          if (!aiAction) {
            return;
          }
          // actions(board)[Math.floor(Math.random() * actions(board).length)];
          setBoard(result(board, aiAction));
          setXTurn(!xTurn);
          aiTurn = false;
        }, 500);
      }
    }
  }, [board, user, xTurn, gameOver]);

  function handleReset() {
    setBoard(initial_state());
    setUser(null);
    setXTurn(true);
    setGameOver(false);
    setWinner(null);
    aiTurn = false;
  }

  function handleClick(board: Board, i: number, j: number) {
    setXTurn(!xTurn);
    const newBoard = structuredClone(board);
    newBoard[i][j] = xTurn ? "X" : "O";
    setBoard(newBoard);
    aiTurn = true;
  }

  function Tile({
    option,
    "data-row": i,
    "data-cell": j,
  }: {
    option: string | null;
    "data-row": number;
    "data-cell": number;
  }) {
    return (
      <button
        onClick={() => handleClick(board, i, j)}
        data-row={i}
        data-cell={j}
        disabled={gameOver || option !== null || aiTurn}
        className={`${
          option === "X" ? "text-red-600" : "text-green-600"
        } flex w-24 h-24 justify-center items-center rounded-xl text-6xl font-bold border-white bg-zinc-300 shadow-md shadow-black`}>
        {option}
      </button>
    );
  }

  return (
    <section>
      <div className="container flex flex-col justify-center gap-3 items-center pt-3">
        <h1 className="text-4xl">Tic-Tac-Toe</h1>
        {user ? (
          <>
            <div>
              <p hidden={gameOver}>
                {xTurn ? "It's X turn now" : "It's O turn now"}
              </p>
              <p>
                {gameOver
                  ? winner
                    ? `The winner is ${winner}`
                    : "Tie game"
                  : "Game in progress"}
              </p>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              {board.map((row, i) => {
                return row.map((cell, j) => {
                  return (
                    <Tile
                      key={i * 3 + j}
                      data-row={i}
                      data-cell={j}
                      option={board[i][j]}
                    />
                  );
                });
              })}
            </div>
            <button
              className="border border-black rounded-md"
              onClick={handleReset}>
              Reset
            </button>
          </>
        ) : (
          <>
            <button
              className="btn bg-red-600 text-white rounded-md px-2"
              hidden={user !== null}
              onClick={() => setUser("X")}>
              Play as X (Goes first)
            </button>
            <button
              className="btn bg-green-600 text-white rounded-md px-2"
              hidden={user !== null}
              onClick={() => {
                setUser("O");
                aiTurn = true;
              }}>
              Play as O (Goes Second)
            </button>
          </>
        )}
      </div>
    </section>
  );
}
