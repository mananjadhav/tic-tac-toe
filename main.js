var board = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

const PLAYER = -1;
const COMPUTER = 1;

function playCompFirst(button) {
  aiTurn();
}
function restartGame(button) {
  
  for(var i = 0; i < 3; i++) {
    for(var y = 0; y < 3; y++) {
      board[i][y] = 0;
      document.getElementById(String(i) + String(y)).innerHTML = "";
      document.getElementById(String(i) + String(y)).style.color = "#444";
    }
  }	
  document.getElementById("result").innerHTML = "Result will be displayed here";
}

function isGameOver(state, player) {
  var winRows = [
    [state[0][0], state[0][1], state[0][2]],
		[state[1][0], state[1][1], state[1][2]],
		[state[2][0], state[2][1], state[2][2]],
		[state[0][0], state[1][0], state[2][0]],
		[state[0][1], state[1][1], state[2][1]],
		[state[0][2], state[1][2], state[2][2]],
		[state[0][0], state[1][1], state[2][2]],
		[state[2][0], state[1][1], state[0][2]],
  ];

  for (var i = 0; i < 8; i++) {
		var line = winRows[i];
		var filled = 0;
		for (var j = 0; j < 3; j++) {
			if (line[j] == player)
				filled++;
		}
		if (filled == 3)
			return true;
	}
	return false;
}

function checkIfWinner(state) {
  if(isGameOver(state, PLAYER)) {
    return PLAYER;
  } else if(isGameOver(state, COMPUTER)) {
    return COMPUTER;
  }
  return 0;
}

function gameOverAll(state) {
	return isGameOver(state, PLAYER) || isGameOver(state, COMPUTER);
}

function getEmptyRows(state) {
	var blocks = [];
	for (var x = 0; x < 3; x++) {
		for (var y = 0; y < 3; y++) {
			if (state[x][y] == 0)
				blocks.push([x, y]);
		}
	}
	return blocks;
}

function isValidMove(x, y) {
	var empties = getEmptyRows(board);
	try {
		if (board[x][y] == 0) {
			return true;
		}
		else {
			return false;
		}
	} catch (e) {
		return false;
	}
}

function setMove(x, y, player) {
	if (isValidMove(x, y)) {
		board[x][y] = player;
		return true;
	}
	else {
		return false;
	}
}

function minimax(state, depth, player) {
	var best;

	if (player == COMPUTER) {
		best = [-1, -1, -1000];
	}
	else {
		best = [-1, -1, +1000];
	}

	if (depth == 0 || gameOverAll(state)) {
		var score = checkIfWinner(state);
		return [-1, -1, score];
	}

	getEmptyRows(state).forEach(function (cell) {
		var x = cell[0];
		var y = cell[1];
		state[x][y] = player;
		var score = minimax(state, depth - 1, -player);
		state[x][y] = 0;
		score[0] = x;
		score[1] = y;

		if (player == COMPUTER) {
			if (score[2] > best[2])
				best = score;
		}
		else {
			if (score[2] < best[2])
				best = score;
		}
	});

	return best;
}

/* It calls the minimax function */
function aiTurn() {
	var x, y;
	var move;
	var cell;

	if (getEmptyRows(board).length == 9) {
		x = parseInt(Math.random() * 3);
		y = parseInt(Math.random() * 3);
	}
	else {
		move = minimax(board, getEmptyRows(board).length, COMPUTER);
		x = move[0];
		y = move[1];
	}

	if (setMove(x, y, COMPUTER)) {
		cell = document.getElementById(String(x) + String(y));
		cell.innerHTML = "O";
	}
}

/* main */
function clickMove(cell) {
	var restartButton = document.getElementById("btn-restart");
  var compFirstButton = document.getElementById("btn-play");

	compFirstButton.disabled = true;
  restartButton.disabled = true;

	var conditionToContinue = gameOverAll(board) == false && getEmptyRows(board).length > 0;

	if (conditionToContinue == true) {
		var x = cell.id.split("")[0];
		var y = cell.id.split("")[1];
		var move = setMove(x, y, PLAYER);
		if (move == true) {
			cell.innerHTML = "X";
			if (conditionToContinue)
				aiTurn();
		}
	}
	if (isGameOver(board, COMPUTER)) {
		var lines;
		var cell;
		var msg;

		if (board[0][0] == 1 && board[0][1] == 1 && board[0][2] == 1)
			lines = [[0, 0], [0, 1], [0, 2]];
		else if (board[1][0] == 1 && board[1][1] == 1 && board[1][2] == 1)
			lines = [[1, 0], [1, 1], [1, 2]];
		else if (board[2][0] == 1 && board[2][1] == 1 && board[2][2] == 1)
			lines = [[2, 0], [2, 1], [2, 2]];
		else if (board[0][0] == 1 && board[1][0] == 1 && board[2][0] == 1)
			lines = [[0, 0], [1, 0], [2, 0]];
		else if (board[0][1] == 1 && board[1][1] == 1 && board[2][1] == 1)
			lines = [[0, 1], [1, 1], [2, 1]];
		else if (board[0][2] == 1 && board[1][2] == 1 && board[2][2] == 1)
			lines = [[0, 2], [1, 2], [2, 2]];
		else if (board[0][0] == 1 && board[1][1] == 1 && board[2][2] == 1)
			lines = [[0, 0], [1, 1], [2, 2]];
		else if (board[2][0] == 1 && board[1][1] == 1 && board[0][2] == 1)
			lines = [[2, 0], [1, 1], [0, 2]];

		for (var i = 0; i < lines.length; i++) {
			cell = document.getElementById(String(lines[i][0]) + String(lines[i][1]));
			cell.style.color = "red";
		}

		msg = document.getElementById("result");
		msg.innerHTML = "You lose!";
	}
	if (getEmptyRows(board).length == 0 && !gameOverAll(board)) {
		var msg = document.getElementById("result");
		msg.innerHTML = "Draw!";
	}
	if (gameOverAll(board) == true || getEmptyRows(board).length == 0) {
		restartButton.disabled = false;
    compFirstButton.disabled = false;
	}
}