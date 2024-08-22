"use client";
import { Button } from "@/components/ui/button";
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
import useSound from "use-sound";

let aiTurn = false;
let player = null;
let aiFirstMove = false;

export default function Home() {
  const [user, setUser] = useState<string | null>(null);
  const [board, setBoard] = useState(initial_state());
  const [xTurn, setXTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [gameResetting, setGameResetting] = useState(false);
  const [playXsound] = useSound("/x_sound.mp3", { volume: 0.5 });
  const [playOsound] = useSound("/o_sound.mp3", { volume: 0.5 });
  const [playRestartSound] = useSound("/restart.mp3", { volume: 0.5 });
  const [playGameEnd] = useSound("/game-end.mp3", { volume: 0.5 });

  useEffect(() => {
    if (!gameResetting) {
      playGameEnd();
    }
  }, [gameOver]);

  useEffect(() => {
    if (!gameResetting) {
      if (xTurn) {
        playXsound();
      } else if (!xTurn) {
        playOsound();
      }
    }
  }, [board]);

  useEffect(() => {
    setGameOver(terminal(board));
    setWinner(winnerfunc(board));
    player = playerfunc(board);
    if (user !== player && !gameOver) {
      if (aiTurn) {
        let aiAction = null;
        if (aiFirstMove) {
          aiAction = actions(board)[Math.floor(Math.random() * 9)];
          aiFirstMove = false;
        } else {
          aiAction = minimax(board);
        }
        if (!aiAction) {
          return;
        }
        setTimeout(() => {
          // actions(board)[Math.floor(Math.random() * actions(board).length)];
          setBoard(result(board, aiAction));
          setXTurn(!xTurn);
          aiTurn = false;
        }, 500);
      }
    }
  }, [board, user, xTurn, gameOver]);

  function handleReset() {
    setGameResetting(true);
    setBoard(initial_state());
    setUser(null);
    setXTurn(true);
    setGameOver(false);
    setWinner(null);
    aiTurn = false;
    playRestartSound();
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
      <div className="container flex flex-col justify-center gap-10 items-center sm:pt-50 pt-40">
        <h1 className="text-6xl text-zinc-100">Tic-Tac-Toe</h1>
        {user ? (
          <>
            <div className="flex flex-col justify-center items-center ">
              <p hidden={gameOver} className="text-2xl">
                {aiTurn ? "AI thinking..." : "It's your turn now"}
              </p>
              <p hidden={!gameOver} className="text-4xl">
                {gameOver
                  ? winner
                    ? `The winner is ${winner}`
                    : "Tie game"
                  : "Game in progress.."}
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
            <Button
              size="sm"
              className="hover:bg-primary/50 transition-all duration-300 p-4 text-xl"
              onClick={handleReset}>
              Restart
            </Button>
          </>
        ) : (
          <>
            <p className="text-2xl leading-normal text-zinc-300">
              Choose your side and play against the AI!
              <br /> <span className="text-red-600 font-bold text-3xl">
                X
              </span>{" "}
              will start first and{" "}
              <span className="text-green-600 font-bold text-3xl">O</span> will
              start second.
            </p>
            <div className="flex gap-12">
              <Button
                size="lg"
                className=" text-red-600 font-bold text-6xl hover:text-white transition-all duration-200 bg-primary/20"
                hidden={user !== null}
                onClick={() => {
                  setUser("X");
                  setGameResetting(false);
                }}>
                X
              </Button>
              <Button
                size="lg"
                className="text-green-600 font-bold text-6xl hover:text-white transition-all duration-200 bg-primary/20"
                hidden={user !== null}
                onClick={() => {
                  setUser("O");
                  setGameResetting(false);
                  aiTurn = true;
                  aiFirstMove = true;
                }}>
                O
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
