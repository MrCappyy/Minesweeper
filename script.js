// script.js

// DOM Elements
const gridElement = document.getElementById('grid');
const restartButton = document.getElementById('restart');
const gameOverModal = document.getElementById('game-over-modal');
const closeModalButton = document.getElementById('close-modal');
const themeToggle = document.getElementById('theme-toggle');

// Configuration
const rows = 10;
const cols = 10;
const minesCount = 15;
let grid = [];
let gameOver = false;

// Create Grid
function createGrid() {
  gridElement.innerHTML = '';
  gridElement.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  grid = [];
  gameOver = false;

  for (let row = 0; row < rows; row++) {
    grid[row] = [];
    for (let col = 0; col < cols; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = row;
      cell.dataset.col = col;

      cell.addEventListener('click', () => revealCell(row, col));
      cell.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        toggleFlag(row, col);
      });

      gridElement.appendChild(cell);
      grid[row][col] = { mine: false, revealed: false, flagged: false, element: cell };
    }
  }

  placeMines();
}

// Place Mines
function placeMines() {
  let placed = 0;
  while (placed < minesCount) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    if (!grid[row][col].mine) {
      grid[row][col].mine = true;
      placed++;
    }
  }
}

// Reveal Cell
function revealCell(row, col) {
  if (gameOver || grid[row][col].flagged || grid[row][col].revealed) return;

  const cell = grid[row][col];
  cell.revealed = true;
  cell.element.classList.add('revealed');

  if (cell.mine) {
    cell.element.classList.add('mine');
    revealMines();
    showGameOver();
    return;
  }

  const minesAround = countMinesAround(row, col);
  if (minesAround > 0) {
    cell.element.textContent = minesAround;
  } else {
    revealAdjacentCells(row, col);
  }
}

// Reveal Adjacent
function revealAdjacentCells(row, col) {
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const newRow = row + dr;
      const newCol = col + dc;
      if (isValid(newRow, newCol)) {
        revealCell(newRow, newCol);
      }
    }
  }
}

// Count Mines
function countMinesAround(row, col) {
  let count = 0;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const newRow = row + dr;
      const newCol = col + dc;
      if (isValid(newRow, newCol) && grid[newRow][newCol].mine) {
        count++;
      }
    }
  }
  return count;
}

// Toggle Flag
function toggleFlag(row, col) {
  if (gameOver || grid[row][col].revealed) return;

  const cell = grid[row][col];
  cell.flagged = !cell.flagged;
  cell.element.classList.toggle('flagged', cell.flagged);
}

// Reveal Mines
function revealMines() {
  grid.forEach(row =>
    row.forEach(cell => {
      if (cell.mine) {
        cell.element.classList.add('mine');
      }
    })
  );
}

// Show Game Over Modal
function showGameOver() {
  gameOver = true;
  gameOverModal.classList.add('visible');
}

// Smooth Restart Function
function smoothRestart() {
  gridElement.classList.add('hide'); // Add hide class for transition
  setTimeout(() => {
    gridElement.classList.remove('hide'); // Remove hide class after transition
    createGrid();
  }, 500); // Delay to match CSS transition duration
}

// Restart Game with Smooth Transition
closeModalButton.addEventListener('click', () => {
  gameOverModal.classList.remove('visible');
  smoothRestart();
});

restartButton.addEventListener('click', smoothRestart);

// Validate Cell
function isValid(row, col) {
  return row >= 0 && col >= 0 && row < rows && col < cols;
}

// Theme Toggle
themeToggle.addEventListener('change', () => {
  document.body.classList.toggle('light-mode', themeToggle.checked);
});

// Initialize Game
createGrid();
