export const X = "X";
export const O = "O";
export const EMPTY = null;
export type Board = [
  [string | null, string | null, string | null],
  [string | null, string | null, string | null],
  [string | null, string | null, string | null]
];

export function initial_state(): Board {
  // Returns starting state of the board.
  return [
    [EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY],
  ];
}

export function player(board: Board) {
  // Returns player who has the next turn on a board
  let xNum = 0;
  let oNum = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === X) {
        xNum++;
      } else if (board[i][j] === O) {
        oNum++;
      }
    }
  }
  if (xNum === oNum) {
    return X;
  } else {
    return O;
  }
}

export function actions(board: Board) {
  // Returns set of all possible actions (i, j) available on the board
  let actions: [number, number][] = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === null) {
        actions.push([i, j]);
      }
    }
  }
  return actions;
}

export function result(board: Board, action: [number, number]) {
  // Returns the board that results from making move (i, j) on the board.
  let boardClone = structuredClone(board);
  if (terminal(board) === true) {
    return board;
  } else if (
    boardClone[action[0]][action[1]] !== null ||
    action[0] < 0 ||
    action[0] > 2 ||
    action[1] < 0 ||
    action[1] > 2
  ) {
    throw Error("Invalid input.");
  } else {
    if (player(board) === O) {
      boardClone[action[0]][action[1]] = O;
    } else {
      boardClone[action[0]][action[1]] = X;
    }
  }
  return boardClone;
}

export function winner(board: Board) {
  // Horizontal
  for (let row of board) {
    if (row.every((cell) => cell === X)) return X;
    else if (row.every((cell) => cell === O)) return O;
  }

  // Vertical
  for (let i = 0; i < 3; i++) {
    if (board[0][i] === X && board[1][i] === X && board[2][i] === X) return X;
    else if (board[0][i] === O && board[1][i] === O && board[2][i] === O)
      return O;
  }

  // Main Diagonal
  if (board[0][0] === X && board[1][1] === X && board[2][2] === X) return X;
  else if (board[0][0] === O && board[1][1] === O && board[2][2] === O)
    return O;

  // Sub Diagonal
  if (board[0][2] === X && board[1][1] === X && board[2][0] === X) return X;
  else if (board[0][2] === O && board[1][1] === O && board[2][0] === O)
    return O;

  // No winner(game in progress or tied)
  return null;
}

export function terminal(board: Board) {
  if (winner(board) !== null) {
    return true;
  } else if (board.every((row) => row.every((cell) => cell !== EMPTY))) {
    return true;
  } else {
    return false;
  }
}

export function utility(board: Board) {
  if (winner(board) === X) {
    return 1;
  } else if (winner(board) === O) {
    return -1;
  } else {
    return 0;
  }
}

export function minimax(board: Board) {
  if (terminal(board)) {
    return null;
  }
  let alpha = -Infinity;
  let beta = Infinity;

  function maxValue(board: Board, alpha: number, beta: number) {
    let v = -Infinity;
    if (terminal(board)) {
      return utility(board);
    }
    for (let action of actions(board)) {
      v = Math.max(v, minValue(result(board, action), alpha, beta));
      if (v >= beta) {
        return v;
      }
      alpha = Math.max(alpha, v);
    }
    return v;
  }

  function minValue(board: Board, alpha: number, beta: number) {
    let v = Infinity;
    if (terminal(board)) {
      return utility(board);
    }
    for (let action of actions(board)) {
      v = Math.min(v, maxValue(result(board, action), alpha, beta));
      if (v <= alpha) {
        return v;
      }
      beta = Math.min(beta, v);
    }
    return v;
  }

  if (player(board) === X) {
    const allActions = actions(board).map((action) => {
      return {
        action: action,
        value: minValue(result(board, action), alpha, beta),
      };
    });
    return allActions.reduce((maxValue, action) => {
      return maxValue.value > action.value ? maxValue : action;
    }, allActions[0]).action;
  } else {
    const allActions = actions(board).map((action) => {
      return {
        action: action,
        value: maxValue(result(board, action), alpha, beta),
      };
    });
    return allActions.reduce((minValue, action) => {
      return minValue.value < action.value ? minValue : action;
    }, allActions[0]).action;
  }
}
