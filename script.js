import { TILE_STATUSES, createBoard, markTile, revealTile, checkWin, checkLose } from "./logic.js";

const BOARD_SIZE = 25;
const NUMBER_OF_MINES = 150;
const MESSAGE_WIN = "Congratulations! You win!";
const MESSAGE_LOSE = "You lose. Try next time!";

const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES);
const boardElement = document.querySelector('.board');
board.forEach(row => {
    row.forEach(tile => {
        boardElement.append(tile.element);
        tile.element.addEventListener('click', () => {
            revealTile(board, tile);
            checkGameEnd();
        });
        tile.element.addEventListener('contextmenu', e => {
            e.preventDefault();
            markTile(tile);
            listMinesLeft();
        })
    });
})
boardElement.style.setProperty('--size', BOARD_SIZE);

// Number of mines
const minesLeft = document.querySelector('[data-mines-left]');
minesLeft.textContent = NUMBER_OF_MINES;

const message = document.querySelector('.subtext');


const listMinesLeft = () => {
    const markedTilesLeft = board.reduce((count, row) => {
        return count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length;
    }, 0);
    minesLeft.textContent = NUMBER_OF_MINES - markedTilesLeft;
}

const checkGameEnd = () => {
    const win = checkWin(board);
    const lose = checkLose(board);
    if (win || lose) {
        boardElement.addEventListener('click', stopGame, { capture: true });
        boardElement.addEventListener('contextmenu', stopGame, { capture: true });
    }
    if (win) {
        message.textContent = MESSAGE_WIN;
    }
    if (lose) {
        message.textContent = MESSAGE_LOSE;
        board.forEach(row => {
            row.forEach(tile => {
                if (tile.status === TILE_STATUSES.MARKED) markTile(tile);
                if (tile.mine) revealTile(board, tile);
            })
        })
    }
}

const stopGame = (e) => {
    e.stopImmediatePropagation();
}