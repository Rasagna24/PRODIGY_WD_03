// Global Variables
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameMode = ''; // Variable to track game mode: 'player-vs-player' or 'player-vs-ai'

// DOM Elements
const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset-button');
const message = document.getElementById('message');
const modeButtons = document.querySelectorAll('.mode-button');

// Initialize game
function initializeGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    cells.forEach(cell => {
        cell.innerText = '';
        cell.addEventListener('click', handleClick, { once: true });
    });
    displayMessage(`Player ${currentPlayer}'s turn`);
}

// Handle click on cell
function handleClick(e) {
    const cellIndex = parseInt(e.target.dataset.index);
    if (board[cellIndex] !== '') return; // Cell already clicked
    board[cellIndex] = currentPlayer;
    e.target.innerText = currentPlayer;
    
    if (checkWin(currentPlayer)) {
        displayMessage(`Player ${currentPlayer} wins!`);
        cells.forEach(cell => cell.removeEventListener('click', handleClick));
    } else if (checkDraw()) {
        displayMessage('It\'s a draw!');
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        displayMessage(`Player ${currentPlayer}'s turn`);
        if (gameMode === 'player-vs-ai' && currentPlayer === 'O') {
            // AI's turn
            aiMove();
        }
    }
}

// AI move with strategy to achieve 60% win rate
function aiMove() {
    let bestMove = getBestMove();
    
    setTimeout(() => {
        board[bestMove] = 'O';
        cells[bestMove].innerText = 'O';
        
        if (checkWin('O')) {
            displayMessage('AI wins!');
            disableClicks();
        } else if (checkDraw()) {
            displayMessage('It\'s a draw!');
        } else {
            currentPlayer = 'X';
            displayMessage(`Player ${currentPlayer}'s turn`);
        }
    }, 1000); // Delay AI move for demonstration (1 second)
}

// Function to determine the best move for AI
function getBestMove() {
    // Check for a winning move
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            if (checkWin('O')) {
                board[i] = '';
                return i;
            }
            board[i] = '';
        }
    }

    // Check for a blocking move
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = 'X';
            if (checkWin('X')) {
                board[i] = '';
                return i;
            }
            board[i] = '';
        }
    }

    // Take center cell if available
    if (board[4] === '') {
        return 4;
    }

    // Make a random move
    let emptyCells = board.reduce((acc, currentValue, index) => {
        if (currentValue === '') {
            acc.push(index);
        }
        return acc;
    }, []);

    let randomIndex = Math.floor(Math.random() * emptyCells.length);
    return emptyCells[randomIndex];
}

// Check for a win
function checkWin(player) {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    return winConditions.some(combination => {
        return combination.every(index => {
            return board[index] === player;
        });
    });
}

// Check for a draw
function checkDraw() {
    return board.every(cell => cell !== '');
}

// Display message
function displayMessage(msg) {
    message.innerText = msg;
}

// Reset game
resetButton.addEventListener('click', initializeGame);

// Set game mode
modeButtons.forEach(button => {
    button.addEventListener('click', function() {
        gameMode = this.dataset.mode;
        initializeGame();
        if (gameMode === 'player-vs-ai' && currentPlayer === 'O') {
            // If AI starts first in player vs AI mode
            aiMove();
        } else {
            displayMessage(`Player ${currentPlayer}'s turn`);
        }
    });
});

// Disable clicks on cells after game ends
function disableClicks() {
    cells.forEach(cell => cell.removeEventListener('click', handleClick));
}
